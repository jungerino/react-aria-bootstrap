import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '../../src/react-aria-bootstrap/Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Bootstrap/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description:
        'Tab list layout direction. No dedicated Bootstrap modifier class exists for vertical tabs — the layout is driven by flex-direction alone.',
    },
    keyboardActivation: {
      control: 'inline-radio',
      options: ['automatic', 'manual'],
      description:
        'Whether arrow-key navigation selects a tab immediately (`automatic`) or only moves focus until Enter/Space is pressed (`manual`). Behavioral only — no visual difference.',
    },
    fill: {
      control: 'inline-radio',
      options: ['proportional', 'justified'],
      description:
        'Applies `.nav-fill` (proportional width) or `.nav-justified` (forced equal width) to the TabList. Leave unset for tabs sized to their own content.',
    },
  },
  args: {
    defaultSelectedKey: 'home',
  },
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabList aria-label="Settings">
        <Tab id="home">Home</Tab>
        <Tab id="profile">Profile</Tab>
        <Tab id="settings">Settings</Tab>
      </TabList>
      <TabPanels>
        <TabPanel id="home">Home panel content.</TabPanel>
        <TabPanel id="profile">Profile panel content.</TabPanel>
        <TabPanel id="settings">Settings panel content.</TabPanel>
      </TabPanels>
    </Tabs>
  ),
};

const fillLabels = {
  proportional: 'Proportional',
  justified: 'Justified',
} as const;

/**
 * All supported `fill` values (Decision D3: custom prop, no React Aria
 * equivalent) side by side. Each specimen mixes a short label ("Tab") and a
 * long one ("Much longer nav link") to make the differing width-distribution
 * behavior visible — proportional sizes each tab to its own content first,
 * then distributes remaining space; justified forces every tab to the exact
 * same width regardless of content.
 */
export const Variants: Story = {
  render: () => (
    <div className="d-flex flex-column gap-4">
      {(['proportional', 'justified'] as const).map((key) => (
        <div key={key}>
          <p className="fw-semibold mb-1">{fillLabels[key]}</p>
          <Tabs fill={key} defaultSelectedKey="a">
            <TabList aria-label={`${fillLabels[key]} tabs`}>
              <Tab id="a">Tab</Tab>
              <Tab id="b">Much longer nav link</Tab>
              <Tab id="c">Tab</Tab>
            </TabList>
          </Tabs>
        </div>
      ))}
    </div>
  ),
};

/**
 * Disabling is per-tab (`isDisabled` on `Tab`) — Tabs has no top-level
 * disabled prop. The disabled tab has no matching `TabPanel`, since a
 * disabled tab can never become selected and so never needs content to show.
 */
export const Disabled: Story = {
  render: () => (
    <Tabs defaultSelectedKey="home">
      <TabList aria-label="Settings">
        <Tab id="home">Home</Tab>
        <Tab id="profile">Profile</Tab>
        <Tab id="settings" isDisabled>
          Settings
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel id="home">Home panel content.</TabPanel>
        <TabPanel id="profile">Profile panel content.</TabPanel>
      </TabPanels>
    </Tabs>
  ),
};
