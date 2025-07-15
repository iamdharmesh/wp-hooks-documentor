import { HookCollection } from '../utils/types';
export interface MarkdownGeneratorConfig {
    /**
     * The output directory for the markdown files
     */
    outputDir: string;
    /**
     * Plugin name for documentation
     * @default 'Plugin Hooks Documentation'
     */
    title?: string;
    /**
     * Plugin description for documentation
     * @default ''
     */
    tagline?: string;
    /**
     * Github source code url for the plugin
     * @default ''
     */
    githubSourceCodeUrl?: string;
}
export declare class MarkdownGenerator {
    private config;
    constructor(config: MarkdownGeneratorConfig);
    /**
     * Generates markdown documentation from the hook collection
     */
    generate(hookCollection: HookCollection): Promise<void>;
    /**
     * Generates documentation for a single hook
     */
    private generateHookFile;
    /**
     * Generates the main index file
     */
    private generateMainIndex;
    private sanitizeContent;
    private sanitizeHookName;
}
