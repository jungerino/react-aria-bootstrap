Commit `.claude/settings.json` and/or `CLAUDE.md` on the current branch, propagate to `main`, then merge `main` into every integration branch.

## Scope

**No arguments (default):** auto-detect which files have uncommitted changes via `git status`. If neither file has changes, report "Nothing to sync." and stop.

**Explicit arguments** (override auto-detect — use when the file is already committed on this branch but not yet propagated):
- `settings` → `.claude/settings.json` only
- `claude` → `CLAUDE.md` only
- `settings claude` or `claude settings` → both files

## Execution

### Step 1 — Record starting state

```bash
ORIGINAL_BRANCH=$(git rev-parse --abbrev-ref HEAD)
```

If auto-detecting scope: inspect `git status --short` for `.claude/settings.json` and `CLAUDE.md`. Only include a file if it appears as modified or untracked.

### Step 2 — Commit on current branch

Stage only the files in scope (git silently skips files with no changes):

```bash
git add .claude/settings.json   # if in scope
git add CLAUDE.md               # if in scope
git commit -m "chore: sync config"
git push origin "$ORIGINAL_BRANCH"
```

If already-committed mode (explicit args, no local changes): skip commit and push; the current branch already has the right content.

### Step 3 — Propagate to main

Skip this step entirely if `$ORIGINAL_BRANCH` is `main`.

```bash
git switch main
git pull origin main
git checkout "$ORIGINAL_BRANCH" -- .claude/settings.json   # if in scope
git checkout "$ORIGINAL_BRANCH" -- CLAUDE.md               # if in scope
git commit -m "chore: sync config"
git push origin main
```

### Step 4 — Update integration branches

**Integration branches** = remote branches from `git branch -r` excluding:
- `origin/main` — already updated above
- `origin/$ORIGINAL_BRANCH` — already updated in Step 2
- `origin/HEAD`
- Any branch whose name ends with `_` followed by one or more digits (e.g. `bootstrap-mapping_0`) — these are numbered snapshot branches, not live integration branches

```bash
# Example filter — strip "origin/" prefix, then exclude pattern:
git branch -r \
  | sed 's|origin/||' \
  | grep -v '^main$' \
  | grep -v '^HEAD' \
  | grep -v '_[0-9]*$' \
  | grep -v "^${ORIGINAL_BRANCH}$"
```

For each integration branch:

```bash
git switch <branch>
git pull origin <branch>
git merge main --no-edit
git push origin <branch>
```

**On merge conflict:** stop immediately. Report which branch conflicted and which files are in conflict. Do not continue to the remaining branches.

### Step 5 — Return to original branch

```bash
git switch "$ORIGINAL_BRANCH"
```

### Step 6 — Summary report

Report:
- Which files were synced
- Which branches were updated (main + integration branches)
- Any branches skipped (with reason)
- Any conflict that stopped the run
