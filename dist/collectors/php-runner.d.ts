interface GenerateOptions {
    input: string;
    output: string;
    ignoreFiles?: string[];
    ignoreHooks?: string[];
}
export declare class PHPRunner {
    private phpScriptPath;
    constructor();
    checkPHPVersion(): Promise<void>;
    generateHooks(options: GenerateOptions): Promise<void>;
}
export {};
