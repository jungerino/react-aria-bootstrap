'use client';
import { createContext, useContext } from 'react';
import {
  Tabs as RACTabs,
  TabList as RACTabList,
  type TabListProps,
  type TabProps,
  Tab as RACTab,
  type TabsProps as RACTabsProps,
  TabPanels as RACTabPanels,
  type TabPanelProps,
  TabPanel as RACTabPanel,
  type TabPanelsProps,
} from 'react-aria-components/Tabs';

// Bootstrap-styled Tabs. Built directly on react-aria-components primitives
// (not a shared vanilla-starter wrapper) so no original per-component CSS
// (`src/Tabs.css`, keyed to the vanilla theme's `--text-color`/`--spacing-*`
// tokens) is imported — matches Select's precedent (P005 bundle-isolation).
// All styling — including the root wrapper's orientation layout, which has
// no Bootstrap counterpart (Bootstrap has no wrapper joining a tab list to
// its content; the two trees are linked only by `data-bs-target`/
// `aria-controls`, never DOM nesting) — lives in
// `src/scss/_bootstrap-bridges.scss`.
//
// `SelectionIndicator` is never rendered (taxonomy Decision D2) — Bootstrap
// expresses the active tab purely through static `[data-selected]` styling
// applied to `.nav-link` itself; the animated floating-indicator concept has
// no Bootstrap counterpart.

const fillClassMap = {
  proportional: 'nav-fill',
  justified: 'nav-justified',
} as const;

type FillMode = keyof typeof fillClassMap;

const TabsFillContext = createContext<FillMode | undefined>(undefined);

export interface TabsProps extends RACTabsProps {
  /**
   * Applies `.nav-fill` (proportional width) or `.nav-justified` (forced
   * equal width) to the TabList. No React Aria equivalent — Bootstrap-
   * authoritative custom prop (taxonomy Decision D3).
   */
  fill?: FillMode;
}

export function Tabs({ fill, ...props }: TabsProps) {
  return (
    <TabsFillContext.Provider value={fill}>
      <RACTabs {...props} />
    </TabsFillContext.Provider>
  );
}

export function TabList<T extends object>({ className, ...props }: TabListProps<T>) {
  const fill = useContext(TabsFillContext);
  const extra = typeof className === 'string' ? className : '';
  return (
    <RACTabList
      {...props}
      className={({ defaultClassName }) =>
        `${defaultClassName ?? ''} nav nav-underline${fill ? ` ${fillClassMap[fill]}` : ''}${extra ? ` ${extra}` : ''}`.trim()
      }
    />
  );
}

export function Tab({ className, ...props }: TabProps) {
  const extra = typeof className === 'string' ? className : '';
  return (
    <RACTab
      {...props}
      className={({ defaultClassName }) => `${defaultClassName ?? ''} nav-link${extra ? ` ${extra}` : ''}`.trim()}
    />
  );
}

export function TabPanels<T extends object>({ className, ...props }: TabPanelsProps<T>) {
  // TabPanels' `className` is plain-string only (no render-prop form in its
  // API) — the RAC default class must be spelled out explicitly (P002 form
  // 2), since passing any string replaces the default outright rather than
  // appending to it (G040).
  const extra = typeof className === 'string' ? className : '';
  return (
    <RACTabPanels {...props} className={`react-aria-TabPanels tab-content${extra ? ` ${extra}` : ''}`} />
  );
}

export function TabPanel(props: TabPanelProps) {
  return <RACTabPanel {...props} />;
}
