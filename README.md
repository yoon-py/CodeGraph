# CodeGraph

## Structural Graph Generation

- Generate from real codebase scan:
  - `npm run generate:structural`
- List local generation history:
  - `npm run structural:history:list`
- Restore a previous generated version:
  - `npm run structural:history:restore -- <id-or-prefix>`
- Compare two generated versions:
  - `npm run structural:history:diff -- <id-or-prefix-a> <id-or-prefix-b>`

You can override scan target:

- `CODEGRAPH_TARGET_ROOT=/absolute/path/to/repo npm run generate:structural`

## Semantic Pipeline

- Build function/class AST graph + call graph + semantic layer:
  - `npm run generate:semantic`
- Build semantic hierarchy (scenario/capability/operation):
  - `npm run generate:semantic:hierarchy`
- Apply manual semantic curation overrides:
  - `npm run generate:semantic:curate`
- Query-aware top-k context selection:
  - `npm run context:select -- \"push reminder send path\" 8`
- Benchmark retrieval pipeline:
  - `npm run context:benchmark`
  - custom case file: `npm run context:benchmark -- ./benchmarks/my-cases.jsonl 8`

### Semantic Hierarchy (Beta)

- Toolbar toggle: `Semantic Hierarchy (Beta)` (default OFF).
- Interaction:
  - single click: inspector/AI panel
  - double click: drill down (`Scenario -> Capability -> Operation`)
- Semantic inspector (when beta ON):
  - child stats (capability/operation/changed descendants)
  - drill CTA button
  - `Open in Structural (File)` jump
  - linked files/symbols summary

### Semantic curation file

- File: `src/data/analysis/semantic-curation.json`
- Supported keys:
  - `renames`
  - `symbolCapabilityOverrides`
  - `capabilityOverrides`
  - `operationOverrides`
  - `hiddenSymbols`
  - `edgeOverrides`

Sample benchmark case format (`jsonl`):

```json
{"id":"C001","query":"푸시 리마인더를 실제로 보내는 함수가 어디야?","k":8,"goldNamePatterns":["processpushreminders","sendexpopush"]}
```
# CodeGraph
