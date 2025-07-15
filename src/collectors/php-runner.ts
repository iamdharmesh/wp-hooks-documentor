import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fsExtra from 'fs-extra';
import { MESSAGES } from '../utils/messages';

const execAsync = promisify(exec);
const { ensureDir } = fsExtra;

interface GenerateOptions {
  input: string;
  output: string;
  ignoreFiles?: string[];
  ignoreHooks?: string[];
}

export class PHPRunner {
  private phpScriptPath: string;

  constructor() {
    // Path to the PHP script
    this.phpScriptPath = path.resolve(
      __dirname,
      '../../lib/php/vendor/wp-hooks/generator/src/generate.php'
    );
  }

  async checkPHPVersion(): Promise<void> {
    try {
      const { stdout } = await execAsync('php -v');
      const versionMatch = stdout.match(/PHP (\d+\.\d+\.\d+)/);

      if (!versionMatch) {
        throw new Error(MESSAGES.ERROR_PHP_VERSION_CHECK);
      }

      const version = versionMatch[1];
      const [major, minor] = version.split('.').map(Number);

      if (major < 8 || (major === 8 && minor < 3)) {
        throw new Error(MESSAGES.ERROR_PHP_VERSION_REQUIREMENT);
      }

      console.log(MESSAGES.PHP_VERSION_VALID);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${MESSAGES.ERROR_PHP_VERSION_CHECK}: ${error.message}`);
      }
      throw new Error(MESSAGES.ERROR_PHP_VERSION_CHECK);
    }
  }

  async generateHooks(options: GenerateOptions): Promise<void> {
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${MESSAGES.ERROR_GENERATE_HOOKS}: ${error.message}`);
      }
      throw new Error(MESSAGES.ERROR_GENERATE_HOOKS);
    }
  }
}
