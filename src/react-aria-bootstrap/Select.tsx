'use client';
import {
  Button,
  FieldError,
  Label,
  ListBox,
  ListBoxItem,
  type ListBoxItemProps,
  ListBoxSection,
  type ListBoxSectionProps,
  Popover,
  Select as AriaSelect,
  type SelectProps as AriaSelectProps,
  SelectValue,
  Text,
  type ValidationResult,
} from 'react-aria-components';

// Bootstrap's Dropdown pattern is the structural counterpart (React Aria
// renders a real <button>, not a native <select>) — see
// agent/taxonomies/select-taxonomy.md Decisions D2. Form Select's computed
// token values are applied as CSS custom-property overrides on top of
// .btn's own variable namespace in src/scss/_bootstrap-bridges.scss and
// stories/react-aria-bootstrap/presentation.scss (`.select-trigger`), not
// via the .form-select class itself (which targets a native <select> and
// would never attach — P-010/P-012).

export type SelectSize = 'sm' | 'md' | 'lg';

// D1 — Bootstrap's .form-select-sm/.form-select-lg (and the structural
// counterpart's .btn-sm/.btn-lg) have no React Aria equivalent; exposed here
// as a dedicated prop per the taxonomy's resolution.
const sizeTriggerClassMap: Record<SelectSize, string> = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
};

export interface SelectProps<T extends object>
  extends Omit<AriaSelectProps<T>, 'children'> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  items?: Iterable<T>;
  children: React.ReactNode | ((item: T) => React.ReactNode);
  /** Size variant — maps to Bootstrap's `.btn-sm`/`.btn-lg` (see Decisions D1). */
  size?: SelectSize;
  /**
   * Marks the trigger as passing validation, mirroring Bootstrap's
   * `.form-select.is-valid` treatment (green check icon + `.valid-feedback`).
   * React Aria's Select exposes `isInvalid` but has no built-in "valid"
   * signal — this is a presentational prop the consuming application sets
   * from its own validation logic (select-taxonomy.md, State mappings:
   * "No [data-valid] attribute exists").
   */
  isValid?: boolean;
  /** Text shown when `isValid` is true, mirroring Bootstrap's `.valid-feedback`. */
  validMessage?: string;
  /**
   * Extra class name(s) appended to the Popover (`.dropdown-menu`). Story/demo
   * escape hatch only — real usage should rely on the default `--trigger-width`
   * sizing (see `_bootstrap-bridges.scss`, P-049).
   */
  menuClassName?: string;
}

export function Select<T extends object>(
  {
    label,
    description,
    errorMessage,
    children,
    items,
    size = 'md',
    isValid = false,
    validMessage,
    menuClassName,
    ...props
  }: SelectProps<T>
) {
  const sizeClass = sizeTriggerClassMap[size];

  return (
    <AriaSelect {...props}>
      {label && <Label className="react-aria-Label form-label">{label}</Label>}
      <Button
        className={({ defaultClassName }) =>
          [defaultClassName, 'btn', 'dropdown-toggle', 'select-trigger', sizeClass, isValid && 'is-valid']
            .filter(Boolean)
            .join(' ')
        }
      >
        <SelectValue className="react-aria-SelectValue select-trigger-value">
          {/* selectedText (derived from each item's textValue) rather than
              defaultChildren (the item's raw rendered content) — lets an
              item's visible content carry annotations/decoration that
              shouldn't also appear in the trigger. Falls back to
              defaultChildren for the placeholder, which has no textValue. */}
          {({ selectedText, isPlaceholder, defaultChildren }) =>
            isPlaceholder ? defaultChildren : selectedText}
        </SelectValue>
        {isValid && (
          <span className="select-trigger-icon select-trigger-icon--valid" aria-hidden="true" />
        )}
        {props.isInvalid && (
          <span className="select-trigger-icon select-trigger-icon--invalid" aria-hidden="true" />
        )}
        <i className="bi bi-chevron-down select-trigger-caret" aria-hidden="true" />
      </Button>
      {description && (
        <Text slot="description" className="react-aria-Text form-text">
          {description}
        </Text>
      )}
      <FieldError className="react-aria-FieldError invalid-feedback">{errorMessage}</FieldError>
      {isValid && validMessage && (
        <div className="valid-feedback select-valid-feedback">{validMessage}</div>
      )}
      <Popover
        className={['react-aria-Popover', 'dropdown-menu', 'show', menuClassName].filter(Boolean).join(' ')}
        // 0, not RAC's default (~8px): the visible gap is applied via CSS
        // margin-top in the bridge instead (see _bootstrap-bridges.scss) —
        // floating-ui rounds its computed `top` to a whole pixel for crisp
        // rendering, which cannot land on the reference's half-pixel-exact
        // position; a CSS margin on top of a zero JS offset reproduces it
        // exactly, matching how the reference itself gets its gap
        // (Bootstrap's --bs-dropdown-spacer via margin-top, not a JS offset).
        offset={0}
      >
        <ListBox className="react-aria-ListBox dropdown-listbox" items={items}>
          {children}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}

export function SelectItem(props: ListBoxItemProps) {
  const { className, ...rest } = props;
  const extra = typeof className === 'string' ? className : '';

  return (
    <ListBoxItem
      {...rest}
      className={({ defaultClassName }) => [defaultClassName, 'dropdown-item', extra].filter(Boolean).join(' ')}
    />
  );
}

/** Optional grouped-options wrapper (ListBoxSection) — see Reference story "Grouped". */
export function SelectSection<T extends object>(props: ListBoxSectionProps<T>) {
  return <ListBoxSection {...props} />;
}
