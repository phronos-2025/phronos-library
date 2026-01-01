# Phronos Library

A content processing pipeline for generating evidence-based Library entries for the Phronos observatory.

## Overview

This repository contains:

- **Topic-organized Library content** — Each Library topic (e.g., `digital-identity-formation`) owns its research questions, scite.ai artifacts, and synthesized entries.
- **Scite.ai processing pipeline** — Transforms raw literature search results into structured summaries using LLM-assisted analysis.
- **Export tools** — Generates publish-ready MDX files compatible with `phronos-site` Astro content collections.

## Repository Structure

```
phronos-library/
├── tools/scite-pipeline/     # Processing scripts (DRY, reusable)
├── library/topics/           # Topic-specific content and artifacts
└── registry/                 # Global LIB ID allocation
```

## Quick Start

### 1. Setup

```bash
# Install dependencies
pip install -r tools/scite-pipeline/requirements.txt

# Set API key
export ANTHROPIC_API_KEY="your-key-here"
```

### 2. Create Raw Scite Files

For each research question, create a raw file following the format in:
- `library/topics/{topic}/sources/scite/RAW_FORMAT.md`

Example:
```bash
# Create raw file
library/topics/digital-identity-formation/sources/scite/raw/Q01_it_identity_evidence.md
```

### 3. Process Scite Results

```bash
# Process all questions for a topic
python tools/scite-pipeline/process_scite.py --topic digital-identity-formation

# Process single question
python tools/scite-pipeline/process_scite.py --topic digital-identity-formation --question Q05

# Dry run (parse only, no API calls)
python tools/scite-pipeline/process_scite.py --topic digital-identity-formation --dry-run
```

### 4. Export Library Entry

```bash
# Generate MDX scaffold from processed summaries
python tools/scite-pipeline/export_lib.py --topic digital-identity-formation --lib-id LIB-001
```

This creates:
- `library/topics/digital-identity-formation/lib/LIB-001/LIB-001.mdx` (working file)
- `library/topics/digital-identity-formation/exports/lib-001.mdx` (copy-ready for phronos-site)

### 5. Copy to phronos-site

```bash
# Copy the export to your site repository
cp library/topics/digital-identity-formation/exports/lib-001.mdx \
   ../phronos-site/src/content/library/lib-001.mdx
```

## Workflow

1. **Define topic** → Create `library/topics/{topic}/` with `TOPIC.md` and `sources/scite/OUTLINE.md`
2. **Run scite.ai searches** → Save raw results in `sources/scite/raw/`
3. **Process** → Run `process_scite.py --topic {topic}` to generate structured summaries
4. **Review** → Check `sources/scite/processed/` and `sources/scite/output/`
5. **Export** → Run `export_lib.py` to generate MDX scaffold
6. **Synthesize** → Edit the `lib/LIB-###/LIB-###.mdx` file with human synthesis
7. **Publish** → Copy export to `phronos-site/src/content/library/`

## Git Policy

- **Commit**: `processed/*.json`, `processed/*.md`, `output/` reports (preserves LLM cost)
- **Ignore**: `raw/` directories (local-only, may contain large pastes)

## Adding a New Topic

1. Create `library/topics/{topic-slug}/`
2. Add `TOPIC.md` with topic metadata (title, overview, related methodology)
3. Create `sources/scite/OUTLINE.md` with:
   - YAML frontmatter containing `topic` and `clusters` definitions
   - Human-readable research questions organized by cluster
4. Copy `RAW_FORMAT.md` template into `sources/scite/` (or reference the one in tools/)
5. Allocate a LIB ID from `registry/library_ids.yaml` (see below)

## LIB ID Allocation

Library IDs are **global** across all topics to ensure uniqueness. To allocate a new ID:

1. Open `registry/library_ids.yaml`
2. Note the `next_id` value (e.g., `1`)
3. Use `LIB-001` format (zero-padded to 3 digits)
4. Update `next_id` to the next available number
5. Optionally add an entry to `allocations` for tracking:

```yaml
next_id: 2

allocations:
  LIB-001:
    topic: digital-identity-formation
    title: "Digital Identity Formation and Expression"
    created: 2025-01-02
```

## Detailed Workflow

### Phase 1: Literature Search

1. Review `library/topics/{topic}/sources/scite/OUTLINE.md` for research questions
2. For each question, run a scite.ai search
3. Create a raw file in `sources/scite/raw/` following `RAW_FORMAT.md`:
   - File name: `Q{NN}_{short_slug}.md`
   - Include YAML frontmatter with question metadata
   - Paste full scite.ai narrative and references verbatim

### Phase 2: Processing

1. **Dry run** (optional): Parse files without API calls
   ```bash
   python tools/scite-pipeline/process_scite.py --topic {topic} --dry-run --verbose
   ```

2. **Process all questions**:
   ```bash
   python tools/scite-pipeline/process_scite.py --topic {topic}
   ```

3. **Review outputs**:
   - Check `sources/scite/processed/` for individual summaries
   - Review `sources/scite/output/LITERATURE_REVIEW_SUMMARY.md` for coverage matrix
   - Identify questions flagged for deep web research

4. **Handle sparse results**:
   - Conduct manual literature searches (Google Scholar, ACM, IEEE, etc.)
   - Update raw files with additional findings
   - Re-run processing for updated questions

### Phase 3: Synthesis

1. **Export Library entry scaffold**:
   ```bash
   python tools/scite-pipeline/export_lib.py --topic {topic} --lib-id LIB-001
   ```

2. **Edit working file**:
   - Open `library/topics/{topic}/lib/LIB-001/LIB-001.mdx`
   - Synthesize findings across clusters
   - Add interpretation, implications, limitations
   - Refine bibliography

3. **Update export** (re-run export script after edits, or manually copy)

### Phase 4: Publication

1. **Copy to phronos-site**:
   ```bash
   cp library/topics/{topic}/exports/lib-001.mdx \
      ../phronos-site/src/content/library/lib-001.mdx
   ```

2. **Verify in phronos-site**:
   - Check frontmatter matches Astro content collection schema
   - Preview locally
   - Update `status` from `researching` to `published` when ready

## Conventions

- **Topic slugs**: Use kebab-case (e.g., `digital-identity-formation`)
- **Question IDs**: Format `Q{NN}` with zero-padding (e.g., `Q01`, `Q32`)
- **LIB IDs**: Format `LIB-{NNN}` with zero-padding (e.g., `LIB-001`)
- **File naming**: Match IDs exactly (e.g., `Q01_*.md`, `LIB-001.mdx`)
- **Git commits**: Include processed JSON/MD, exclude raw files

## Related

- `phronos-site` — The Astro site that consumes exported Library entries
- See `tools/scite-pipeline/README.md` for detailed pipeline documentation

