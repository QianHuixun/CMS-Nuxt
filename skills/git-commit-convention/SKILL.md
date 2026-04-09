---
name: git-commit-convention
description: Use when the user asks for Git commit guidance, wants help writing commit messages, asks for a 提交规范, or needs changes split into clear and reviewable commits for this repository.
---

# Git Commit Convention

Use this skill when the task is about:

- writing a commit message
- defining or following commit rules
- deciding how to split changes into commits
- checking whether a commit is too large or mixed

## Goal

Produce commits that are:

- atomic
- easy to review
- easy to revert
- consistent in wording

## Default Format

Use:

```text
type(scope): subject
```

Examples:

```text
feat(menu): add planned admin menu placeholders
fix(profile): keep avatar upload after admin cleanup
docs(skill): add git commit convention skill
refactor(router): remove unused dynamic routes
chore(migration): seed planned admin menus
```

## Allowed Types

- `feat`: new capability
- `fix`: bug fix or regression fix
- `refactor`: restructuring without intended behavior change
- `docs`: documentation only
- `chore`: maintenance or support work
- `test`: tests added or updated
- `perf`: performance improvement
- `style`: formatting-only changes

## Scope Guidance

Prefer the smallest useful scope.

Common scopes for this repo:

- `admin`
- `web`
- `menu`
- `router`
- `profile`
- `auth`
- `migration`
- `docs`
- `skill`

If a change spans multiple real concerns, split commits instead of widening scope.

## Subject Rules

The subject line should:

- be lowercase
- use imperative mood
- describe the actual change
- stay concise, ideally under 72 characters

Good:

```text
feat(admin): add activity management placeholder pages
chore(migration): insert planned admin menu tree
docs(rules): add git commit guidelines
```

Bad:

```text
update code
fix some bugs
final changes
```

## When to Split Commits

Split commits when the diff differs by:

- concern
- rollback value
- deployment order
- reviewability

Recommended split for admin feature work:

1. placeholder pages
2. backend support
3. migration or menu seed
4. docs

## Commit Body

Add a body only when it improves review clarity.

Use a body for:

- migrations
- destructive cleanup
- non-obvious design choices
- rollout or compatibility notes

Example:

```text
chore(migration): insert planned admin menu tree

- add 5 parent menus and 10 child menus
- keep pages as placeholders for now
- use fixed menu ids for stable follow-up migrations
```

## What to Avoid

- vague subjects like `update`, `modify`, `optimize`
- mixing unrelated cleanup and feature work
- one giant commit containing pages, migrations, docs, and refactors together
- `wip`, `temp`, `misc`, `final`

## Repo-Specific Rules

### 1. Keep Menu Work Atomic

For admin menu changes, prefer separate commits for:

- pages/components
- migrations
- backend APIs
- documentation

### 2. Isolate Destructive Cleanup

Module removals should use explicit wording:

```text
refactor(admin): remove monitor module pages and routes
chore(migration): delete monitor menu tree
fix(profile): preserve profile endpoints after admin cleanup
```

### 3. Migrations Prefer Separate Commits

If a commit changes DB menu data, schema, or seed state, prefer a dedicated `migration` or `menu` commit.

### 4. Docs Can Stand Alone

If code changes are already large, place docs in a separate `docs(...)` commit.

## Quick Decision Rules

If the change only adds placeholder pages:

```text
feat(admin): add placeholder pages for planned admin modules
```

If the change only adds menu data:

```text
chore(migration): add planned admin menu tree
```

If the change only removes old modules:

```text
refactor(admin): remove deprecated admin modules
```

If the change only adds documentation:

```text
docs(rules): add git commit convention
docs(skill): add git commit convention skill
```

## Recommended Workflow

Before committing:

1. inspect `git status`
2. group files by concern
3. isolate migrations if present
4. choose the smallest clear scope
5. write a precise subject
6. add a body only if needed

## Expected Output

When helping the user, prefer returning:

1. a recommended commit split
2. exact commit message candidates
3. a short explanation if the split is non-obvious

Do not default to a single large commit if the work spans multiple concerns.
