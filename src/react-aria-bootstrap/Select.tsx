'use client';
import {
  Select as AriaSelect,
  type SelectProps as AriaSelectProps,
  SelectValue,
  type ValidationResult,
  Button,
  Label,
  Text,
  FieldError,
  Popover,
  ListBox,
  ListBoxItem,
  type ListBoxProps,
  type ListBoxItemProps,
} from 'react-aria-components/Select';
import { composeRenderProps } from 'react-aria-components/composeRenderProps';
import { Children, isValidElement, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

// P041 value-display-stable-dims: recover the plain-text label for one
// rendered item's children, so the trigger's hidden sizer (below) can
// contain every option's text without depending on option shape.
function extractText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (isValidElement(node)) {
    const childProps = node.props as { children?: ReactNode };
    return extractText(childProps.children);
  }
  return '';
}

// Every option label this Select can render, regardless of whether
// `children` is a static node list or a per-item render function paired
// with `items` — covers both forms the `Select` prop surface accepts.
function getOptionLabels<T extends object>(
  items: Iterable<T> | undefined,
  children: ReactNode | ((item: T) => ReactNode)
): string[] {
  if (items && typeof children === 'function') {
    return Array.from(items).map((item) => extractText((children as (item: T) => ReactNode)(item)));
  }
  return Children.toArray(children as ReactNode).map(extractText);
}

// P007 variant-replace: `size` is a custom, Bootstrap-authoritative prop
// (taxonomy Decision D3 — React Aria's Select has no size concept of its
// own). Resolved names (`sm`/`lg`) are the prop type; this map is what
// actually resolves each to its full Bootstrap class.
const sizeClassMap: Record<'sm' | 'lg', string> = {
  sm: 'form-select-sm',
  lg: 'form-select-lg',
};

// Bootstrap-styled Select. Built directly on react-aria-components primitives
// (not the vanilla-starter's shared Button/ListBox/Popover/Form wrappers under
// `src/`) so no original per-component CSS (`src/{Component}.css`, which uses
// the vanilla theme's `--text-color`/`--spacing-*`/`--gray-*` tokens) has an
// import path into this component — Bootstrap is the sole source of styling
// (P005 bundle-isolation).

export interface SelectProps<T extends object, M extends 'single' | 'multiple'>
  extends Omit<AriaSelectProps<T, M>, 'children'> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  items?: Iterable<T>;
  /**
   * Trigger size modifier (`.form-select-sm` / `.form-select-lg`). No React
   * Aria equivalent — Bootstrap-authoritative custom prop (taxonomy Decision D3).
   */
  size?: 'sm' | 'lg';
  children: React.ReactNode | ((item: T) => React.ReactNode);
}

export function Select<T extends object, M extends 'single' | 'multiple' = 'single'>(
  { label, description, errorMessage, children, items, size, className, ...props }: SelectProps<T, M>
) {
  const extra = typeof className === 'string' ? className : '';
  return (
    <AriaSelect
      {...props}
      className={({ defaultClassName }) =>
        `${defaultClassName ?? ''}${label ? ' select-with-label' : ''}${extra ? ` ${extra}` : ''}`.trim()
      }
    >
      {label && <Label className="react-aria-Label form-label">{label}</Label>}
      <Button
        className={({ defaultClassName }) =>
          `${defaultClassName ?? ''} form-select${size ? ` ${sizeClassMap[size]}` : ''}`.trim()
        }
      >
        <span className="select-trigger-value">
          <SelectValue />
          <ChevronDown aria-hidden="true" />
        </span>
        {/* P041 value-display-stable-dims: hidden sizer holding every option's
            text as an individual block child, so the trigger's width resolves
            to the widest *option*, not just the currently-displayed value —
            reproducing native <select>'s own intrinsic-sizing behavior. Not
            Bootstrap's `.visually-hidden` (that sets `position:absolute`,
            removing it from the layout flow this technique depends on). */}
        <span className="option-sizer" aria-hidden="true">
          {getOptionLabels(items, children).map((optionLabel, i) => (
            <div key={i}>{optionLabel}</div>
          ))}
        </span>
      </Button>
      {description && (
        <Text slot="description" elementType="div" className="react-aria-Text field-description form-text">
          {description}
        </Text>
      )}
      <FieldError
        elementType="div"
        className={({ defaultClassName }) => `${defaultClassName ?? ''} invalid-feedback`.trim()}
      >
        {errorMessage}
      </FieldError>
      <Popover className={({ defaultClassName }) => `${defaultClassName ?? ''} dropdown-menu`.trim()}>
        <SelectListBox items={items}>{children}</SelectListBox>
      </Popover>
    </AriaSelect>
  );
}

export function SelectListBox<T extends object>({ className, ...props }: ListBoxProps<T>) {
  const extra = typeof className === 'string' ? className : '';
  return (
    <ListBox
      {...props}
      className={({ defaultClassName }) =>
        `${defaultClassName ?? ''} dropdown-listbox${extra ? ` ${extra}` : ''}`.trim()
      }
    />
  );
}

export function SelectItem({ className, ...props }: ListBoxItemProps) {
  const textValue = props.textValue || (typeof props.children === 'string' ? props.children : undefined);
  const extra = typeof className === 'string' ? className : '';
  return (
    <ListBoxItem
      {...props}
      textValue={textValue}
      className={({ defaultClassName }) =>
        `${defaultClassName ?? ''} dropdown-item${extra ? ` ${extra}` : ''}`.trim()
      }
    >
      {composeRenderProps(props.children, (children, { selectionMode }) => (
        <>
          {selectionMode === 'multiple' && <span className="select-item-checkbox" aria-hidden="true" />}
          {typeof children === 'string' ? <Text slot="label">{children}</Text> : children}
        </>
      ))}
    </ListBoxItem>
  );
}
