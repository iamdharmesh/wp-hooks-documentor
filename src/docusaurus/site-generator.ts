import path from 'path';
import fs from 'fs-extra';
import { WPHooksDocTemplateVars } from './types';
import { execSync } from 'child_process';
import { WPHooksDocConfig } from '../utils/types';

export class DocusaurusSiteGenerator {
  private config: Partial<WPHooksDocConfig>;
  private templateVars: Partial<WPHooksDocTemplateVars>;
  private templatesDir: string;
  private outputDir: string;
  private defaultTemplatesDir: string;

  constructor(config: Partial<WPHooksDocConfig>, outputDir: string) {
    this.config = config;
    this.outputDir = outputDir;
    this.defaultTemplatesDir = path.join(__dirname, '../../lib/template');
    this.templatesDir = config.templatesDir || '';

    this.templateVars = {
      ...config,
      currentYear: new Date().getFullYear().toString(),
    };
  }

  /**
   * Initialize a new Docusaurus site
   */
  public async initializeSite(): Promise<void> {
    // Create output directory if it doesn't exist
    await fs.ensureDir(this.outputDir);

    // Copy template files
    await this.copyTemplateFiles();

    // Create docs directory
    await fs.ensureDir(path.join(this.outputDir, 'docs/hooks'));

    // Copy markdown files if they exist
    const hooksDir = path.join(this.outputDir, 'hooks');
    if (fs.existsSync(hooksDir)) {
      await fs.copy(hooksDir, path.join(this.outputDir, 'docs/hooks'));
      await fs.remove(hooksDir);
    }

    // Install dependencies
    await this.installDependencies();
  }

  /**
   * Copy and process template files
   */
  private async copyTemplateFiles(): Promise<void> {
    const files = ['docusaurus.config.js', 'package.json'];
    // Copy all files from the default templates directory
    await fs.copy(this.defaultTemplatesDir, this.outputDir);

    // Copy files from the templates directory if it exists
    if (this.templatesDir) {
      await fs.copy(this.templatesDir, this.outputDir);
    }

    for (const file of files) {
      const defaultSourcePath = path.join(this.defaultTemplatesDir, file);
      const sourcePath = path.join(this.templatesDir, file);
      const targetPath = path.join(this.outputDir, file);

      // Skip if template file doesn't exist (for optional files)
      const filePath =
        fs.existsSync(sourcePath) && this.templatesDir ? sourcePath : defaultSourcePath;
      if (!fs.existsSync(filePath)) {
        console.warn(`Warning: Template file not found: ${filePath}`);
        continue;
      }

      // Ensure target directory exists
      await fs.ensureDir(path.dirname(targetPath));

      // Read template file
      let content = await fs.readFile(filePath, 'utf8');

      // Replace template variables
      content = this.processTemplate(content);

      // Write processed file
      await fs.writeFile(targetPath, content);
    }
  }

  /**
   * Process template content and replace variables
   */
  private processTemplate(content: string): string {
    return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      const value = this.templateVars[key as keyof WPHooksDocTemplateVars];
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
  private async installDependencies(): Promise<void> {
    try {
      process.chdir(this.outputDir);
      execSync('npm install', { stdio: 'inherit' });
    } catch (error) {
      throw new Error(`Failed to install dependencies: ${error}`);
    }
  }

  /**
   * Start development server
   */
  public startDevServer(): void {
    try {
      process.chdir(this.outputDir);
      execSync('npm run start', { stdio: 'inherit' });
    } catch (error) {
      throw new Error(`Failed to start development server: ${error}`);
    }
  }

  /**
   * Build the site for production
   */
  public buildSite(): void {
    try {
      process.chdir(this.outputDir);
      execSync('npm run build', { stdio: 'inherit' });
    } catch (error) {
      throw new Error(`Failed to build site: ${error}`);
    }
  }

  /**
   * Deploy to GitHub Pages
   */
  public deployToGitHub(): void {
    try {
      process.chdir(this.outputDir);
      execSync('npm run deploy', { stdio: 'inherit' });
    } catch (error) {
      throw new Error(`Failed to deploy to GitHub Pages: ${error}`);
    }
  }
}
