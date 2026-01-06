#!/usr/bin/env python3
"""
CalGeo.jsx Refactor Script
Replaces all base.* style references with CSS classes from design system
"""

import re

def refactor_calgeo(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove the base object entirely - it shouldn't exist anymore
    # This pattern finds: const base = { ... } (multi-line)
    content = re.sub(r'const base = \{[^}]*?\};', '', content, flags=re.DOTALL)

    # Simple replacements - direct style to className
    replacements = {
        r'style={base\.card}': 'className="card"',
        r'style={base\.grid2}': 'className="grid2"',
        r'style={base\.grid3}': 'className="grid3"',
        r'style={base\.label}': 'className="label"',
        r'style={base\.select}': 'className="select"',
        r'style={base\.input}': 'className="input"',
        r'style={base\.textarea}': 'className="textarea"',
        r'style={base\.btn}': 'className="btn-secondary"',
        r'style={base\.btnGold}': 'className="btn-gold"',
        r'style={base\.btnJade}': 'className="btn-jade"',
        r'style={base\.tab}': 'className="tab"',
        r'style={base\.modal}': 'className="modal"',
        r'style={base\.modalOverlay}': 'className="modal-overlay"',
        r'style={base\.badge}': 'className="badge"',
        r'style={base\.alert}': 'className="alert"',
        r'style={base\.spinner}': 'className="spinner"',
    }

    for pattern, replacement in replacements.items():
        content = re.sub(pattern, replacement, content)

    # Complex replacements - spread operator with base.*
    # Pattern: style={{ ...base.card, ... }} -> className="card" style={{ ... }}

    # Replace ...base.card with className="card"
    def replace_base_card(match):
        full_match = match.group(0)
        rest = match.group(1).strip()
        if rest and rest != '}':
            return f'className="card" style={{{{{rest}}}}}'
        else:
            return 'className="card"'

    content = re.sub(r'style=\{\{\s*\.\.\.base\.card\s*,?\s*(.*?)\}\}', replace_base_card, content)

    # Replace ...base.grid2 with className="grid2"
    def replace_base_grid2(match):
        rest = match.group(1).strip()
        if rest and rest != '}':
            return f'className="grid2" style={{{{{rest}}}}}'
        else:
            return 'className="grid2"'

    content = re.sub(r'style=\{\{\s*\.\.\.base\.grid2\s*,?\s*(.*?)\}\}', replace_base_grid2, content)

    # Replace ...base.grid3 with className="grid3"
    def replace_base_grid3(match):
        rest = match.group(1).strip()
        if rest and rest != '}':
            return f'className="grid3" style={{{{{rest}}}}}'
        else:
            return 'className="grid3"'

    content = re.sub(r'style=\{\{\s*\.\.\.base\.grid3\s*,?\s*(.*?)\}\}', replace_base_grid3, content)

    # Replace ...base.btn, ...base.btnGold combinations
    # Pattern: style={{ ...base.btn, ...base.btnGold, ... }}
    def replace_btn_gold(match):
        rest = match.group(1).strip()
        if rest:
            return f'className="btn-gold" style={{{{{rest}}}}}'
        else:
            return 'className="btn-gold"'

    content = re.sub(r'style=\{\{\s*\.\.\.base\.btn\s*,\s*\.\.\.base\.btnGold\s*,?\s*(.*?)\}\}', replace_btn_gold, content)

    # Replace remaining ...base.btn
    def replace_base_btn(match):
        rest = match.group(1).strip()
        if rest:
            return f'className="btn-secondary" style={{{{{rest}}}}}'
        else:
            return 'className="btn-secondary"'

    content = re.sub(r'style=\{\{\s*\.\.\.base\.btn\s*,?\s*(.*?)\}\}', replace_base_btn, content)

    # Replace ...base.btnGold
    def replace_btnGold(match):
        rest = match.group(1).strip()
        if rest:
            return f'className="btn-gold" style={{{{{rest}}}}}'
        else:
            return 'className="btn-gold"'

    content = re.sub(r'style=\{\{\s*\.\.\.base\.btnGold\s*,?\s*(.*?)\}\}', replace_btnGold, content)

    # Replace ...base.select
    def replace_base_select(match):
        rest = match.group(1).strip()
        if rest:
            return f'className="select" style={{{{{rest}}}}}'
        else:
            return 'className="select"'

    content = re.sub(r'style=\{\{\s*\.\.\.base\.select\s*,?\s*(.*?)\}\}', replace_base_select, content)

    # Replace ...base.input
    def replace_base_input(match):
        rest = match.group(1).strip()
        if rest:
            return f'className="input" style={{{{{rest}}}}}'
        else:
            return 'className="input"'

    content = re.sub(r'style=\{\{\s*\.\.\.base\.input\s*,?\s*(.*?)\}\}', replace_base_input, content)

    # Replace ...base.label
    def replace_base_label(match):
        rest = match.group(1).strip()
        if rest:
            return f'className="label" style={{{{{rest}}}}}'
        else:
            return 'className="label"'

    content = re.sub(r'style=\{\{\s*\.\.\.base\.label\s*,?\s*(.*?)\}\}', replace_base_label, content)

    # Write output
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Refactored {input_file} -> {output_file}")
    print("All base.* references replaced with CSS classes")

if __name__ == '__main__':
    refactor_calgeo(
        '/Users/brandondavis/Claude/app/components/CalGeo.jsx.backup',
        '/Users/brandondavis/Claude/app/components/CalGeo.jsx'
    )
