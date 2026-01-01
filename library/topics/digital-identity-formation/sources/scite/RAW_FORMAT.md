# Raw Scite.ai Output Format Specification

## Overview

This document specifies the file format for capturing raw scite.ai output before processing. The format preserves full fidelity of the original retrieval while adding minimal metadata for pipeline processing.

---

## File Naming Convention

```
raw/Q{NN}_{short_slug}.md
```

Examples:
- `raw/Q01_it_identity_evidence.md`
- `raw/Q10_first_session_retention.md`
- `raw/Q26_conversational_ai_retention.md`

---

## File Structure

Each raw file uses Markdown with YAML frontmatter:

```markdown
---
question_id: Q01
cluster: 1
question_title: "IT Identity Empirical Evidence"
query_submitted: "What empirical evidence supports the three-dimensional model of IT Identity (relatedness, emotional energy, dependence) proposed by Carter and colleagues?"
retrieval_date: 2025-01-02
retrieval_time: "14:32:00"
scite_assistant_url: ""  # Optional: URL if scite provides shareable links
notes: ""  # Optional: any retrieval notes
---

## Scite.ai Narrative Response

[Paste the full narrative output from scite.ai here, preserving all formatting]

---

## References

[Paste the full reference list from scite.ai here]

1. Author, A. B., & Author, C. D. (Year). Title of article. *Journal Name*, Volume(Issue), pages. https://doi.org/...

2. ...

---

## Citation Metrics (Optional)

If scite.ai provides citation context metrics, record them here:

| Reference | Supporting | Mentioning | Contrasting |
|-----------|------------|------------|-------------|
| Author (Year) | 12 | 45 | 3 |
| ... | ... | ... | ... |
```

---

## Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `question_id` | String | Format: Q{NN}, e.g., Q01, Q15, Q32 |
| `cluster` | Integer | Cluster number (1-8) from OUTLINE.md |
| `question_title` | String | Short descriptive title |
| `query_submitted` | String | Exact query text submitted to scite.ai |
| `retrieval_date` | Date | ISO format: YYYY-MM-DD |

## Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `retrieval_time` | String | HH:MM:SS format |
| `scite_assistant_url` | String | Shareable URL if available |
| `notes` | String | Any retrieval notes or observations |

---

## Content Guidelines

### Narrative Response Section

- Paste verbatim from scite.ai
- Preserve all inline citations as scite formats them
- Do not edit, summarize, or restructure
- Include any caveats or hedging language scite provides

### References Section

- Paste full reference list from scite.ai
- Number sequentially
- Include DOIs where available
- If scite provides incomplete references, note this in the `notes` field

### Citation Metrics Section

- Optional but valuable for assessing evidence quality
- If scite shows "supported by X citations" or similar, capture here
- Helps prioritize which references to verify

---

## Handling Special Cases

### Sparse Results

If scite.ai returns minimal content:

```yaml
notes: "SPARSE - scite returned only 2 references with limited narrative"
```

The processing script will flag these for deep web research.

### No Results

If scite.ai cannot answer the query:

```yaml
notes: "NO_RESULTS - scite could not locate relevant literature"
```

Create the file anyway with empty narrative and references sections.

### Multiple Queries

If you refine the query and run multiple searches:

1. Keep the original file as `Q{NN}_{slug}.md`
2. Create additional files as `Q{NN}_{slug}_v2.md`, `Q{NN}_{slug}_v3.md`
3. The processing script will use the highest version number

---

## Validation Checklist

Before running the processing script, verify each raw file has:

- [ ] Valid YAML frontmatter (no syntax errors)
- [ ] Correct `question_id` matching filename
- [ ] Correct `cluster` number per OUTLINE.md
- [ ] `retrieval_date` populated
- [ ] Narrative section present (even if sparse)
- [ ] References section present (even if empty)

