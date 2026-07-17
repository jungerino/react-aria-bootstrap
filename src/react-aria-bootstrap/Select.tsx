'use client';
import {
  Select as RACSelect,
  type SelectProps as RACSelectProps,
  SelectValue,
  Button,
  Popover,
  ListBox,
  ListBoxItem,
  type ListBoxItemProps,
  ListBoxSection,
  type ListBoxSectionProps,
  Header,
  Label,
  Text,
  FieldError,
  type ValidationResult,
} from 'react-aria-components';
import { ChevronDown } from 'lucide-react';

export interface SelectProps<T extends object, M extends 'single' | 'multiple' = 'single'>
  extends Omit<RACSelectProps<T, M>, 'children'> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  items?: Iterable<T>;
  children: React.ReactNode | ((item: T) => React.ReactNode);
}

// Trigger button — styled with the real Bootstrap `.form-select` class, chosen
// over Dropdown Toggle per the taxonomy's D-form-select-class decision.
// Popover/ListBox carry `.dropdown-menu`/`.dropdown-listbox` — Bootstrap's
// `.dropdown-menu` token set split across the two elements per DOM conflict #3
// (box tokens on the outer Popover, flow tokens on the inner ListBox — see
// `.select-popover` / `.select-popover .dropdown-listbox` in presentation.scss).
// `.show` is hardcoded on the Popover per P-025 — React Aria's own mount/unmount
// already provides the visibility control; Popover unmounts entirely when closed.
export function Select<T extends object, M extends 'single' | 'multiple' = 'single'>({
  label,
  description,
  errorMessage,
  children,
  items,
  ...props
}: SelectProps<T, M>) {
  return (
    <RACSelect {...props} className="react-aria-Select dropdown">
      {label && (
        <Label className="react-aria-Label form-label">{label}</Label>
      )}
      <Button className="react-aria-Button form-select select-trigger">
        <SelectValue className="react-aria-SelectValue select-value" />
        <ChevronDown size={16} className="select-chevron" aria-hidden="true" />
      </Button>
      {description && (
        <Text slot="description" className="react-aria-Text field-description form-text">
          {description}
        </Text>
      )}
      <FieldError className="react-aria-FieldError invalid-feedback">{errorMessage}</FieldError>
      {/* No `hideArrow` prop in the installed react-aria-components version — an
          arrow is only ever rendered via an explicit `<OverlayArrow>` child, which
          this composition never adds, so no arrow appears regardless. */}
      <Popover className="react-aria-Popover select-popover dropdown-menu show">
        <ListBox items={items} className="react-aria-ListBox dropdown-listbox">
          {children}
        </ListBox>
      </Popover>
    </RACSelect>
  );
}

// D-selected-indicator: no checkmark icon on selection — native `.dropdown-item.active`
// background/color only. D-multi-select-scope: when `selectionMode="multiple"`,
// pairs a `.form-check` checkbox with the item's content (Bootstrap has no built-in
// multi-select dropdown-menu pattern; this is the closest structural recipe built
// from primitives already in the KB). `select-multi-item` lands on the *outer* item
// (flex, centers the `.form-check` block) — `.form-check` itself must stay a
// separate, unflexed child so its native float-based input/label layout still works
// (flexing the same element that carries `.form-check` would turn the floated input
// into a flex item, breaking the `margin-left` offset the float layout depends on).
export function SelectItem(props: ListBoxItemProps) {
  const { children, className, textValue, ...rest } = props;
  // `children` below is always passed to `ListBoxItem` as a function (needed to
  // read `selectionMode`/`isSelected` for the multi-select checkbox wrapper), so
  // React Aria's collection builder can never auto-derive `item.textValue` from
  // it the way it does for plain-string children — `item.textValue` silently
  // resolves to `''` instead. SelectValue's own multi-select rendering
  // (`Intl.ListFormat.formatToParts` over each item's `textValue`) collapses to
  // just the bare separator word ("and") with no element parts at all when every
  // list entry is an empty string — verified directly against `Intl.ListFormat`.
  // Passing `textValue` explicitly (derived from plain-string children when the
  // caller didn't supply one) fixes both the trigger's summary text and the
  // built-in typeahead/accessibility warning `ListBoxItem` logs without it.
  const resolvedTextValue = textValue ?? (typeof children === 'string' ? children : undefined);
  return (
    <ListBoxItem
      {...rest}
      textValue={resolvedTextValue}
      className={(renderProps) => {
        const extra = typeof className === 'function' ? className(renderProps) : className;
        const multi = renderProps.selectionMode === 'multiple' ? ' select-multi-item' : '';
        return `react-aria-ListBoxItem dropdown-item${multi}${extra ? ` ${extra}` : ''}`;
      }}
    >
      {(renderProps) => {
        const content = typeof children === 'function' ? children(renderProps) : children;
        if (renderProps.selectionMode === 'multiple') {
          return (
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={renderProps.isSelected}
                readOnly
                tabIndex={-1}
                aria-hidden="true"
              />
              <span className="form-check-label">{content}</span>
            </div>
          );
        }
        return content;
      }}
    </ListBoxItem>
  );
}

export function SelectSection<T extends object>(props: ListBoxSectionProps<T>) {
  return <ListBoxSection {...props} />;
}

// Section header — mapped to Dropdown Header (`.dropdown-header`). RAC's `Header`
// renders a `<header>` element, not `<h6>` (verified in `private/Header.mjs`), so
// the corresponding font-weight/line-height bridge lives in
// `_bootstrap-bridges.scss` keyed off the bare `.dropdown-header` class (P-050).
export function SelectSectionHeader(props: React.ComponentProps<typeof Header>) {
  const { className, ...rest } = props;
  return (
    <Header
      {...rest}
      className={`react-aria-Header dropdown-header${className ? ` ${className}` : ''}`}
    />
  );
}
