# End-to-End Workflow — Implementation Tasks

**Spec:** `agent/notes/end-to-end-plan.md` — the authoritative source for all requirements. Tasks reference spec sections by name rather than duplicating content.

**Purpose:** Ordered task list for the Phase 3 implementation agent. Each task targets a specific file or directory change and is self-contained enough to hand to a subagent.

**Scope:** Skill file refactors, new skill files, protocol doc updates, script changes, and directory/path renames described in the spec. Does not include the per-component batch work performed by the workflow itself — that is the workflow's output, not its setup.

---

## Tasks

*(To be drafted by the incoming agent — see prompt at end of this file)*

---

## Prompt

Read `agent/notes/end-to-end-plan.md` in full before drafting tasks. Then fill in the Tasks section above, following these guidelines:

- **One task per file or coherent change set.** A task may touch one file or a small set of tightly coupled files (e.g. a rename across a directory). Avoid bundling unrelated files into one task.
- **Ordered for safe execution.** Tasks that create prerequisites for later tasks come first (e.g. create directories before writing files into them; create a new skill file before removing references to old paths).
- **Self-contained.** Each task must specify: the file(s) to create/edit/delete, what changes to make (by referencing the relevant spec section by name), and the acceptance condition (how an agent knows the task is done).
- **No content duplication.** Reference the spec section; don't copy its text. Exception: short acceptance conditions are fine to state inline.
- **Commit granularity.** Each task should map to one logical commit. Note this in the task.

### Task format

```markdown
### Task N — {Short title}

**Files:** `path/to/file`
**Spec section:** {Name of the relevant section in end-to-end-plan.md}
**What to do:** {One or two sentences describing the change, referencing the spec}
**Done when:** {Acceptance condition}
**Commit:** `{suggested commit message}`
```

Remove this Prompt section once the tasks are written.
