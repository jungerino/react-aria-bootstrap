import type { Meta, StoryObj } from '@storybook/react';
import { withBootstrap } from '../_decorators';
import { Select, SelectListBox, SelectItem } from '../../../src/react-aria-bootstrap/Select';
import '../presentation.scss';

const meta: Meta = {
  title: 'Bootstrap Mirror/Select',
  decorators: [withBootstrap],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Mirrors reference story "Default" — real Select instances, one per
 * specimen, each with its own independent option set so the trigger's width
 * is driven by that specimen's own content (Reference story canvas item 1).
 */
export const Default: Story = {
  render: () => (
    <div className="ref-row">
      <div className="ref-specimen">
        <span className="ref-specimen-label">Short value</span>
        <Select aria-label="Favorite fruit" defaultValue="banana">
          <SelectItem id="apple">Apple</SelectItem>
          <SelectItem id="banana">Banana</SelectItem>
          <SelectItem id="cherry">Cherry</SelectItem>
          <SelectItem id="date">Date</SelectItem>
        </Select>
      </div>
      <div className="ref-specimen">
        <span className="ref-specimen-label">Long value (widest realistic content)</span>
        <Select aria-label="Favorite fruit" defaultValue="pomegranate">
          <SelectItem id="apple">Apple</SelectItem>
          <SelectItem id="pomegranate">Pomegranate seeds, family size</SelectItem>
        </Select>
      </div>
      <div className="ref-specimen">
        <span className="ref-specimen-label">Placeholder (no selection)</span>
        <Select aria-label="Favorite fruit" placeholder="Select a fruit">
          <SelectItem id="apple">Apple</SelectItem>
          <SelectItem id="banana">Banana</SelectItem>
        </Select>
      </div>
    </div>
  ),
};

/**
 * Mirrors reference story "Sizes" — isolates the size delta
 * (`.form-select-sm` / default / `.form-select-lg`) against the same
 * selected value (taxonomy Decision D3).
 */
export const Sizes: Story = {
  render: () => (
    <div className="ref-row">
      <div className="ref-specimen">
        <span className="ref-specimen-label">Small</span>
        <Select aria-label="Favorite fruit" size="sm" defaultValue="banana">
          <SelectItem id="apple">Apple</SelectItem>
          <SelectItem id="banana">Banana</SelectItem>
        </Select>
      </div>
      <div className="ref-specimen">
        <span className="ref-specimen-label">Default</span>
        <Select aria-label="Favorite fruit" defaultValue="banana">
          <SelectItem id="apple">Apple</SelectItem>
          <SelectItem id="banana">Banana</SelectItem>
        </Select>
      </div>
      <div className="ref-specimen">
        <span className="ref-specimen-label">Large</span>
        <Select aria-label="Favorite fruit" size="lg" defaultValue="banana">
          <SelectItem id="apple">Apple</SelectItem>
          <SelectItem id="banana">Banana</SelectItem>
        </Select>
      </div>
    </div>
  ),
};

/**
 * Mirrors reference story "States" — resting, focused (real `autoFocus`,
 * since `.form-select:focus` is a plain `:focus` rule with no modality
 * distinction to fake — taxonomy Button state mapping), disabled (real
 * `isDisabled`), invalid (real `isInvalid` + `errorMessage`). No hover
 * specimen — `.form-select` defines no hover treatment.
 */
export const States: Story = {
  render: () => (
    <div className="ref-row">
      <div className="ref-specimen">
        <span className="ref-specimen-label">Resting</span>
        <Select aria-label="Favorite fruit" defaultValue="banana">
          <SelectItem id="apple">Apple</SelectItem>
          <SelectItem id="banana">Banana</SelectItem>
        </Select>
      </div>
      <div className="ref-specimen">
        <span className="ref-specimen-label">Focused</span>
        <Select aria-label="Favorite fruit" defaultValue="banana" autoFocus>
          <SelectItem id="apple">Apple</SelectItem>
          <SelectItem id="banana">Banana</SelectItem>
        </Select>
      </div>
      <div className="ref-specimen">
        <span className="ref-specimen-label">Disabled</span>
        <Select aria-label="Favorite fruit" defaultValue="banana" isDisabled>
          <SelectItem id="apple">Apple</SelectItem>
          <SelectItem id="banana">Banana</SelectItem>
        </Select>
      </div>
      <div className="ref-specimen">
        <span className="ref-specimen-label">Invalid</span>
        <Select
          aria-label="Favorite fruit"
          placeholder="Select a fruit"
          isInvalid
          errorMessage="Please choose a fruit."
        >
          <SelectItem id="apple">Apple</SelectItem>
        </Select>
      </div>
    </div>
  ),
};

/**
 * Mirrors reference story "OpenSingleSelect". The real composite's trigger
 * and popover are one linked unit (unlike the reference's native `<select>`,
 * which is OS-rendered and can't be forced open) — so, matching the
 * reference's own two-region layout (P-019), this specimen pairs a real
 * trigger against an independent, real `SelectListBox`/`SelectItem` group
 * standing in for the open menu (not nested in an actual Popover), using
 * real selection/disabled state plus `.faux-hover`/`.faux-focus` (P044) for
 * the states that can't be produced without live interaction — the same
 * simplification the reference story itself uses for the same reason
 * (unstylable native open list). The trigger itself is not genuinely
 * `defaultOpen` (that would mount a second, real Popover duplicating the
 * independent menu specimen beside it) — the label's "caret open" and the
 * reference's own `.select-caret.faux-open` treatment for this exact
 * specimen are reproduced via the `faux-open` class (P044), which rotates
 * the trigger's real chevron without opening the popover.
 */
export const OpenSingleSelect: Story = {
  render: () => (
    <div className="ref-row">
      <div className="ref-specimen">
        <span className="ref-specimen-label">Trigger (at rest, showing selection, caret open)</span>
        <Select aria-label="Favorite fruit" defaultValue="banana" className="faux-open">
          <SelectItem id="apple">Apple</SelectItem>
          <SelectItem id="banana">Banana</SelectItem>
          <SelectItem id="cherry">Cherry</SelectItem>
          <SelectItem id="date">Date</SelectItem>
        </Select>
      </div>
      <div className="ref-specimen">
        <span className="ref-specimen-label">Open menu (item state matrix)</span>
        <SelectListBox
          aria-label="Favorite fruit"
          className="dropdown-menu select-reference-menu"
          selectionMode="single"
          defaultSelectedKeys={['banana']}
          disabledKeys={['elderberry']}
        >
          <SelectItem id="apple">Apple</SelectItem>
          <SelectItem id="banana">Banana (selected)</SelectItem>
          <SelectItem id="cherry" className="faux-hover">Cherry (hover)</SelectItem>
          <SelectItem id="date" className="faux-focus">Date (focused)</SelectItem>
          <SelectItem id="elderberry">Elderberry (disabled)</SelectItem>
        </SelectListBox>
      </div>
    </div>
  ),
};

/**
 * Mirrors reference story "OpenMultiSelect". Same two-region simplification
 * and `faux-open` caret treatment as OpenSingleSelect, applied to both
 * trigger specimens (the reference uses `.select-caret.faux-open` on both
 * too). Selected items use the real checkbox mechanism (Decision D5) via
 * `defaultSelectedKeys`/`selectionMode="multiple"` — no background/color
 * change on the item itself.
 */
export const OpenMultiSelect: Story = {
  render: () => (
    <div className="ref-row">
      <div className="ref-specimen">
        <span className="ref-specimen-label">Trigger — two selected, caret open</span>
        <Select
          aria-label="Favorite fruits"
          selectionMode="multiple"
          defaultValue={['apple', 'banana']}
          className="faux-open"
        >
          <SelectItem id="apple">Apple</SelectItem>
          <SelectItem id="banana">Banana</SelectItem>
        </Select>
      </div>
      <div className="ref-specimen">
        <span className="ref-specimen-label">Trigger — widest realistic combination</span>
        <Select
          aria-label="Favorite fruits"
          selectionMode="multiple"
          defaultValue={['apple', 'banana', 'cherry', 'date']}
          className="faux-open"
        >
          <SelectItem id="apple">Apple</SelectItem>
          <SelectItem id="banana">Banana</SelectItem>
          <SelectItem id="cherry">Cherry</SelectItem>
          <SelectItem id="date">Date</SelectItem>
        </Select>
      </div>
      <div className="ref-specimen">
        <span className="ref-specimen-label">Open menu (checkbox indicator, item state matrix)</span>
        <SelectListBox
          aria-label="Favorite fruits"
          className="dropdown-menu select-reference-menu"
          selectionMode="multiple"
          defaultSelectedKeys={['apple', 'banana', 'date']}
          disabledKeys={['elderberry']}
        >
          <SelectItem id="apple">Apple</SelectItem>
          <SelectItem id="banana">Banana</SelectItem>
          <SelectItem id="cherry" className="faux-hover">Cherry (hover, unchecked)</SelectItem>
          <SelectItem id="date" className="faux-focus">Date (focused, checked)</SelectItem>
          <SelectItem id="elderberry">Elderberry (disabled)</SelectItem>
        </SelectListBox>
      </div>
    </div>
  ),
};

/**
 * Mirrors reference story "WithLabelAndDescription".
 */
export const WithLabelAndDescription: Story = {
  render: () => (
    <div className="ref-row">
      <div className="ref-specimen">
        <span className="ref-specimen-label">Label + description</span>
        <Select
          label="Favorite fruit"
          description="Choose the fruit you'd eat every day."
          defaultValue="banana"
        >
          <SelectItem id="apple">Apple</SelectItem>
          <SelectItem id="banana">Banana</SelectItem>
        </Select>
      </div>
      <div className="ref-specimen">
        <span className="ref-specimen-label">Label + invalid + feedback</span>
        <Select
          label="Favorite fruit"
          placeholder="Select a fruit"
          isInvalid
          errorMessage="Please choose a fruit."
        >
          <SelectItem id="apple">Apple</SelectItem>
        </Select>
      </div>
    </div>
  ),
};
