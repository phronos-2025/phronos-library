# Scite.ai Processing Pipeline

A structured pipeline for processing scite.ai literature search results into organized research summaries. Designed to support Library entry generation for Phronos.

## Overview

This pipeline:

1. **Preserves raw data** — Full scite.ai output stored in standardized format (gitignored)
2. **Structures findings** — LLM-assisted summarization into consistent format
3. **Organizes by cluster** — Groups questions thematically per research outline
4. **Flags gaps** — Identifies questions requiring deep web research
5. **Maintains traceability** — Every processed entry references its source file

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Set API key
export ANTHROPIC_API_KEY="your-key-here"

# Process all questions for a topic
python process_scite.py --topic digital-identity-formation

# Or dry-run to check parsing
python process_scite.py --topic digital-identity-formation --dry-run
```

## Workflow

### Step 1: Create Raw Files

For each research question in your topic's `OUTLINE.md`, create a raw file following the format in:
- `library/topics/{topic}/sources/scite/RAW_FORMAT.md`

Example:
```bash
library/topics/digital-identity-formation/sources/scite/raw/Q01_it_identity_evidence.md
```

### Step 2: Process Files

```bash
# Process all raw files for a topic
python process_scite.py --topic digital-identity-formation

# Process single question
python process_scite.py --topic digital-identity-formation --question Q05

# Process entire cluster
python process_scite.py --topic digital-identity-formation --cluster 2

# Dry run (parse only, no API calls)
python process_scite.py --topic digital-identity-formation --dry-run --verbose
```

#### Batch Processing

For large topic sets (e.g., 72 questions), use batch processing:

```bash
# Process 10 questions at a time with 2s delay between batches
python process_scite.py --topic digital-identity-formation --batch-size 10

# Process first 5 questions only (for testing)
python process_scite.py --topic digital-identity-formation --limit 5

# Skip already processed files (resume interrupted run)
python process_scite.py --topic digital-identity-formation --skip-processed

# Require confirmation before starting (shows cost estimate first)
python process_scite.py --topic digital-identity-formation --confirm

# Combine options for controlled processing
python process_scite.py --topic digital-identity-formation \
    --batch-size 10 \
    --skip-processed \
    --confirm \
    --verbose
```

**Batch processing options:**
- `--batch-size N` — Process N questions per batch (0 = all at once)
- `--batch-delay N` — Delay in seconds between batches (default: 2)
- `--limit N` — Only process first N questions (0 = no limit)
- `--skip-processed` — Skip files that already have processed JSON
- `--confirm` — Show cost estimate and require confirmation before starting

### Step 3: Review Output

After processing:

- `library/topics/{topic}/sources/scite/processed/` — Individual summaries per question (`.md` and `.json`)
- `library/topics/{topic}/sources/scite/output/LITERATURE_REVIEW_SUMMARY.md` — Consolidated report with executive summary

The consolidated report includes:

- Coverage matrix by cluster
- Questions flagged for deep web research
- All structured summaries organized by cluster

### Step 4: Export Library Entry

```bash
# Generate MDX scaffold from processed summaries
python export_lib.py --topic digital-identity-formation --lib-id LIB-001
```

This creates:
- `library/topics/{topic}/lib/LIB-001/LIB-001.mdx` (working file for human synthesis)
- `library/topics/{topic}/exports/lib-001.mdx` (copy-ready for phronos-site)

## Configuration

Edit `config.yaml` to adjust:

- **API settings** — Model, temperature, max tokens
- **Coverage thresholds** — Reference counts for Rich/Moderate/Sparse
- **Output options** — Individual files, consolidated report, format

## Topic Structure

Each topic must have:

- `library/topics/{topic}/TOPIC.md` — Topic metadata
- `library/topics/{topic}/sources/scite/OUTLINE.md` — Research questions with YAML frontmatter containing cluster definitions
- `library/topics/{topic}/sources/scite/RAW_FORMAT.md` — Format specification (template)

## Handling Sparse Results

When scite.ai returns limited results:

1. Note in the raw file: `notes: "SPARSE - limited results"`
2. The pipeline will flag these automatically
3. The consolidated report lists all flagged questions
4. Use flagged list to prioritize deep web research

## Regenerating Reports

To regenerate the consolidated report without re-processing:

```bash
python process_scite.py --topic {topic} --report-only
```

This reads from `processed/*.json` and rebuilds `LITERATURE_REVIEW_SUMMARY.md`.

## Troubleshooting

**YAML parse errors**: Check frontmatter syntax in raw files. Common issues:
- Missing quotes around strings with colons
- Incorrect indentation

**JSON extraction fails**: The LLM occasionally formats JSON incorrectly. Re-run the single question:
```bash
python process_scite.py --topic {topic} --question Q{num} --verbose
```

**API rate limits**: Use batch processing with delays:
```bash
python process_scite.py --topic {topic} --batch-size 10 --batch-delay 5
```

**Topic not found**: Ensure the topic directory exists at `library/topics/{topic}/sources/scite/`

