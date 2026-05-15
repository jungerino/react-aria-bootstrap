import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { withBootstrapTest } from '../_decorators';
import './augments.scss';

const meta: Meta = {
  title: 'Bootstrap Reference/Button',
  decorators: [withBootstrapTest],
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

function Label({ children }: { children: ReactNode }) {
  return (
    <p style={{ margin: '0 0 0.25rem', fontSize: '0.75rem', color: 'var(--bs-secondary-color, #6c757d)' }}>
      {children}
    </p>
  );
}

function Specimen({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ outline: '1px solid magenta', padding: 4 }}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

const SOLID_VARIANTS = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'] as const;
const OUTLINE_VARIANTS = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'] as const;

export const Root: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          '**Source:** [Bootstrap Docs — Buttons › Variants](https://getbootstrap.com/docs/5.3/components/buttons/#variants) · [Sizes](https://getbootstrap.com/docs/5.3/components/buttons/#sizes) · [Disabled state](https://getbootstrap.com/docs/5.3/components/buttons/#disabled-state)',
      },
    },
  },
  render: () => (
    <div style={{ padding: '1rem' }}>

      {/* ── Group A — Variant families ── */}
      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--bs-secondary-color, #6c757d)', marginBottom: '0.5rem' }}>
        Group A — Variant families
      </p>

      <Label>Solid</Label>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, auto)',
          gap: '0.5rem',
          alignItems: 'start',
          marginBottom: '0.75rem',
        }}
      >
        {SOLID_VARIANTS.map((v) => (
          <Specimen key={v} label={v}>
            <button type="button" className={`btn btn-${v}`}>Button</button>
          </Specimen>
        ))}
      </div>

      <Label>Outline</Label>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, auto)',
          gap: '0.5rem',
          alignItems: 'start',
          marginBottom: '0.75rem',
        }}
      >
        {OUTLINE_VARIANTS.map((v) =>
          v === 'light' ? (
            <Specimen key={v} label={`outline-${v}`}>
              <div
                data-bs-theme="dark"
                style={{ background: 'var(--bs-dark, #212529)', padding: '0.375rem 0.5rem', borderRadius: '0.25rem' }}
              >
                <button type="button" className="btn btn-outline-light">Button</button>
              </div>
            </Specimen>
          ) : (
            <Specimen key={v} label={`outline-${v}`}>
              <button type="button" className={`btn btn-outline-${v}`}>Button</button>
            </Specimen>
          )
        )}
      </div>

      <Label>Link</Label>
      <div style={{ marginBottom: '2rem' }}>
        <Specimen label="link">
          <button type="button" className="btn btn-link">Button</button>
        </Specimen>
      </div>

      {/* ── Group B — Sizes ── */}
      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--bs-secondary-color, #6c757d)', marginBottom: '0.5rem' }}>
        Group B — Sizes
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, auto)',
          gap: '0.75rem',
          alignItems: 'end',
          marginBottom: '2rem',
        }}
      >
        <Specimen label="Small">
          <button type="button" className="btn btn-primary btn-sm">Button</button>
        </Specimen>
        <Specimen label="Default">
          <button type="button" className="btn btn-primary">Button</button>
        </Specimen>
        <Specimen label="Large">
          <button type="button" className="btn btn-primary btn-lg">Button</button>
        </Specimen>
      </div>

      {/* ── Group C — Interactive states ── */}
      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--bs-secondary-color, #6c757d)', marginBottom: '0.5rem' }}>
        Group C — Interactive states
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, auto)',
          gap: '0.75rem',
          alignItems: 'start',
        }}
      >
        <Specimen label="Default">
          <button type="button" className="btn btn-primary">Button</button>
        </Specimen>
        <Specimen label="Hover">
          <button type="button" className="btn btn-primary faux-hover">Button</button>
        </Specimen>
        <Specimen label="Focus visible">
          <button type="button" className="btn btn-primary faux-focus">Button</button>
        </Specimen>
        <Specimen label="Active / pressed">
          <button type="button" className="btn btn-primary active">Button</button>
        </Specimen>
        <Specimen label="Disabled">
          <button type="button" className="btn btn-primary" disabled>Button</button>
        </Specimen>
        <Specimen label="Disabled (link variant)">
          <button type="button" className="btn btn-link disabled" disabled>Button</button>
        </Specimen>
      </div>

    </div>
  ),
};
