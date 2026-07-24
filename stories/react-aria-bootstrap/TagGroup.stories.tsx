import type { Meta, StoryObj } from '@storybook/react';
import { TagGroup, Tag } from '../../src/react-aria-bootstrap/TagGroup';

const meta: Meta<typeof TagGroup> = {
  title: 'Bootstrap/TagGroup',
  component: TagGroup,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    selectionMode: {
      control: 'inline-radio',
      options: ['none', 'single', 'multiple'],
      description:
        'Whether tags can be selected, and whether one or many at a time. No Bootstrap-side visual distinction exists between `single` and `multiple` — only `none` (unselectable) looks different.',
    },
  },
  args: {
    label: 'Categories',
  },
};

export default meta;

type Story = StoryObj<typeof TagGroup>;

export const Default: Story = {
  render: (args) => (
    <TagGroup {...args}>
      <Tag id="news">News</Tag>
      <Tag id="travel">Travel</Tag>
      <Tag id="politics">International Politics &amp; Culture</Tag>
      <Tag id="shopping">Shopping</Tag>
    </TagGroup>
  ),
};

const selectionModeLabels = {
  none: 'None',
  single: 'Single',
  multiple: 'Multiple',
} as const;

const selectionModeDefaultKeys: Record<keyof typeof selectionModeLabels, string[] | undefined> = {
  none: undefined,
  single: ['design'],
  multiple: ['design', 'marketing'],
};

/**
 * All supported `selectionMode` values (React Aria's own `SelectionMode`
 * union) side by side. Bootstrap-side visual treatment is identical for
 * `single` and `multiple` (taxonomy Decision D3) — both are shown with a
 * pre-selected subset via `defaultSelectedKeys` to confirm the shared
 * `[data-selected]` fill; `none` renders unselectable tags with no
 * selection affordance at all.
 */
export const Variants: Story = {
  render: () => (
    <div className="d-flex flex-column gap-4">
      {(['none', 'single', 'multiple'] as const).map((key) => (
        <div key={key}>
          <p className="fw-semibold mb-1">{selectionModeLabels[key]}</p>
          <TagGroup
            aria-label={`Categories — ${selectionModeLabels[key]} selection`}
            selectionMode={key}
            defaultSelectedKeys={selectionModeDefaultKeys[key]}
          >
            <Tag id="design">Design</Tag>
            <Tag id="engineering">Engineering</Tag>
            <Tag id="marketing">Marketing</Tag>
          </TagGroup>
        </div>
      ))}
    </div>
  ),
};

/**
 * Disabling is per-tag (`isDisabled` on `Tag`, or `disabledKeys` on
 * `TagGroup`) — `TagGroup` has no top-level disabled prop.
 */
export const Disabled: Story = {
  render: (args) => (
    <TagGroup {...args}>
      <Tag id="design">Design</Tag>
      <Tag id="engineering" isDisabled>
        Engineering
      </Tag>
      <Tag id="marketing">Marketing</Tag>
    </TagGroup>
  ),
};

/**
 * `TagGroup` has no native `isInvalid`/validation state (absent from its
 * prop surface) — `errorMessage` is purely author-controlled and always
 * renders `.invalid-feedback` once passed, with no state gating it.
 */
export const Invalid: Story = {
  args: {
    errorMessage: 'Select at least one category.',
  },
  render: (args) => (
    <TagGroup {...args}>
      <Tag id="design">Design</Tag>
      <Tag id="engineering">Engineering</Tag>
      <Tag id="marketing">Marketing</Tag>
    </TagGroup>
  ),
};

export const WithDescription: Story = {
  args: {
    description: 'Select all categories that apply.',
  },
  render: (args) => (
    <TagGroup {...args}>
      <Tag id="design">Design</Tag>
      <Tag id="engineering">Engineering</Tag>
      <Tag id="marketing">Marketing</Tag>
    </TagGroup>
  ),
};
