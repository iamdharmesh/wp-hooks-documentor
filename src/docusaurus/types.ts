import { WPHooksDocConfig } from '../utils/types';

export interface DocusaurusConfig {
  /**
   * Site title
   */
  title: string;

  /**
   * Site tagline
   */
  tagline?: string;

  /**
   * Production URL of the site
   */
  url: string;

  /**
   * Base URL path (e.g., '/docs/')
   */
  baseUrl: string;

  /**
   * GitHub organization name
   */
  organizationName?: string;

  /**
   * GitHub project name
   */
  projectName?: string;

  /**
   * GitHub repository URL
   */
  repoUrl: string;

  /**
   * Custom templates directory path
   */
  templatesDir?: string;

  themeConfig?: {
    navbar?: {
      title?: string;
      logo?: {
        alt?: string;
        src?: string;
      };
      items?: Array<{
        to: string;
        label: string;
        position?: 'left' | 'right';
      }>;
    };
    footer?: {
      style?: 'dark' | 'light';
      copyright?: string;
    };
  };
}

export interface WPHooksDocTemplateVars extends WPHooksDocConfig {
  /**
   * Current year for copyright notice
   */
  currentYear: string;
}
