import { WPHooksDocConfig } from './utils/types';
export declare class Orchestrator {
    private config;
    private workingDir;
    constructor(config: WPHooksDocConfig);
    /**
     * Run the complete documentation workflow
     */
    run(): Promise<void>;
    /**
     * Clean output directories
     */
    private cleanOutput;
}
