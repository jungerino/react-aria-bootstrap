---
title: Define Component Batch
---

# Define Component Batch

Load this file when the user provides a component list for a new batch. Your task is to create `agent/logs/batch-{N}.md`.

---

## Steps

1. **Determine N:** List `agent/logs/` and find the highest existing `batch-{N}.md`. If none exist, use N = 1.
2. **Write** `agent/logs/batch-{N}.md` using the template below.
3. **Confirm** to the user:

   > Created `agent/logs/batch-{N}.md` with {count} components. Start Stage 4 when ready.

---

## Template

```markdown
# Batch {N}

## Components

- {Component1}
- {Component2}
- {Component3}

## Stories

*Populated by Stage 4 orchestrator after each component's reference stories are approved.*

## Stage 4

### {Component1}
*(Populated during Stage 4)*

**Principles used:**
- *(e.g., `M016 decisions-needed`, `P-S001 faux-focus`)*

### {Component2}
*(Populated during Stage 4)*

**Principles used:**
- *(e.g., `M016 decisions-needed`, `P-S001 faux-focus`)*

## Stage 5

### {Component1}
**Principles used:**
- *(e.g., `P014 data-pressed`, `P022 bs-icons`)*

### {Component2}
**Principles used:**
- *(e.g., `P014 data-pressed`, `P022 bs-icons`)*
```

---

## Guidance for the user (if they ask for help choosing)

Aim for ~5 components per batch. Spread challenge types to surface the full range of bridge patterns early:

| Challenge type | Examples |
|----------------|---------|
| Simple single-element | Button, Link, Badge |
| Form input | TextField, NumberField, SearchField |
| List with selection states | ListBox, Menu, TagGroup |
| Tab or disclosure | Tabs, Disclosure |
| No Bootstrap counterpart | Calendar, Slider |
| Compound / portal-rendered | Select, ComboBox, Popover |

Order components simple → complex within the batch — discoveries from earlier components are available in context when tackling harder ones.
