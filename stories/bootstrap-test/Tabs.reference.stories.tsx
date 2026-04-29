// Bootstrap reference: https://getbootstrap.com/docs/5.3/components/navs-tabs/#tabs
// Pattern: .nav.nav-tabs + .nav-link (on <button>) + .tab-content + .tab-pane.
// React Aria's Tabs renders <div> tab items (not <a> or <button>) — cursor and active state
// must be bridged explicitly.
// Tab switching requires Bootstrap JS — only static active state shown here.

import type { Meta, StoryObj } from '@storybook/react';
import { withBootstrapTest } from './_decorators';

const meta: Meta = {
  title: 'Bootstrap Reference/Tabs',
  decorators: [withBootstrapTest],
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;

export const Default: StoryObj = {
  parameters: {
    docs: { description: { story: '**Source:** [Bootstrap Docs — Navs & Tabs › Tabs](https://getbootstrap.com/docs/5.3/components/navs-tabs/#tabs)' } },
  },
  render: () => (
    <div style={{ width: 400 }}>
      <ul className="nav nav-tabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button className="nav-link active" type="button" role="tab" aria-selected="true">Home</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" type="button" role="tab" aria-selected="false">Profile</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" type="button" role="tab" aria-selected="false">Contact</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" type="button" role="tab" aria-selected="false" disabled>Disabled</button>
        </li>
      </ul>
      <div className="tab-content">
        <div className="tab-pane fade show active p-3" role="tabpanel" tabIndex={0}>
          Tab panel content for Home.
        </div>
      </div>
    </div>
  ),
};
