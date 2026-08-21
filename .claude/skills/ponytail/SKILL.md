---
name: ponytail
description: Write less, more necessary code. A minimalist coding discipline — write only what the task needs and never cut validation, error handling, security, or accessibility. Apply on every code change to keep diffs minimal and avoid over-engineering. Vendored reference to DietrichGebert/ponytail (MIT).
license: MIT
---

# ponytail

> "He says nothing. He writes one line. It works."
> Vendored reference of [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail). Install the live plugin with `/plugin marketplace add DietrichGebert/ponytail` then `/plugin install ponytail@ponytail`.

## Philosophy
The rule is never "fewest tokens." It is: **write only what the task needs**, and never cut validation, error handling, security, or accessibility. The code ends up small because it is *necessary*, not golfed.

Lazy, not negligent: trust-boundary validation, data-loss handling, security, and accessibility are never on the chopping block. Lazy about the solution, never about reading.

## The ladder (run top-down on every change)
1. Does this need to exist? → no: skip it (YAGNI).
2. Already in this codebase? → reuse it, don't rewrite.
3. Stdlib does it? → use it.
4. Native platform feature? → use it.
5. Installed dependency? → use it.
6. One line? → one line.
7. Only then: the minimum that works.

## When to use
- Before writing any new code or abstraction.
- During review/cleanup: audit for dead code, redundancy, and over-engineering.

## Do not
- Golf variable names, collapse readability, or drop error paths to hit a line count.
- Add "future-proof" code for requirements that do not exist yet.
- Cut validation, security, error handling, or accessibility to be "minimal."
