#!/bin/bash
# CalGeo.jsx Refactor Script
# Replaces all base.* and grid2/grid3 references with CSS classes

INPUT="/Users/brandondavis/Claude/app/components/CalGeo.jsx.backup"
OUTPUT="/Users/brandondavis/Claude/app/components/CalGeo.jsx"

# Read the file
cp "$INPUT" "$OUTPUT"

# Remove grid2 and grid3 const definitions (they'll be CSS classes now)
sed -i '' '/const grid2 = { display:/d' "$OUTPUT"
sed -i '' '/const grid3 = { display:/d' "$OUTPUT"

# Simple direct replacements
sed -i '' 's/style={base\.card}/className="card"/g' "$OUTPUT"
sed -i '' 's/style={base\.grid2}/className="grid2"/g' "$OUTPUT"
sed -i '' 's/style={base\.grid3}/className="grid3"/g' "$OUTPUT"
sed -i '' 's/style={base\.label}/className="label"/g' "$OUTPUT"
sed -i '' 's/style={base\.select}/className="select"/g' "$OUTPUT"
sed -i '' 's/style={base\.input}/className="input"/g' "$OUTPUT"
sed -i '' 's/style={base\.textarea}/className="textarea"/g' "$OUTPUT"
sed -i '' 's/style={base\.btn}/className="btn-secondary"/g' "$OUTPUT"
sed -i '' 's/style={base\.btnGold}/className="btn-gold"/g' "$OUTPUT"
sed -i '' 's/style={base\.btnJade}/className="btn-jade"/g' "$OUTPUT"
sed -i '' 's/style={base\.tab}/className="tab"/g' "$OUTPUT"

# Now handle spread operator cases: ...base.X becomes just inline styles
# These are more complex and need perl for multi-line regex

# Replace: style={{ ...base.card, ... }} -> className="card" style={{ ... }}
perl -i -pe 's/style=\{\{\s*\.\.\.base\.card\s*,\s*/className="card" style={{/g' "$OUTPUT"

# Replace: style={{ ...base.grid2, ... }} -> className="grid2" style={{ ... }}
perl -i -pe 's/style=\{\{\s*\.\.\.base\.grid2\s*,\s*/className="grid2" style={{/g' "$OUTPUT"

# Replace: style={{ ...base.grid3, ... }} -> className="grid3" style={{ ... }}
perl -i -pe 's/style=\{\{\s*\.\.\.base\.grid3\s*,\s*/className="grid3" style={{/g' "$OUTPUT"

# Replace: style={{ ...base.btn, ...base.btnGold, ... }} -> className="btn-gold" style={{ ... }}
perl -i -pe 's/style=\{\{\s*\.\.\.base\.btn\s*,\s*\.\.\.base\.btnGold\s*,?\s*/className="btn-gold" style={{/g' "$OUTPUT"

# Replace: style={{ ...base.btn, ... }} -> className="btn-secondary" style={{ ... }}
perl -i -pe 's/style=\{\{\s*\.\.\.base\.btn\s*,?\s*/className="btn-secondary" style={{/g' "$OUTPUT"

# Replace: style={{ ...base.btnGold, ... }} -> className="btn-gold" style={{ ... }}
perl -i -pe 's/style=\{\{\s*\.\.\.base\.btnGold\s*,?\s*/className="btn-gold" style={{/g' "$OUTPUT"

# Replace: style={{ ...base.select, ... }} -> className="select" style={{ ... }}
perl -i -pe 's/style=\{\{\s*\.\.\.base\.select\s*,?\s*/className="select" style={{/g' "$OUTPUT"

# Replace: style={{ ...base.input, ... }} -> className="input" style={{ ... }}
perl -i -pe 's/style=\{\{\s*\.\.\.base\.input\s*,?\s*/className="input" style={{/g' "$OUTPUT"

# Replace: style={{ ...base.label, ... }} -> className="label" style={{ ... }}
perl -i -pe 's/style=\{\{\s*\.\.\.base\.label\s*,?\s*/className="label" style={{/g' "$OUTPUT"

# Clean up any empty style props that might be left: style={{}}
perl -i -pe 's/\s*style=\{\{\}\}//g' "$OUTPUT"

# Clean up any trailing commas before closing braces
perl -i -pe 's/,\s*\}\}/}}/g' "$OUTPUT"

echo "Refactoring complete!"
echo "Input: $INPUT"
echo "Output: $OUTPUT"
echo ""
echo "Summary of changes:"
echo "- Replaced all base.* references with CSS className"
echo "- Converted spread operators to className + inline styles"
echo "- Removed grid2/grid3 const definitions"
