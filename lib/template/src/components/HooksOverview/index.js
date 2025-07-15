import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';

const HookTypes = [
  {
    title: 'Actions',
    description: (
      <>
        <p>
          Actions are hooks that the plugin uses to execute custom code at specific points during
          its execution. They allow you to add functionality or modify behavior.
        </p>
        <p>
          <strong>Adding an Action</strong>
        </p>
        <CodeBlock language="php">
          {`add_action('hook_name', function($arg1, $arg2) {
    // Your custom functionality
});`}
        </CodeBlock>
      </>
    ),
  },
  {
    title: 'Filters',
    description: (
      <>
        <p>
          Filters are hooks that allow you to modify data during execution. They provide a way to
          intercept and modify data as it passes through the plugin.
        </p>
        <p>
          <strong>Applying a Filter</strong>
        </p>
        <div className={styles.codeExample}>
          <CodeBlock language="php">
            {`add_filter('hook_name', function($value) {
    // Modify $value
    return $modified_value;
});`}
          </CodeBlock>
        </div>
      </>
    ),
  },
];

/**
 * HookType component
 *
 * @param {Object}          props             - The component props
 * @param {string}          props.title       - The title of the hook type
 * @param {React.ReactNode} props.description - The description of the hook type
 * @returns {JSX.Element} - The rendered hook type component
 */
function HookType({ title, description }) {
  return (
    <div className={clsx('col col--6')}>
      <div className={styles.hookTypeCard}>
        <div className={styles.hookTypeHeader}>
          <h3>{title}</h3>
        </div>
        <div className={styles.hookTypeContent}>{description}</div>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            href={`/hooks#${title.toLowerCase()}`}
          >
            Browse {title === 'Actions' ? 'Action' : 'Filter'} hooks →
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * HooksOverview component
 *
 * @returns {JSX.Element} - The rendered hooks overview component
 */
export default function HooksOverview() {
  return (
    <section className={styles.hookTypes}>
      <div className="container">
        <p>
          This documentation provides a comprehensive reference for all the hooks (actions and
          filters) available in the plugin. These hooks allow developers to customize and extend the
          plugin's functionality.
        </p>
        <div className="row">
          {HookTypes.map((props, idx) => (
            <HookType key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
