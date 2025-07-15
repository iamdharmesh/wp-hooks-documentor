/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import styles from './index.module.css';
import SearchBar from '@theme/SearchBar';
import HooksOverview from '../components/HooksOverview';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <SearchBar className={styles.searchBar} />
      </div>
    </header>
  );
}

/**
 * Homepage component
 *
 * @return {JSX.Element}
 */
export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <div className="container">
          <HooksOverview />
        </div>
      </main>
    </Layout>
  );
}
