import type { Meta, StoryObj } from '@storybook/react';
import { Header } from 'react-aria-components';
import { withBootstrap } from '../_decorators';
import { Select, SelectItem, SelectSection } from '../../../src/react-aria-bootstrap/Select';
import '../presentation.scss';

const meta: Meta = {
  title: 'Bootstrap Mirror/Select',
  decorators: [withBootstrap],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof meta>;

interface Animal {
  id: string;
  name: string;
}

const animals: Animal[] = [
  { id: 'koala', name: 'Koala' },
  { id: 'platypus', name: 'Platypus' },
  { id: 'bald-eagle', name: 'Bald Eagle' },
  { id: 'kangaroo', name: 'Kangaroo' },
  { id: 'skunk', name: 'Skunk' },
];

/**
 * Trigger — closed-state specimens.
 * Mirrors stories/react-aria-bootstrap/reference/Select.reference.stories.tsx `Trigger`.
 */
export const Trigger: Story = {
  render: () => (
    <div className="spec-row">
      <div className="spec-item">
        <span className="spec-label">Default (placeholder)</span>
        <Select aria-label="Favorite animal" items={animals}>
          {(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
        </Select>
      </div>

      <div className="spec-item">
        <span className="spec-label">Filled</span>
        <Select aria-label="Favorite animal" items={animals} defaultSelectedKey="kangaroo">
          {(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
        </Select>
      </div>

      <div className="spec-item">
        <span className="spec-label">Hover</span>
        <div className="faux-hover-scope">
          <Select aria-label="Favorite animal" items={animals} defaultSelectedKey="kangaroo">
            {(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
          </Select>
        </div>
      </div>

      <div className="spec-item">
        <span className="spec-label">Focus</span>
        <div className="faux-focus-scope">
          <Select aria-label="Favorite animal" items={animals} defaultSelectedKey="kangaroo">
            {(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
          </Select>
        </div>
      </div>

      <div className="spec-item">
        <span className="spec-label">Open / pressed</span>
        <div className="faux-open-scope">
          <Select aria-label="Favorite animal" items={animals} defaultSelectedKey="kangaroo">
            {(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
          </Select>
        </div>
      </div>

      <div className="spec-item">
        <span className="spec-label">Disabled</span>
        <Select aria-label="Favorite animal" items={animals} defaultSelectedKey="kangaroo" isDisabled>
          {(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
        </Select>
      </div>

      <div className="spec-item">
        <span className="spec-label">Invalid</span>
        <Select
          aria-label="Favorite animal"
          items={animals}
          isInvalid
          errorMessage="Please select an animal."
        >
          {(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
        </Select>
      </div>
    </div>
  ),
};

/**
 * Sizes — Decisions D1 (dedicated `size` prop: 'sm' | 'md' | 'lg').
 */
export const Sizes: Story = {
  render: () => (
    <div className="spec-row">
      <div className="spec-item">
        <span className="spec-label">Small (btn-sm)</span>
        <Select aria-label="Favorite animal" items={animals} defaultSelectedKey="kangaroo" size="sm">
          {(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
        </Select>
      </div>

      <div className="spec-item">
        <span className="spec-label">Default</span>
        <Select aria-label="Favorite animal" items={animals} defaultSelectedKey="kangaroo">
          {(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
        </Select>
      </div>

      <div className="spec-item">
        <span className="spec-label">Large (btn-lg)</span>
        <Select aria-label="Favorite animal" items={animals} defaultSelectedKey="kangaroo" size="lg">
          {(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
        </Select>
      </div>
    </div>
  ),
};

/**
 * Open — full assembly with the menu visible, showing per-item interactive
 * states. Hover/focus are simulated with faux classes (P-044) since they
 * cannot be triggered live in a static story render; selected and disabled
 * are genuine React Aria state (defaultSelectedKey / disabledKeys).
 */
export const Open: Story = {
  render: () => (
    // P-048 exception (1): reserve vertical space for the open Popover, which
    // would otherwise clip against the bottom of the Storybook iframe.
    <div className="spec-item" style={{ minHeight: 260 }}>
      <span className="spec-label">Open (selected value shown in trigger — P-005)</span>
      <Select
        aria-label="Favorite animal"
        items={animals}
        defaultSelectedKey="kangaroo"
        disabledKeys={['skunk']}
        defaultOpen
        menuClassName="select-menu-demo-stretch"
      >
        {(item) => (
          <SelectItem
            id={item.id}
            className={
              item.id === 'platypus'
                ? 'faux-hover'
                : item.id === 'bald-eagle'
                  ? 'faux-focus-visible'
                  : undefined
            }
          >
            {item.id === 'platypus'
              ? 'Platypus (hover)'
              : item.id === 'bald-eagle'
                ? 'Bald Eagle (focused)'
                : item.id === 'kangaroo'
                  ? 'Kangaroo (selected)'
                  : item.id === 'skunk'
                    ? 'Skunk (disabled)'
                    : item.name}
          </SelectItem>
        )}
      </Select>
    </div>
  ),
};

/**
 * Grouped — optional sections variant (ListBoxSection + Header).
 */
export const Grouped: Story = {
  render: () => (
    // P-048 exception (1): reserve vertical space for the open Popover, which
    // would otherwise clip against the bottom of the Storybook iframe.
    <div className="spec-item" style={{ minHeight: 260 }}>
      <span className="spec-label">Grouped options</span>
      <Select
        aria-label="Grouped options"
        defaultSelectedKey="kangaroo"
        defaultOpen
        menuClassName="select-menu-demo-stretch"
      >
        <SelectSection>
          <Header className="react-aria-Header dropdown-header">Marsupials</Header>
          <SelectItem id="koala">Koala</SelectItem>
          {/* textValue keeps the trigger showing plain "Kangaroo" (matching
              the reference's trigger, per Select.tsx's SelectValue override),
              while the visible item text carries the "(selected)" annotation
              (matching the reference's item text). */}
          <SelectItem id="kangaroo" textValue="Kangaroo">
            Kangaroo (selected)
          </SelectItem>
        </SelectSection>
        <SelectSection>
          <Header className="react-aria-Header dropdown-header">Birds</Header>
          <SelectItem id="bald-eagle">Bald Eagle</SelectItem>
        </SelectSection>
      </Select>
    </div>
  ),
};

/**
 * Field states — label, description, and validation composition.
 */
export const FieldStates: Story = {
  render: () => (
    <div className="spec-row">
      <div className="spec-item">
        <span className="spec-label">Default (label + description)</span>
        <Select
          label="Favorite animal"
          description="Choose the animal you'd like to adopt."
          items={animals}
          defaultSelectedKey="kangaroo"
        >
          {(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
        </Select>
      </div>

      <div className="spec-item">
        <span className="spec-label">Valid (label + valid-feedback + icon)</span>
        <Select
          label="Favorite animal"
          items={animals}
          defaultSelectedKey="kangaroo"
          isValid
          validMessage="Looks good!"
        >
          {(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
        </Select>
      </div>

      <div className="spec-item">
        <span className="spec-label">Invalid (label + invalid-feedback + icon)</span>
        <Select
          label="Favorite animal"
          items={animals}
          isInvalid
          errorMessage="Please select an animal."
        >
          {(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
        </Select>
      </div>

      <div className="spec-item">
        <span className="spec-label">Disabled field</span>
        <Select label="Favorite animal" items={animals} defaultSelectedKey="kangaroo" isDisabled>
          {(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
        </Select>
      </div>
    </div>
  ),
};
