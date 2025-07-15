import path from 'path';
import fs from 'fs-extra';
import { HookCollector } from './collectors/hook-collector';
import { MarkdownGenerator } from './generators/markdown-generator';
import { DocusaurusSiteGenerator } from './docusaurus/site-generator';
import { WPHooksDocConfig } from './utils/types';

export class Orchestrator {
  private config: WPHooksDocConfig;
  private workingDir: string;

  constructor(config: WPHooksDocConfig) {
    this.config = config;
    this.workingDir = process.cwd();
  }

  /**
   * Run the complete documentation workflow
   */
  public async run(): Promise<void> {
    try {
      console.log('🚀 Starting documentation generation...');

      // Clean output if requested
      if (this.config.clean) {
        await this.cleanOutput();
      }

      // Collect hooks
      console.log('📦 Collecting hooks...');
      const collector = new HookCollector({
        input: this.config.input || '.',
        ignoreFiles: this.config.ignoreFiles || [],
        ignoreHooks: this.config.ignoreHooks || [],
        outputDir: this.config.outputDir || './wp-hooks-docs',
      });
      const hookData = await collector.collect();
      console.log(
        `✅ Found ${Object.keys(hookData.actions).length + Object.keys(hookData.filters).length} hooks`
      );

      // Generate markdown
      if (hookData) {
        console.log('📝 Generating markdown documentation...');
        const generator = new MarkdownGenerator({
          outputDir: this.config.outputDir || './wp-hooks-docs',
          title: this.config.title || 'Plugin Hooks Documentation',
          tagline: this.config.tagline || 'Hooks Documentation for Plugin',
          githubSourceCodeUrl: this.config.githubSourceCodeUrl || '',
        });
        await generator.generate(hookData);
        console.log('✅ Markdown documentation generated');
      }

      // Build Docusaurus site
      console.log('🏗️  Building documentation site...');
      const siteGenerator = new DocusaurusSiteGenerator(
        {
          title: this.config.title || 'Plugin Hooks Documentation',
          tagline: this.config.tagline || 'Hooks Documentation for Plugin',
          url: this.config.url || 'https://example.com',
          baseUrl: this.config.baseUrl || '/',
          repoUrl: this.config.repoUrl || 'https://github.com/iamdharmesh/wp-hooks-documentor',
          organizationName: this.config.organizationName,
          projectName: this.config.projectName,
          templatesDir: this.config.templatesDir,
          footerStyle: this.config.footerStyle || 'dark',
          footerCopyright:
            this.config.footerCopyright ||
            `Copyright © ${new Date().getFullYear().toString()} ${this.config.title || ''}. Built with WP Hooks Documentor.`,
        },
        path.join(this.workingDir, this.config.outputDir)
      );
      await siteGenerator.initializeSite();
      siteGenerator.buildSite();
      console.log('✅ Documentation site built');
      console.log('🎉 Documentation generation complete!');
    } catch (error) {
      console.error('❌ Error generating documentation:', error);
      throw error;
    }
  }

  /**
   * Clean output directories
   */
  private async cleanOutput(): Promise<void> {
    console.log('🧹 Cleaning output directories...');

    // Clean markdown output
    await fs.remove(this.config.outputDir);

    // Clean Docusaurus site
    await fs.remove(path.join(this.workingDir, 'docs-site'));

    console.log('✅ Output directories cleaned');
  }
}
