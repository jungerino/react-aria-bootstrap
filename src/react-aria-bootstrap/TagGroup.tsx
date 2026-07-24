'use client';
import {
  Button,
  Label,
  Tag as AriaTag,
  TagGroup as AriaTagGroup,
  type TagGroupProps as AriaTagGroupProps,
  TagList,
  type TagListProps,
  type TagProps,
  Text,
} from 'react-aria-components/TagGroup';

// Bootstrap-styled TagGroup. Built directly on react-aria-components
// primitives (not the vanilla-starter's shared Form/Content wrappers under
// `src/`) so no original per-component CSS (`src/TagGroup.css`, keyed to
// the vanilla theme's `--gray-*`/`--spacing-*` tokens) has an import path
// into this component — matches Select/Tabs' precedent (P005
// bundle-isolation).
//
// Tag has no direct Bootstrap counterpart (taxonomy M006) — resolved as
// `.btn` + `.btn-outline-secondary` with badge-informed sizing/shape token
// overrides (Decisions D1/D2). `SelectionIndicator` is never rendered
// (Decision D3, mirrors Tabs' Decision D2) — selection is expressed purely
// through the `[data-selected]` bridge in `_bootstrap-bridges.scss`, not a
// rendered indicator element. The Remove Button uses `.btn-close` for its
// interaction cascade/sizing tokens, but a Bootstrap Icons glyph
// (`<i class="bi bi-x">`) instead of its default background-image icon
// (Decision D4, per P022 bs-icons).

export interface TagGroupProps<T>
  extends
    Omit<AriaTagGroupProps, 'children'>,
    Pick<TagListProps<T>, 'items' | 'children' | 'renderEmptyState'> {
  label?: string;
  description?: string;
  errorMessage?: string;
}

export function TagGroup<T extends object>(
  {
    label,
    description,
    errorMessage,
    items,
    children,
    renderEmptyState,
    className,
    ...props
  }: TagGroupProps<T>
) {
  // TagGroup's className has no render-prop form in its API (plain `string`
  // only) — the RAC default class must be spelled out explicitly (P002
  // form 2), since passing any string replaces the default outright rather
  // than appending to it (G040). `tag-group-with-label` stacks
  // Label/TagList/Description/Error in a flex column with a uniform gap
  // (bridge CSS) — mirrors Select's `select-with-label` precedent; the
  // label-less stories (bare TagList, or TagList+Description/Error with no
  // Label) already match the reference's plain block-flow spacing without
  // it, since there's only ever one child in that case.
  const extra = typeof className === 'string' ? className : '';
  return (
    <AriaTagGroup
      {...props}
      className={`react-aria-TagGroup${label ? ' tag-group-with-label' : ''}${extra ? ` ${extra}` : ''}`}
    >
      {label && <Label className="form-label">{label}</Label>}
      <TagList
        items={items}
        renderEmptyState={renderEmptyState}
        className={({ defaultClassName }) => `${defaultClassName ?? ''} d-flex flex-wrap gap-2`.trim()}
      >
        {children}
      </TagList>
      {description && (
        <Text slot="description" elementType="div" className="form-text">
          {description}
        </Text>
      )}
      {errorMessage && (
        <Text slot="errorMessage" elementType="div" className="invalid-feedback">
          {errorMessage}
        </Text>
      )}
    </AriaTagGroup>
  );
}

export function Tag(
  { children, className, removeButtonClassName, ...props }: Omit<TagProps, 'children'> & {
    children?: React.ReactNode;
    /**
     * Additional class(es) for the Remove Button (rendered only when the
     * group is removable). Lets a consumer — or a mirror story reproducing
     * a faux hover/focus-visible specimen (P044) — style the nested Remove
     * Button independently of the Tag body, since it isn't otherwise
     * addressable from outside `Tag`.
     */
    removeButtonClassName?: string;
  }
) {
  let textValue = typeof children === 'string' ? children : undefined;
  const extra = typeof className === 'string' ? className : '';
  return (
    <AriaTag
      textValue={textValue}
      {...props}
      className={({ defaultClassName }) =>
        `${defaultClassName ?? ''} tag btn btn-outline-secondary${extra ? ` ${extra}` : ''}`.trim()
      }
    >
      {({ allowsRemoving }) => (
        <>
          {children}
          {allowsRemoving && (
            <Button
              slot="remove"
              className={({ defaultClassName }) =>
                `${defaultClassName ?? ''} btn-close remove-button${removeButtonClassName ? ` ${removeButtonClassName}` : ''}`.trim()
              }
            >
              <i className="bi bi-x" aria-hidden="true" />
            </Button>
          )}
        </>
      )}
    </AriaTag>
  );
}
