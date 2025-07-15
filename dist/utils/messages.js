"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MESSAGES = void 0;
exports.MESSAGES = {
    PHP_NOT_FOUND: 'PHP is not installed or not accessible from command line',
    PHP_VERSION_ERROR: (version) => `PHP version ${version} is not supported. Required version is 8.3 or higher`,
    PHP_VERSION_VALID: '✓ PHP version check passed',
    ERROR_PHP_VERSION_CHECK: 'Failed to check PHP version',
    ERROR_PHP_VERSION_REQUIREMENT: 'PHP version 8.3 or higher is required',
    HOOKS_GENERATED: '✓ Hooks generated successfully',
    COLLECTING_HOOKS: '⚡ Collecting hooks from plugin...',
    PROCESSING_HOOKS: '🔄 Processing collected hooks...',
    SAVING_HOOKS: '💾 Saving processed hooks data...',
    ERROR_PLUGIN_PATH: 'Plugin path does not exist or is not accessible',
    ERROR_OUTPUT_PATH: 'Failed to create or access output directory',
    ERROR_GENERATE_HOOKS: 'Failed to generate hooks',
    ERROR_PROCESS_HOOKS: 'Failed to process hooks',
    // Markdown generation messages
    READING_HOOKS: '📖 Reading hooks data...',
    GENERATING_DOCS: '📝 Generating markdown documentation...',
    DOCS_GENERATED: '✨ Documentation has been generated successfully',
    ERROR_INPUT_FILE: 'Input file does not exist or is not accessible',
    ERROR_GENERATE_DOCS: 'Failed to generate markdown documentation',
};
