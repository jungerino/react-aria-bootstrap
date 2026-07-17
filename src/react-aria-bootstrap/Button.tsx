'use client';
import {
  Button as RACButton,
  composeRenderProps,
  type ButtonProps as RACButtonProps,
} from 'react-aria-components';

// Bootstrap's full variant vocabulary (D-variant-scope) — 9 solid + 8 outline.
// The repo's prior non-Bootstrap `'quiet'` value is dropped entirely, not aliased.
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
  | 'link'
  | 'outline-primary'
  | 'outline-secondary'
  | 'outline-success'
  | 'outline-danger'
  | 'outline-warning'
  | 'outline-info'
  | 'outline-light'
  | 'outline-dark';

// `.btn-sm`/`.btn-lg` (D-size-scope) — omit for the unmodified default (medium) size.
export type ButtonSize = 'sm' | 'lg';

export interface ButtonProps extends RACButtonProps {
  /**
   * Bootstrap color/style variant.
   * @default 'primary'
   */
  variant?: ButtonVariant;
  /** Bootstrap size modifier. Omit for the default (medium) size. */
  size?: ButtonSize;
  /**
   * Renders a fixed-size circular icon-only button (D-icon-only-scope) —
   * `[NO DIRECT COUNTERPART]`, a custom recipe built on top of `.btn`
   * (see `.btn-icon-only` in presentation.scss).
   */
  iconOnly?: boolean;
}

const variantClassMap: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  success: 'btn-success',
  danger: 'btn-danger',
  warning: 'btn-warning',
  info: 'btn-info',
  light: 'btn-light',
  dark: 'btn-dark',
  link: 'btn-link',
  'outline-primary': 'btn-outline-primary',
  'outline-secondary': 'btn-outline-secondary',
  'outline-success': 'btn-outline-success',
  'outline-danger': 'btn-outline-danger',
  'outline-warning': 'btn-outline-warning',
  'outline-info': 'btn-outline-info',
  'outline-light': 'btn-outline-light',
  'outline-dark': 'btn-outline-dark',
};

const sizeClassMap: Record<ButtonSize, string> = {
  sm: 'btn-sm',
  lg: 'btn-lg',
};

// Root renders a genuine native `<button>` styled with the real `.btn` class, so
// `:hover`/`:focus-visible`/`:active`/`:disabled` already fire natively (see
// button-taxonomy.md) — no bridge CSS is required to make Bootstrap's own states
// work. `[data-*]` bridges in `_bootstrap-bridges.scss` exist only for
// cross-modality reliability (keyboard/touch press) and for `data-pending`, which
// has no native trigger at all.
export function Button({
  variant = 'primary',
  size,
  iconOnly,
  children,
  className,
  ...props
}: ButtonProps) {
  const extraClasses = [
    'btn',
    variantClassMap[variant],
    size ? sizeClassMap[size] : null,
    iconOnly ? 'btn-icon-only' : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <RACButton
      {...props}
      className={(renderProps) => {
        const { defaultClassName } = renderProps;
        const custom = typeof className === 'function' ? className(renderProps) : className;
        return [defaultClassName, extraClasses, custom].filter(Boolean).join(' ');
      }}
    >
      {composeRenderProps(children, (resolvedChildren, { isPending }) =>
        isPending ? (
          // Raw Bootstrap spinner markup (D-pending-indicator-composition) —
          // self-contained, does not compose `<ProgressCircle>`. Mirrors
          // Bootstrap's own documented pending-button pattern: a
          // `.spinner-border.spinner-border-sm` plus a `role="status"` text node,
          // both flat children of `.btn`.
          <>
            <span className="spinner-border spinner-border-sm" aria-hidden="true" />{' '}
            <span role="status">{resolvedChildren}</span>
          </>
        ) : (
          resolvedChildren
        ),
      )}
    </RACButton>
  );
}
