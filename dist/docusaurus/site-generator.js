"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocusaurusSiteGenerator = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const child_process_1 = require("child_process");
class DocusaurusSiteGenerator {
    constructor(config, outputDir) {
        this.config = config;
        this.outputDir = outputDir;
        this.defaultTemplatesDir = path_1.default.join(__dirname, '../../lib/template');
        this.templatesDir = config.templatesDir || '';
        this.templateVars = {
            ...config,
            currentYear: new Date().getFullYear().toString(),
        };
    }
    /**
     * Initialize a new Docusaurus site
     */
    async initializeSite() {
        // Create output directory if it doesn't exist
        await fs_extra_1.default.ensureDir(this.outputDir);
        // Copy template files
        await this.copyTemplateFiles();
        // Create docs directory
        await fs_extra_1.default.ensureDir(path_1.default.join(this.outputDir, 'docs/hooks'));
        // Copy markdown files if they exist
        const hooksDir = path_1.default.join(this.outputDir, 'hooks');
        if (fs_extra_1.default.existsSync(hooksDir)) {
            await fs_extra_1.default.copy(hooksDir, path_1.default.join(this.outputDir, 'docs/hooks'));
            await fs_extra_1.default.remove(hooksDir);
        }
        // Install dependencies
        await this.installDependencies();
    }
    /**
     * Copy and process template files
     */
    async copyTemplateFiles() {
        const files = ['docusaurus.config.js', 'package.json'];
        // Copy all files from the default templates directory
        await fs_extra_1.default.copy(this.defaultTemplatesDir, this.outputDir);
        // Copy files from the templates directory if it exists
        if (this.templatesDir) {
            await fs_extra_1.default.copy(this.templatesDir, this.outputDir);
        }
        for (const file of files) {
            const defaultSourcePath = path_1.default.join(this.defaultTemplatesDir, file);
            const sourcePath = path_1.default.join(this.templatesDir, file);
            const targetPath = path_1.default.join(this.outputDir, file);
            // Skip if template file doesn't exist (for optional files)
            const filePath = fs_extra_1.default.existsSync(sourcePath) && this.templatesDir ? sourcePath : defaultSourcePath;
            if (!fs_extra_1.default.existsSync(filePath)) {
                console.warn(`Warning: Template file not found: ${filePath}`);
                continue;
            }
            // Ensure target directory exists
            await fs_extra_1.default.ensureDir(path_1.default.dirname(targetPath));
            // Read template file
            let content = await fs_extra_1.default.readFile(filePath, 'utf8');
            // Replace template variables
            content = this.processTemplate(content);
            // Write processed file
            await fs_extra_1.default.writeFile(targetPath, content);
        }
    }
    /**
     * Process template content and replace variables
     */
    processTemplate(content) {
        return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            const value = this.templateVars[key];
            if (typeof value === 'string') {
                return value;
            }
            if (typeof value === 'object') {
                return JSON.stringify(value, null, 2);
            }
            return match;
        });
    }
    /**
     * Install Docusaurus dependencies
     */
    async installDependencies() {
        try {
            process.chdir(this.outputDir);
            (0, child_process_1.execSync)('npm install', { stdio: 'inherit' });
        }
        catch (error) {
            throw new Error(`Failed to install dependencies: ${error}`);
        }
    }
    /**
     * Start development server
     */
    startDevServer() {
        try {
            process.chdir(this.outputDir);
            (0, child_process_1.execSync)('npm run start', { stdio: 'inherit' });
        }
        catch (error) {
            throw new Error(`Failed to start development server: ${error}`);
        }
    }
    /**
     * Build the site for production
     */
    buildSite() {
        try {
            process.chdir(this.outputDir);
            (0, child_process_1.execSync)('npm run build', { stdio: 'inherit' });
        }
        catch (error) {
            throw new Error(`Failed to build site: ${error}`);
        }
    }
    /**
     * Deploy to GitHub Pages
     */
    deployToGitHub() {
        try {
            process.chdir(this.outputDir);
            (0, child_process_1.execSync)('npm run deploy', { stdio: 'inherit' });
        }
        catch (error) {
            throw new Error(`Failed to deploy to GitHub Pages: ${error}`);
        }
    }
}
exports.DocusaurusSiteGenerator = DocusaurusSiteGenerator;
