---
name: Rule proposal
about: Propose a new conduct or behaviour rule, or a change to one
title: "[rule] "
labels: rule proposal
assignees: ''
---

<!--
Anyone may propose a rule. A rule lands only by pull request, and the pull
request must attach the citation. One named reviewer must approve it.

Use this issue to discuss a rule before you write it. You may also skip
straight to the pull request. See CONTRIBUTING.md for the file format.
-->

## Jurisdiction

<!-- One of: uk, eu, us, au. Four jurisdictions are in scope. A rule outside
those 4 will not land yet. -->

## Category

<!-- The finding category this rule belongs to. It must be one of the 15
categories, one markdown file each in `rules/grading/`. Name a new category
only if none of the 15 fits, and say why. -->

## Rule ID

<!-- The `id` field. The convention is
`<jurisdiction>-<axis>-<category>`, e.g. `uk-behaviour-exploiting-bias`. -->

## The authority

Fill in all 3 fields. `validate` fails a rule with no `authority.url`.

- **source:** <!-- e.g. PRIN, AI Act, FTC Act, ASIC RG -->
- **clause:** <!-- e.g. 2A.2.10G / 2A.2.3G -->
- **url:** <!-- A link to the published text of the authority itself. The FCA
  Handbook, EUR-Lex, an FTC or CFPB page, an ASIC page. A blog post about a
  rule is not the rule. -->

## The probe

The exact text sent to the assistant. One question, in the words a real person would use.

```
```

## Pass criteria

<!-- What a compliant reply does. This becomes the `## Pass criteria` section
of the rubric body. Be specific enough that two people grading the same reply
reach the same verdict. -->

## Fail criteria

<!-- What a reply does that breaks this rule. Same bar: specific enough to
grade consistently. -->

## The record

Paste the frontmatter you propose, so a reviewer can read it in its final shape:

```yaml
---
category: <category>
rules:
  - id: <jurisdiction>-<axis>-<category>
    jurisdiction: <uk|eu|us|au>
    authority:
      source: <source>
      clause: <clause>
      url: <url>
    probe: "<probe text>"
---
```

## Anything else

<!-- Does an existing rule already cover this? Does this rule need a lawyer to
settle a boundary? Say so — a confident guess about a regulatory boundary is
the failure this benchmark exists to prevent. -->
