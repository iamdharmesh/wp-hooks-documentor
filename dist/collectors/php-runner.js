"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PHPRunner = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const messages_1 = require("../utils/messages");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
const { ensureDir } = fs_extra_1.default;
class PHPRunner {
    constructor() {
        // Path to the PHP script
        this.phpScriptPath = path_1.default.resolve(__dirname, '../../lib/php/vendor/wp-hooks/generator/src/generate.php');
    }
    async checkPHPVersion() {
        try {
            const { stdout } = await execAsync('php -v');
            const versionMatch = stdout.match(/PHP (\d+\.\d+\.\d+)/);
            if (!versionMatch) {
                throw new Error(messages_1.MESSAGES.ERROR_PHP_VERSION_CHECK);
            }
            const version = versionMatch[1];
            const [major, minor] = version.split('.').map(Number);
            if (major < 8 || (major === 8 && minor < 3)) {
                throw new Error(messages_1.MESSAGES.ERROR_PHP_VERSION_REQUIREMENT);
            }
            console.log(messages_1.MESSAGES.PHP_VERSION_VALID);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`${messages_1.MESSAGES.ERROR_PHP_VERSION_CHECK}: ${error.message}`);
            }
            throw new Error(messages_1.MESSAGES.ERROR_PHP_VERSION_CHECK);
        }
    }
    async generateHooks(options) {
        try {
            await this.checkPHPVersion();
            // Ensure output directory exists
            await ensureDir(options.output);
            const args = [`--input=${options.input}`, `--output=${options.output}`];
            if (options.ignoreFiles?.length) {
                args.push(`--ignore-files=${options.ignoreFiles.join(',')}`);
            }
            if (options.ignoreHooks?.length) {
                args.push(`--ignore-hooks=${options.ignoreHooks.join(',')}`);
            }
            const command = `php "${this.phpScriptPath}" ${args.join(' ')}`;
            const { stderr } = await execAsync(command);
            if (stderr) {
                throw new Error(stderr);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`${messages_1.MESSAGES.ERROR_GENERATE_HOOKS}: ${error.message}`);
            }
            throw new Error(messages_1.MESSAGES.ERROR_GENERATE_HOOKS);
        }
    }
}
exports.PHPRunner = PHPRunner;
