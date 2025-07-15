import { WPHooksDocConfig } from '../utils/types';
export declare class DocusaurusSiteGenerator {
    private config;
    private templateVars;
    private templatesDir;
    private outputDir;
    private defaultTemplatesDir;
    constructor(config: Partial<WPHooksDocConfig>, outputDir: string);
    /**
     * Initialize a new Docusaurus site
     */
    initializeSite(): Promise<void>;
    /**
     * Copy and process template files
     */
    private copyTemplateFiles;
    /**
     * Process template content and replace variables
     */
    private processTemplate;
    /**
     * Install Docusaurus dependencies
     */
    private installDependencies;
    /**
     * Start development server
     */
    startDevServer(): void;
    /**
     * Build the site for production
     */
    buildSite(): void;
    /**
     * Deploy to GitHub Pages
     */
    deployToGitHub(): void;
}
