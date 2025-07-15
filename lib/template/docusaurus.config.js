// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '{{title}}',
  tagline: '{{tagline}}',
  favicon: 'img/favicon.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  url: '{{url}}',
  baseUrl: '{{baseUrl}}',

  organizationName: '{{organizationName}}',
  projectName: '{{projectName}}',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: '/',
          breadcrumbs: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        indexDocs: true,
        docsRouteBasePath: '/',
        docsDir: 'docs',
        hashed: true,
        highlightSearchTermsOnTargetPage: true,
        searchBarPosition: 'right',
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: '{{title}}',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'hooksSidebar',
          position: 'left',
          label: 'Hooks',
          href: '/hooks',
          sidebarCollapsed: false,
        },
        {
          href: '{{repoUrl}}',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: '{{footerStyle}}',
      copyright: '{{footerCopyright}}',
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['php'],
    },
  },
};

export default config;
