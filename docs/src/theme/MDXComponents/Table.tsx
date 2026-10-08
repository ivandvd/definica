import React, {type ComponentProps, type ReactNode} from 'react';

/**
 * Markdown tables sit in a rounded, hairline-bordered container (`.df-table` in custom.css)
 * that scrolls sideways on a phone instead of widening the page.
 */
export default function MDXTable(props: ComponentProps<'table'>): ReactNode {
  return (
    <div className="df-table">
      <table {...props} />
    </div>
  );
}
