#!/usr/bin/env python3
"""
Comprehensive check for reference section styling issues:
1. Border-radius
2. Colored backgrounds
"""

import re
from pathlib import Path

def is_neutral_background(color):
    """Check if background color is neutral (white/gray)"""
    if not color:
        return True

    color = color.lower().strip()

    # Transparent or none
    if color in ['transparent', 'none', '']:
        return True

    # Pure white
    if color in ['#fff', '#ffff', '#ffffff', 'white', 'rgb(255,255,255)', 'rgb(255, 255, 255)']:
        return True

    # Check for hex colors
    if color.startswith('#'):
        hex_color = color[1:]
        if len(hex_color) == 3:
            hex_color = ''.join([c*2 for c in hex_color])
        if len(hex_color) == 6:
            try:
                r = int(hex_color[0:2], 16)
                g = int(hex_color[2:4], 16)
                b = int(hex_color[4:6], 16)
                # Pure white or pure gray (R=G=B)
                return (r == 255 and g == 255 and b == 255) or (r == g == b)
            except:
                return False

    # RGB format
    if color.startswith('rgb'):
        rgb_match = re.match(r'rgba?\((\d+),?\s*(\d+),?\s*(\d+)', color)
        if rgb_match:
            r, g, b = int(rgb_match.group(1)), int(rgb_match.group(2)), int(rgb_match.group(3))
            return (r == 255 and g == 255 and b == 255) or (r == g == b)

    return False

def analyze_template(filepath):
    """Analyze a template for reference section styling issues"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if no reference section
    if 'reference' not in content.lower():
        return None

    issues = {
        'border_radius': [],
        'colored_backgrounds': [],
        'js_colored_backgrounds': []
    }

    # Pattern 1: CSS .reference-item or .reference with border-radius
    css_patterns = [
        (r'\.reference-item\s*\{([^}]+)\}', 1),
        (r'\.reference\s+\{([^}]+)\}', 1),
        (r'\.(ref|references)-item\s*\{([^}]+)\}', 2)
    ]

    for pattern, group_index in css_patterns:
        matches = re.finditer(pattern, content, re.DOTALL)
        for match in matches:
            styles = match.group(group_index)
            selector = match.group(0).split('{')[0].strip()

            # Check for border-radius
            br_match = re.search(r'border-radius:\s*([^;]+);', styles)
            if br_match:
                issues['border_radius'].append({
                    'selector': selector,
                    'value': br_match.group(1).strip(),
                    'line': content[:match.start()].count('\n') + 1
                })

            # Check for colored background
            bg_match = re.search(r'background(-color)?:\s*([^;]+);', styles)
            if bg_match:
                bg_color = bg_match.group(2).strip()
                if not is_neutral_background(bg_color):
                    issues['colored_backgrounds'].append({
                        'selector': selector,
                        'value': bg_color,
                        'line': content[:match.start()].count('\n') + 1
                    })

    # Pattern 2: JavaScript color schemes with secondary colors
    js_pattern = r'secondary:\s*["\']?([#\w]+)["\']?'
    for match in re.finditer(js_pattern, content):
        color = match.group(1)
        if not is_neutral_background(color):
            # Check if this is in a colorSchemes object
            start = max(0, match.start() - 200)
            context = content[start:match.start()]
            if 'colorScheme' in context or 'color' in context.lower():
                issues['js_colored_backgrounds'].append({
                    'value': color,
                    'line': content[:match.start()].count('\n') + 1
                })

    # Return None if no issues found
    if not any([issues['border_radius'], issues['colored_backgrounds'], issues['js_colored_backgrounds']]):
        return None

    return issues

def main():
    """Scan all templates"""
    template_dir = Path(__file__).parent
    html_files = sorted(template_dir.glob('*.html'))

    print("=" * 100)
    print("COMPREHENSIVE REFERENCE SECTION STYLING CHECK")
    print("=" * 100)
    print()

    templates_with_border_radius = {}
    templates_with_colored_bg = {}

    for html_file in html_files:
        issues = analyze_template(html_file)

        if not issues:
            continue

        if issues['border_radius']:
            templates_with_border_radius[html_file.name] = issues['border_radius']

        if issues['colored_backgrounds'] or issues['js_colored_backgrounds']:
            templates_with_colored_bg[html_file.name] = {
                'css': issues['colored_backgrounds'],
                'js': issues['js_colored_backgrounds']
            }

    # Report border-radius issues
    if templates_with_border_radius:
        print("❌ BORDER-RADIUS FOUND IN REFERENCE SECTIONS")
        print("-" * 100)
        for filename, border_issues in sorted(templates_with_border_radius.items()):
            print(f"\n{filename}:")
            for issue in border_issues:
                print(f"  Line {issue['line']}: {issue['selector']}")
                print(f"    border-radius: {issue['value']}")
        print()
    else:
        print("✓ No border-radius found in reference sections")
        print()

    # Report colored background issues
    if templates_with_colored_bg:
        print("❌ COLORED BACKGROUNDS FOUND IN REFERENCE SECTIONS")
        print("-" * 100)
        for filename, bg_issues in sorted(templates_with_colored_bg.items()):
            print(f"\n{filename}:")
            if bg_issues['css']:
                print("  CSS:")
                for issue in bg_issues['css']:
                    print(f"    Line {issue['line']}: {issue['selector']}")
                    print(f"      background: {issue['value']}")
            if bg_issues['js']:
                print("  JavaScript:")
                for issue in bg_issues['js']:
                    print(f"    Line {issue['line']}: secondary: {issue['value']}")
        print()
    else:
        print("✓ No colored backgrounds found in reference sections")
        print()

    # Summary
    print("=" * 100)
    print("SUMMARY")
    print("=" * 100)
    print(f"Templates with border-radius: {len(templates_with_border_radius)}")
    print(f"Templates with colored backgrounds: {len(templates_with_colored_bg)}")

    if templates_with_border_radius:
        print("\nTemplates needing border-radius removal:")
        for filename in sorted(templates_with_border_radius.keys()):
            print(f"  - {filename}")

    if templates_with_colored_bg:
        print("\nTemplates needing background color fixes:")
        for filename in sorted(templates_with_colored_bg.keys()):
            print(f"  - {filename}")

if __name__ == '__main__':
    main()
