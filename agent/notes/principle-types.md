---
title: Principle Types — Quick Reference
---

# Principle Types

Quick reference for the entry types used in `agent/react-aria-skill/principles.md`, plus the related Gotcha type used in `agent/react-aria-skill/SKILL.md`. Every principle declares its type in a `**Type:**` field (first line of the entry, right after the heading) so its shape is predictable at a glance without reading the body first.

Source taxonomy: `agent/notes/principles-templates-best-practices.md` (six templates). Five live in `principles.md`; the sixth (Gotcha) lives in `SKILL.md` instead, since gotchas are read by every agent tier, not just component sub-agents.

---

## Triggered

**Use when:** behavior depends on a detectable situation — condition leads to action.
**Fields:** `Type` · `Trigger` · `Action` · `Rationale` · `Example` (if it clarifies)
**Confirmed example:** P001 `compound-sel` in `principles.md`.

## Preference

**Use when:** multiple valid approaches exist and you want a default, with reasoning that generalizes to cases the principle didn't anticipate.
**Fields:** `Type` · `Preferred` · `Over` · `Rationale` · `Exception` (if one exists)
**Confirmed example:** P013 `prefer-component-cls` in `principles.md`.

## Fact

**Use when:** encoding a stable, non-obvious truth the agent needs to reason correctly. Purely informational — no action verb.
**Fields:** `Type` · `Fact` · `Implication` · `Example` (if non-obvious)
**Confirmed example:** none yet — will be backfilled once a reviewed cluster produces one.

## Verification

**Use when:** a fragile step needs a validation gate before proceeding. Low-freedom — a bare imperative is correct here, not an explained preference.
**Fields:** `Type` · `Trigger` · `Check` · `On-failure`
**Confirmed example:** none yet — candidate: P033 `verify-scss-vars` (Cluster 13, not yet reviewed).

## Procedural

**Use when:** a multi-step sequence must run in order, or an escalation/fallback path is needed.
**Fields:** `Type` · `Trigger` · `Steps` · `Fallback` · `Stop-condition`
**Confirmed example:** none yet — not yet reviewed.

---

## Gotcha (SKILL.md only — not a `principles.md` type)

**Use when:** correcting a predictable mistake — "you'd think X, but Y." Lives in `SKILL.md`'s Gotchas section rather than `principles.md`, since every tier loads `SKILL.md` but only Tier 1 loads `principles.md`.
**Fields:** `Tempting-but-wrong` · `Why-it-fails` · `Correct-approach` · `Symptom` — no `Type:` field, since the section heading already establishes it and the field names are self-evidently gotcha-shaped.
**Confirmed example:** G010 `className-callback-interpolation` in `SKILL.md`.

---

**Note:** "Fact," "Verification," and "Procedural" examples above are placeholders pending confirmation — per this project's rule against speculative templates, don't treat their field lists as ground-truthed until a real reviewed principle fills them in.
