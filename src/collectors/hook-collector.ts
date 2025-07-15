import { PHPRunner } from './php-runner';
import {
  HookCollection,
  Hook,
  RawHookCollection,
  RawHookData,
  HookCollectorConfig,
} from '../utils/types';
import fsExtra from 'fs-extra';
import path from 'path';
import { MESSAGES } from '../utils/messages';

const { readJSON, ensureDir } = fsExtra;

export class HookCollector {
  private phpRunner: PHPRunner;

  constructor(private config: HookCollectorConfig) {
    this.phpRunner = new PHPRunner();
  }

  async collect(): Promise<HookCollection> {
    try {
      console.log(MESSAGES.COLLECTING_HOOKS);

      // Ensure output directory exists
      await ensureDir(this.config.outputDir);

      // Generate hooks using wp-hooks/generator
      await this.phpRunner.generateHooks({
        input: this.config.input,
        output: path.join(this.config.outputDir, '.hooks-temp'),
        ignoreFiles: this.config.ignoreFiles,
        ignoreHooks: this.config.ignoreHooks,
      });

      console.log(MESSAGES.PROCESSING_HOOKS);

      // Read and parse the generated files
      const actionsFile = path.join(this.config.outputDir, '.hooks-temp/actions.json');
      const filtersFile = path.join(this.config.outputDir, '.hooks-temp/filters.json');

      const [actions, filters] = await Promise.all([readJSON(actionsFile), readJSON(filtersFile)]);

      // Transform and deduplicate hooks
      const collection = this.transformHooks({ actions, filters });

      // Clean JSON files
      await fsExtra.remove(path.join(this.config.outputDir, '.hooks-temp'));

      console.log(MESSAGES.HOOKS_GENERATED);

      return collection;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${MESSAGES.ERROR_PROCESS_HOOKS}: ${error.message}`);
      }
      throw new Error(MESSAGES.ERROR_PROCESS_HOOKS);
    }
  }

  private transformHooks(rawData: RawHookCollection): HookCollection {
    // Deduplicate hooks based on name
    return {
      actions: rawData.actions.hooks.map(this.transformHook.bind(this)),
      filters: rawData.filters.hooks.map(this.transformHook.bind(this)),
    };
  }

  private transformHook(hook: RawHookData['hooks'][0]): Hook {
    let hookName = hook.name;

    /**
     * Replace PHP-style interpolations with {$var}_suffix
     * Example:
     * 'woocommerce_analytics_' . $field . '_' . $context
     * becomes
     * 'woocommerce_analytics_{$field}_$context'
     */
    hookName = hookName.replace(
      /['"]\s*\.\s*(\$(?:[a-zA-Z_]\w*)(?:->\w+|\[[^\]]+\]|\(\))*((?:->\w+|\[[^\]]+\]|\(\)))*)\s*\.\s*['"]?_?([a-zA-Z0-9_]*)/g,
      (_, variable, rest, suffix) => `{${variable}${rest || ''}}${suffix ? `_${suffix}` : ''}`
    );

    /**
     * Handle trailing .$var without suffix
     * Example:
     * 'woocommerce_analytics_' . $field
     * becomes
     * 'woocommerce_analytics_{$field}'
     */
    hookName = hookName.replace(
      /['"]\s*\.\s*(\$(?:[a-zA-Z_]\w*)(?:->\w+|\[[^\]]+\]|\(\))*((?:->\w+|\[[^\]]+\]|\(\)))*)/g,
      (_, variable, rest) => `{${variable}${rest || ''}}`
    );

    /**
     * Remove quotes from hook name
     */
    hookName = hookName.replace(/['"]/g, '');

    const hookId = hookName
      .replace(/[^a-zA-Z0-9\-_.~]/g, '')
      .replace(/^__/, '')
      .replace(/^_/, '');

    return {
      id: hookId,
      name: hookName,
      type: hook.type,
      file: hook.file,
      line: hook.line || 0,
      doc: {
        description: hook.doc?.description || '',
        long_description: hook.doc?.long_description || '',
        long_description_html: hook.doc?.long_description_html || '',
        since: hook.doc?.tags?.filter((tag) => tag.name === 'since') || [],
        params:
          hook.doc?.tags
            ?.filter((tag) => tag.name === 'param')
            ?.map((p) => ({
              name: p.variable || '',
              type: p.types?.join('|') || '',
              description: p.content || '',
            })) || [],
        tags:
          hook.doc?.tags?.filter(
            (tag) => tag.name !== 'param' && tag.name !== 'return' && tag.name !== 'since'
          ) || [],
        return:
          (hook.doc?.tags
            ?.filter((tag) => tag.name === 'return')
            ?.map((tag) => ({
              type: tag.types?.join('|') || '',
              description: tag.content || '',
            })) || [])[0] || null,
      },
      source: hook.source,
    };
  }
}
