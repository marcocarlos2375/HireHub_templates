#!/usr/bin/env python3
"""
Find templates that dynamically apply background colors to reference sections via JavaScript
"""

import re
from pathlib import Path

def find_dynamic_reference_styling(filepath):
    """Find JavaScript code that applies background colors to reference elements"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    issues = []

    # Pattern 1: querySelector('.reference-item').forEach with backgroundColor
    pattern1 = r"querySelector(?:All)?\(['\"]\.reference[^'\"]*['\"]\)[^}]*?backgroundColor\s*=\s*([^;]+);"
    for match in re.finditer(pattern1, content, re.DOTALL):
        bg_value = match.group(1).strip()
        issues.append({
            'type': 'Dynamic JS backgroundColor',
            'value': bg_value,
            'context': match.group(0)[:100]
        })

    # Pattern 2: Look for color scheme objects with secondary colors
    pattern2 = r"const\s+colorSchemes?\s*=\s*\{([^}]+secondary[^}]+)\};"
    for match in re.finditer(pattern2, content, re.DOTALL):
        # Extract all secondary color values
        secondary_pattern = r"secondary:\s*['\"]?([#\w]+)['\"]?"
        secondary_colors = re.findall(secondary_pattern, match.group(1))

        if secondary_colors:
            # Check if any are not neutral
            colored = []
            for color in secondary_colors:
                if not is_neutral(color):
                    colored.append(color)

            if colored:
                issues.append({
                    'type': 'Color scheme with colored secondary',
                    'value': ', '.join(set(colored)),
                    'context': 'colorSchemes object'
                })

    return issues if issues else None

def is_neutral(color):
    """Check if color is white, gray, or transparent"""
    color = color.lower().strip()

    if not color.startswith('#'):
        return color in ['white', 'transparent', 'fff', 'ffffff']

    hex_color = color[1:]
    if len(hex_color) == 3:
        hex_color = ''.join([c*2 for c in hex_color])

    if len(hex_color) == 6:
        try:
            r = int(hex_color[0:2], 16)
            g = int(hex_color[2:4], 16)
            b = int(hex_color[4:6], 16)
            # Check if it's pure white or pure gray (R=G=B)
            return (r == 255 and g == 255 and b == 255) or (r == g == b)
        except:
            return False

    return False

def main():
    """Find all templates with dynamic reference coloring"""
    template_dir = Path(__file__).parent
    html_files = sorted(template_dir.glob('*.html'))

    print("=" * 100)
    print("DYNAMIC REFERENCE COLOR APPLICATION CHECK")
    print("=" * 100)
    print()

    templates_with_issues = {}

    for html_file in html_files:
        # Skip if no reference section
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
            if 'reference' not in content.lower():
                continue

        issues = find_dynamic_reference_styling(html_file)
        if issues:
            templates_with_issues[html_file.name] = issues

    if not templates_with_issues:
        print("✓ No templates found with dynamic colored reference backgrounds!")
        return

    for filename, issues in sorted(templates_with_issues.items()):
        print(f"\n❌ {filename}")
        print(f"   Found {len(issues)} dynamic coloring issue(s):\n")

        for i, issue in enumerate(issues, 1):
            print(f"   {i}. Type: {issue['type']}")
            print(f"      Value: {issue['value']}")
            if len(issue.get('context', '')) < 100:
                print(f"      Context: {issue['context']}")
            print()

    print("=" * 100)
    print(f"SUMMARY: {len(templates_with_issues)} template(s) with dynamic reference coloring")
    print("=" * 100)

    print("\nTemplates to check:")
    for filename in sorted(templates_with_issues.keys()):
        print(f"  - {filename}")

if __name__ == '__main__':
    main()
