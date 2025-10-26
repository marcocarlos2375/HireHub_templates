#!/usr/bin/env python3
"""
Automatically fix all reference section styling issues:
1. Remove border-radius
2. Change colored backgrounds to white/gray
"""

import re
from pathlib import Path

def fix_border_radius(content):
    """Remove border-radius from reference sections"""
    # Pattern: Find .reference-item or similar with border-radius
    patterns = [
        # Match .reference-item { ... border-radius: XXX; ... }
        (r'(\.reference-item\s*\{[^}]*?)border-radius:\s*[^;]+;', r'\1'),
        # Match .reference { ... border-radius: XXX; ... }
        (r'(\.reference\s+\{[^}]*?)border-radius:\s*[^;]+;', r'\1'),
        # Match .ref-item or .references-item
        (r'(\.(ref|references)-item\s*\{[^}]*?)border-radius:\s*[^;]+;', r'\1'),
    ]

    for pattern, replacement in patterns:
        content = re.sub(pattern, replacement, content, flags=re.DOTALL)

    return content

def fix_colored_backgrounds(content, template_name):
    """Fix colored backgrounds in reference sections"""

    # Template-specific fixes based on the analysis
    fixes = {
        'Beige.html': [
            ('secondary: \'#e8e0d8\'', 'secondary: \'#f5f5f5\''),
            ('secondary: "#e8e0d8"', 'secondary: "#f5f5f5"'),
        ],
        'BrightPath.html': [
            ('secondary: \'#f8f4e6\'', 'secondary: \'#fff\''),
            ('secondary: "#f8f4e6"', 'secondary: "#fff"'),
        ],
        'Clarity.html': [
            ('secondary: \'#f8f9fa\'', 'secondary: \'#f5f5f5\''),
            ('secondary: "#f8f9fa"', 'secondary: "#f5f5f5"'),
        ],
        'Epure.html': [
            ('secondary: \'#4a7bc8\'', 'secondary: \'#f5f5f5\''),
            ('secondary: "#4a7bc8"', 'secondary: "#f5f5f5"'),
            ('secondary: \'#4a7c22\'', 'secondary: \'#f5f5f5\''),
            ('secondary: "#4a7c22"', 'secondary: "#f5f5f5"'),
        ],
        'Focus.html': [
            ('secondary: \'#f8f9fa\'', 'secondary: \'#f5f5f5\''),
            ('secondary: "#f8f9fa"', 'secondary: "#f5f5f5"'),
        ],
    }

    if template_name in fixes:
        for old, new in fixes[template_name]:
            content = content.replace(old, new)

    return content

def process_template(filepath):
    """Process a single template file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Remove border-radius
    content = fix_border_radius(content)

    # Fix colored backgrounds
    content = fix_colored_backgrounds(content, filepath.name)

    # Only write if changed
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True

    return False

def main():
    """Fix all templates"""
    template_dir = Path(__file__).parent

    # Templates that need fixes based on our analysis
    templates_to_fix = [
        # Border-radius issues
        'BlueAccent.html',
        'Elegance.html',
        'Midnight.html',
        'MidnightBlue.html',
        # Colored background issues
        'Beige.html',
        'BrightPath.html',
        'Clarity.html',
        'Epure.html',
        'Focus.html',
    ]

    print("=" * 100)
    print("FIXING REFERENCE SECTION STYLING ISSUES")
    print("=" * 100)
    print()

    fixed_count = 0

    for filename in templates_to_fix:
        filepath = template_dir / filename

        if not filepath.exists():
            print(f"❌ Not found: {filename}")
            continue

        try:
            was_fixed = process_template(filepath)
            if was_fixed:
                print(f"✓ Fixed {filename}")
                fixed_count += 1
            else:
                print(f"  {filename} (no changes needed)")

        except Exception as e:
            print(f"❌ Error with {filename}: {e}")

    print()
    print("=" * 100)
    print(f"SUMMARY: Fixed {fixed_count} template(s)")
    print("=" * 100)
    print()
    print("Changes applied:")
    print("  1. Removed all border-radius from reference sections")
    print("  2. Changed colored backgrounds to white/gray (#fff or #f5f5f5)")
    print()
    print("Run find_reference_styling_issues.py to verify all fixes.")

if __name__ == '__main__':
    main()
