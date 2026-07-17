import type { Meta, StoryObj } from '@storybook/react';
import { withBootstrap } from '../_decorators';
import { Select, SelectItem, SelectSection, SelectSectionHeader } from '../../../src/react-aria-bootstrap/Select';
import '../presentation.scss';

const meta: Meta = {
  title: 'Bootstrap Mirror/Select',
  decorators: [withBootstrap],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof meta>;

// Popovers render in a portal at `document.body`, absolutely positioned relative
// to the trigger — the story container's own layout doesn't reserve space for
// them automatically the way the static reference story's `position: static`
// popover does. `minHeight` on the wrapper reserves room so the open popover
// isn't clipped by the iframe boundary (P-048 exception 1).
const OPEN_MIN_HEIGHT = 260;
const OPEN_GROUPED_MIN_HEIGHT = 340;
const OPEN_MULTI_MIN_HEIGHT = 220;

/**
 * Source: https://getbootstrap.com/docs/5.3/forms/select/ (trigger appearance)
 *
 * Select's trigger renders as a real `<button>` (not a native `<select>`), so it
 * is styled with `.form-select` — chosen over Dropdown Toggle
 * (`.btn.dropdown-toggle`) per the taxonomy's D-form-select-class decision.
 */
export const Default: Story = {
  render: () => (
    <div className="select-demo">
      <Select label="Favorite fruit">
        <SelectItem id="aardvark">Aardvark</SelectItem>
        <SelectItem id="banana">Banana</SelectItem>
        <SelectItem id="cat">Cat</SelectItem>
        <SelectItem id="dog">Dog</SelectItem>
        <SelectItem id="kangaroo">Kangaroo</SelectItem>
      </Select>
    </div>
  ),
};

/**
 * Interactive-state matrix for the closed trigger. Every specimen keeps the same
 * selected value ("Banana") so state-driven visual differences are the only
 * variable. Disabled/Invalid/Required are real declarative props; Focus-visible
 * and Pressed can't be triggered declaratively, so those two wrap the trigger in
 * a `.faux-[state]-scope` div (P-044) — the Select component itself doesn't
 * expose a className passthrough for its internal Button.
 */
export const States: Story = {
  render: () => (
    <div className="reference-row">
      <div className="reference-specimen">
        <span className="reference-specimen-label">Resting</span>
        <div className="select-demo">
          <Select defaultSelectedKey="banana">
            <SelectItem id="aardvark">Aardvark</SelectItem>
            <SelectItem id="banana">Banana</SelectItem>
            <SelectItem id="cat">Cat</SelectItem>
          </Select>
        </div>
      </div>

      <div className="reference-specimen">
        <span className="reference-specimen-label">
          Hover (no visual change — `.form-select` defines no `:hover` rule)
        </span>
        <div className="select-demo">
          <Select defaultSelectedKey="banana">
            <SelectItem id="aardvark">Aardvark</SelectItem>
            <SelectItem id="banana">Banana</SelectItem>
            <SelectItem id="cat">Cat</SelectItem>
          </Select>
        </div>
      </div>

      <div className="reference-specimen">
        <span className="reference-specimen-label">Focus-visible</span>
        <div className="select-demo faux-focus-visible-scope">
          <Select defaultSelectedKey="banana">
            <SelectItem id="aardvark">Aardvark</SelectItem>
            <SelectItem id="banana">Banana</SelectItem>
            <SelectItem id="cat">Cat</SelectItem>
          </Select>
        </div>
      </div>

      <div className="reference-specimen">
        <span className="reference-specimen-label">Pressed (subtle tint — D-pressed-state)</span>
        <div className="select-demo faux-pressed-scope">
          <Select defaultSelectedKey="banana">
            <SelectItem id="aardvark">Aardvark</SelectItem>
            <SelectItem id="banana">Banana</SelectItem>
            <SelectItem id="cat">Cat</SelectItem>
          </Select>
        </div>
      </div>

      <div className="reference-specimen">
        <span className="reference-specimen-label">Disabled</span>
        <div className="select-demo">
          <Select defaultSelectedKey="banana" isDisabled>
            <SelectItem id="aardvark">Aardvark</SelectItem>
            <SelectItem id="banana">Banana</SelectItem>
            <SelectItem id="cat">Cat</SelectItem>
          </Select>
        </div>
      </div>

      <div className="reference-specimen">
        <span className="reference-specimen-label">Invalid</span>
        <div className="select-demo">
          <Select defaultSelectedKey="banana" isInvalid errorMessage="Please select a valid fruit.">
            <SelectItem id="aardvark">Aardvark</SelectItem>
            <SelectItem id="banana">Banana</SelectItem>
            <SelectItem id="cat">Cat</SelectItem>
          </Select>
        </div>
      </div>

      <div className="reference-specimen">
        <span className="reference-specimen-label">Required (informational only — no distinct visual)</span>
        <div className="select-demo">
          <Select defaultSelectedKey="banana" isRequired>
            <SelectItem id="aardvark">Aardvark</SelectItem>
            <SelectItem id="banana">Banana</SelectItem>
            <SelectItem id="cat">Cat</SelectItem>
          </Select>
        </div>
      </div>
    </div>
  ),
};

/**
 * Open, realistic appearance (P-005): the trigger shows the currently selected
 * value and the chevron is rotated to its open position (P-018). The matching
 * item is marked `.active` with no icon (D-selected-indicator) — driven here by
 * real selection state (`defaultSelectedKey`), not a faux class.
 */
export const Open: Story = {
  render: () => (
    <div className="select-demo" style={{ minHeight: OPEN_MIN_HEIGHT }}>
      <Select label="Favorite fruit" defaultSelectedKey="banana" defaultOpen>
        <SelectItem id="aardvark">Aardvark</SelectItem>
        <SelectItem id="banana">Banana</SelectItem>
        <SelectItem id="cat">Cat</SelectItem>
        <SelectItem id="dog">Dog</SelectItem>
        <SelectItem id="kangaroo">Kangaroo</SelectItem>
      </Select>
    </div>
  ),
};

/**
 * Full interactive-state matrix for listbox items (P-009), open by default. Item
 * text doubles as the state label (P-008). Resting/Hovered/Focused are visual-only
 * (hover/focus can't be held declaratively for a static specimen — Hovered/Focused
 * use faux classes merged onto the item via `SelectItem`'s `className` prop);
 * Selected and Disabled are real declarative state (`defaultSelectedKey` /
 * `isDisabled`).
 */
export const OpenItemStates: Story = {
  render: () => (
    <div className="select-demo" style={{ minHeight: OPEN_MIN_HEIGHT }}>
      <Select label="Item states" defaultSelectedKey="selected" defaultOpen>
        <SelectItem id="resting">Resting</SelectItem>
        <SelectItem id="hovered" className="faux-hover">
          Hovered
        </SelectItem>
        <SelectItem id="focused" className="faux-focus-visible">
          Focused
        </SelectItem>
        <SelectItem id="selected">Selected</SelectItem>
        <SelectItem id="disabled" isDisabled>
          Disabled
        </SelectItem>
      </Select>
    </div>
  ),
};

/**
 * Sectioned listbox using `.dropdown-header` (`SelectSectionHeader`), mirroring
 * the Fruit/Vegetable grouping example from the React Aria Select docs' Content
 * section.
 */
export const OpenGrouped: Story = {
  render: () => (
    <div className="select-demo" style={{ minHeight: OPEN_GROUPED_MIN_HEIGHT }}>
      <Select label="Preferred fruit or vegetable" defaultSelectedKey="banana" defaultOpen>
        <SelectSection id="fruit">
          <SelectSectionHeader>Fruit</SelectSectionHeader>
          <SelectItem id="apple">Apple</SelectItem>
          <SelectItem id="banana">Banana</SelectItem>
          <SelectItem id="orange">Orange</SelectItem>
        </SelectSection>
        <SelectSection id="vegetable">
          <SelectSectionHeader>Vegetable</SelectSectionHeader>
          <SelectItem id="cabbage">Cabbage</SelectItem>
          <SelectItem id="broccoli">Broccoli</SelectItem>
          <SelectItem id="carrots">Carrots</SelectItem>
        </SelectSection>
      </Select>
    </div>
  ),
};

/**
 * `selectionMode="multiple"` (D-multi-select-scope): Bootstrap has no built-in
 * multi-select dropdown-menu pattern, so each item pairs a `.form-check` checkbox
 * with its label inside the `.dropdown-item` (handled internally by `SelectItem`).
 * The trigger shows a comma-joined summary of the selected values via RAC's own
 * default `SelectValue` rendering.
 */
export const MultiSelect: Story = {
  render: () => (
    <div className="select-demo" style={{ minHeight: OPEN_MULTI_MIN_HEIGHT }}>
      {/* Select has no `defaultSelectedKeys` prop — multi-selection uses the same
          `value`/`defaultValue` prop as single-select, typed as `Key[]` when
          `selectionMode="multiple"` (verified in `useSelectState.d.ts`); the
          deprecated `selectedKey`/`defaultSelectedKey` pair is single-only. */}
      <Select<object, 'multiple'>
        label="States"
        selectionMode="multiple"
        defaultValue={['AL', 'AK']}
        defaultOpen
      >
        <SelectItem id="AL">Alabama</SelectItem>
        <SelectItem id="AK">Alaska</SelectItem>
        <SelectItem id="AZ">Arizona</SelectItem>
      </Select>
    </div>
  ),
};
