import type { Meta, StoryObj } from '@storybook/react';
import { withBootstrap } from '../_decorators';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '../../../src/react-aria-bootstrap/Tabs';
import '../presentation.scss';

const meta: Meta = {
  title: 'Bootstrap Mirror/Tabs',
  decorators: [withBootstrap],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Mirrors reference story "Default" — real Tabs instance with four tabs
 * ("Disabled" via real `isDisabled`), one real `TabPanel` per selectable tab
 * so the visible panel content always matches whichever tab is actually
 * selected (realism note, taxonomy Reference story canvas item 1). The root
 * `.react-aria-Tabs[data-orientation='horizontal']` bridge supplies the
 * vertical rhythm between the nav and its content (no outer `.ref-stack`
 * wrapper needed — that spacing is baked into the real component itself).
 */
export const Default: Story = {
  render: () => (
    <Tabs defaultSelectedKey="home">
      <TabList aria-label="Reference tabs">
        <Tab id="home">Home</Tab>
        <Tab id="profile">Profile</Tab>
        <Tab id="settings">Settings</Tab>
        <Tab id="disabled" isDisabled>Disabled</Tab>
      </TabList>
      <TabPanels>
        <TabPanel id="home">Home panel content.</TabPanel>
        <TabPanel id="profile">Profile panel content.</TabPanel>
        <TabPanel id="settings">Settings panel content.</TabPanel>
      </TabPanels>
    </Tabs>
  ),
};

/**
 * Mirrors reference story "States" — full interactive state matrix for
 * `.nav-underline .nav-link` (P-009/P-013). Hover and focus-visible use
 * `.faux-hover`/`.faux-focus-visible` (P044; already defined in
 * `presentation.scss` for the Tabs reference story) since a single static
 * render can't produce real browser hover/keyboard-focus. Selected and
 * Disabled use real `defaultSelectedKey`/`isDisabled` (P-007) — both real
 * Bootstrap classes, no faux needed.
 *
 * "Selected" and "Selected + Disabled" cannot coexist as data-selected
 * within one `Tabs` instance (Tabs allows exactly one selected tab at a
 * time, unlike the reference's static HTML which applies `.active` freely
 * to multiple unrelated buttons) — so this specimen uses two adjacent `Tabs`
 * instances, each with its own `defaultSelectedKey`, joined by a `d-flex
 * gap-3` row. `.gap-3` (1rem) matches `.nav-underline`'s own
 * `--bs-nav-underline-gap` (1rem) exactly, so the boundary between the two
 * TabLists reads as the same uniform rhythm as the gaps within each —
 * visually indistinguishable from one continuous row.
 */
export const States: Story = {
  render: () => (
    <div className="d-flex gap-3">
      <Tabs defaultSelectedKey="selected">
        <TabList aria-label="Tab states">
          <Tab id="resting">Resting</Tab>
          <Tab id="hover" className="faux-hover">Hover</Tab>
          <Tab id="focused" className="faux-focus-visible">Focused</Tab>
          <Tab id="selected">Selected</Tab>
          <Tab id="disabled" isDisabled>Disabled</Tab>
        </TabList>
      </Tabs>
      <Tabs defaultSelectedKey="selected-disabled">
        <TabList aria-label="Tab states (selected and disabled)">
          <Tab id="selected-disabled" isDisabled>Selected + Disabled</Tab>
        </TabList>
      </Tabs>
    </div>
  ),
};

/**
 * Mirrors reference story "Vertical" — `orientation="vertical"` drives both
 * the root's `flex-direction: row` (Tabs bridge) and the TabList's
 * `flex-direction: column` (TabList bridge) automatically via RAC's own
 * `data-orientation` attribute; no manual class needed beyond what `Tabs`/
 * `TabList` already apply.
 */
export const Vertical: Story = {
  render: () => (
    <Tabs orientation="vertical" defaultSelectedKey="home">
      <TabList aria-label="Vertical tabs">
        <Tab id="home">Home</Tab>
        <Tab id="profile">Profile</Tab>
        <Tab id="disabled" isDisabled>Disabled</Tab>
      </TabList>
      <TabPanels>
        <TabPanel id="home">Home panel content.</TabPanel>
        <TabPanel id="profile">Profile panel content.</TabPanel>
      </TabPanels>
    </Tabs>
  ),
};

/**
 * Mirrors reference story "FillAndJustified" — `fill="proportional"` /
 * `fill="justified"` (Decision D3) applied to two independent `Tabs`
 * instances, each constrained to the reference's `.tabs-ref-width-demo`
 * width (28rem, already defined in `presentation.scss`) via an extra
 * className on `TabList` so the two distribution mechanisms visibly diverge
 * (P-020: short "Tab" + long "Much longer nav link" labels in the same
 * fixed-width row).
 */
export const FillAndJustified: Story = {
  render: () => (
    <div className="ref-stack">
      <div className="ref-specimen">
        <span className="ref-specimen-label">Fill (proportional width)</span>
        <Tabs fill="proportional" defaultSelectedKey="a">
          <TabList aria-label="Fill tabs" className="tabs-ref-width-demo">
            <Tab id="a">Tab</Tab>
            <Tab id="b">Much longer nav link</Tab>
            <Tab id="c">Tab</Tab>
          </TabList>
        </Tabs>
      </div>
      <div className="ref-specimen">
        <span className="ref-specimen-label">Justified (equal width)</span>
        <Tabs fill="justified" defaultSelectedKey="a">
          <TabList aria-label="Justified tabs" className="tabs-ref-width-demo">
            <Tab id="a">Tab</Tab>
            <Tab id="b">Much longer nav link</Tab>
            <Tab id="c">Tab</Tab>
          </TabList>
        </Tabs>
      </div>
    </div>
  ),
};
