// Bootstrap reference: https://getbootstrap.com/docs/5.3/components/list-group/#basic-example
// Pattern: .list-group + .list-group-item.
// For interactive lists, .list-group-item-action adds hover/active/focus states.
// React Aria's ListBox renders a list container with interactive item children.

import type { Meta, StoryObj } from '@storybook/react';
import { withBootstrapTest } from './_decorators';

const meta: Meta = {
  title: 'Bootstrap Reference/ListBox',
  decorators: [withBootstrapTest],
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;

export const Basic: StoryObj = {
  parameters: {
    docs: { description: { story: '**Source:** [Bootstrap Docs — List group › Basic example](https://getbootstrap.com/docs/5.3/components/list-group/#basic-example)' } },
  },
  render: () => (
    <ul className="list-group" style={{ width: 240 }}>
      <li className="list-group-item">An item</li>
      <li className="list-group-item">A second item</li>
      <li className="list-group-item">A third item</li>
      <li className="list-group-item">A fourth item</li>
      <li className="list-group-item">And a fifth one</li>
    </ul>
  ),
};

export const Interactive: StoryObj = {
  parameters: {
    docs: { description: { story: '**Source:** [Bootstrap Docs — List group › Links and buttons](https://getbootstrap.com/docs/5.3/components/list-group/#links-and-buttons) (`.list-group-item-action` adds hover/active/focus states)' } },
  },
  render: () => (
    <div className="list-group" style={{ width: 240 }}>
      <a href="#" className="list-group-item list-group-item-action">An item</a>
      <a href="#" className="list-group-item list-group-item-action active" aria-current="true">A second item (active)</a>
      <a href="#" className="list-group-item list-group-item-action">A third item</a>
      <a href="#" className="list-group-item list-group-item-action disabled" aria-disabled="true">A fourth item (disabled)</a>
    </div>
  ),
};
