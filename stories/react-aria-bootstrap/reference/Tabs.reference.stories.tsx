import type { Meta, StoryObj } from '@storybook/react';
import { withBootstrap } from '../_decorators';
import '../presentation.scss';

const meta: Meta = {
  title: 'Bootstrap Reference/Tabs',
  decorators: [withBootstrap],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Source: https://getbootstrap.com/docs/5.3/components/navs-tabs/
 *
 * Uses `.nav-underline` — the only Nav/Tabs style in scope (taxonomy
 * Decision D1). Flat structure with no `.nav-item`/`<li>` wrapper, matching
 * React Aria's actual DOM (Bootstrap explicitly supports the no-wrapper
 * fallback via its own `.nav-fill > .nav-link`-style selectors — see
 * taxonomy DOM conflicts). Disabled is applied via the `.disabled` class +
 * `aria-disabled`, never the native `disabled` attribute — Tab never
 * renders a real `<button>`, so `:disabled` can never fire (M018). The
 * panel omits the `.tab-pane`/`.fade`/`.show` classes entirely: React Aria
 * mounts only the active panel rather than toggling `display`, so those
 * classes have no relevant effect here (see taxonomy DOM conflicts).
 */
export const Default: Story = {
  render: () => (
    <div className="ref-stack">
      <div className="nav nav-underline" role="tablist" aria-label="Reference tabs">
        <button type="button" className="nav-link active" role="tab" aria-selected="true">Home</button>
        <button type="button" className="nav-link" role="tab" aria-selected="false">Profile</button>
        <button type="button" className="nav-link" role="tab" aria-selected="false">Settings</button>
        <button type="button" className="nav-link disabled" role="tab" aria-selected="false" aria-disabled="true">Disabled</button>
      </div>
      <div className="tab-content mt-3">
        <div role="tabpanel">Home panel content.</div>
      </div>
    </div>
  ),
};

/**
 * Source: https://getbootstrap.com/docs/5.3/components/navs-tabs/
 *
 * Full interactive state matrix for `.nav-underline .nav-link` (P-009/
 * P-013) — a single variant family, since `.nav-underline` is the only
 * style in scope. Hover and focus-visible use faux classes (P-001);
 * selected and disabled use real Bootstrap classes, since both are
 * representable via static HTML (P-007). Per P-008, each specimen's own
 * visible text is its label (collection-style layout, item content fills
 * the boundary). The combined Selected + Disabled specimen demonstrates
 * the cascade-resolution behavior documented in the taxonomy: `.active`'s
 * higher-specificity selector wins the shared `color` property over
 * `.disabled`, while `.disabled`'s `pointer-events`/`cursor` still apply.
 */
export const States: Story = {
  render: () => (
    <div className="nav nav-underline" role="tablist" aria-label="Tab states">
      <button type="button" className="nav-link" role="tab" aria-selected="false">Resting</button>
      <button type="button" className="nav-link faux-hover" role="tab" aria-selected="false">Hover</button>
      <button type="button" className="nav-link faux-focus-visible" role="tab" aria-selected="false">Focused</button>
      <button type="button" className="nav-link active" role="tab" aria-selected="true">Selected</button>
      <button type="button" className="nav-link disabled" role="tab" aria-selected="false" aria-disabled="true">Disabled</button>
      <button type="button" className="nav-link active disabled" role="tab" aria-selected="true" aria-disabled="true">Selected + Disabled</button>
    </div>
  ),
};

/**
 * Source: https://getbootstrap.com/docs/5.3/components/navs-tabs/ (vertical
 * pills example, adapted to `.nav-underline`)
 *
 * Bootstrap's docs only demonstrate `.flex-column` paired with `.nav-pills`
 * — the combination with `.nav-underline` is a valid but undocumented
 * composition (taxonomy Variants/Reference story canvas, M011/M017):
 * `.flex-column`'s only relevant declaration is `flex-direction: column`,
 * orthogonal to `.nav-underline`'s own rules.
 */
export const Vertical: Story = {
  render: () => (
    <div className="d-flex align-items-start">
      <div className="nav flex-column nav-underline me-3" role="tablist" aria-orientation="vertical" aria-label="Vertical tabs">
        <button type="button" className="nav-link active" role="tab" aria-selected="true">Home</button>
        <button type="button" className="nav-link" role="tab" aria-selected="false">Profile</button>
        <button type="button" className="nav-link disabled" role="tab" aria-selected="false" aria-disabled="true">Disabled</button>
      </div>
      <div className="tab-content">
        <div role="tabpanel">Home panel content.</div>
      </div>
    </div>
  ),
};

/**
 * Source: https://getbootstrap.com/docs/5.3/components/navs-tabs/
 *
 * `.nav-fill` (proportional width) vs `.nav-justified` (forced equal
 * width) — both exposed as a custom prop per taxonomy Decision D3. Each
 * list mixes a short label ("Tab") and a long one ("Much longer nav link")
 * per P-020, to make the differing width-distribution behavior visible:
 * fill sizes each tab to its own content first, then distributes remaining
 * space proportionally (so the long label ends up wider than the short
 * ones); justified forces every tab to the exact same width regardless of
 * content. `.tabs-ref-width-demo` (presentation.scss) constrains both rows
 * to the same fixed width — with unconstrained free space the two
 * mechanisms are visually indistinguishable, even though genuinely
 * different (reference-only helper, not a Bootstrap class).
 */
export const FillAndJustified: Story = {
  render: () => (
    <div className="ref-stack">
      <div className="ref-specimen">
        <span className="ref-specimen-label">Fill (proportional width)</span>
        <div className="nav nav-underline nav-fill tabs-ref-width-demo" role="tablist" aria-label="Fill tabs">
          <button type="button" className="nav-link active" role="tab" aria-selected="true">Tab</button>
          <button type="button" className="nav-link" role="tab" aria-selected="false">Much longer nav link</button>
          <button type="button" className="nav-link" role="tab" aria-selected="false">Tab</button>
        </div>
      </div>
      <div className="ref-specimen">
        <span className="ref-specimen-label">Justified (equal width)</span>
        <div className="nav nav-underline nav-justified tabs-ref-width-demo" role="tablist" aria-label="Justified tabs">
          <button type="button" className="nav-link active" role="tab" aria-selected="true">Tab</button>
          <button type="button" className="nav-link" role="tab" aria-selected="false">Much longer nav link</button>
          <button type="button" className="nav-link" role="tab" aria-selected="false">Tab</button>
        </div>
      </div>
    </div>
  ),
};
