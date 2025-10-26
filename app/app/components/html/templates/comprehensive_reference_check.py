#!/usr/bin/env python3
"""
Comprehensive check for ALL reference section styling in templates
"""

import re
from pathlib import Path

def extract_all_reference_styles(content):
    """Extract ALL CSS rules that might apply to reference sections"""
    styles_found = []

    # Pattern 1: .reference-item (most common)
    pattern1 = r'\.reference-item\s*\{([^}]+)\}'
    for match in re.finditer(pattern1, content, re.DOTALL):
        styles_found.append({
            'selector': '.reference-item',
            'styles': match.group(1).strip()
        })

    # Pattern 2: .reference (without suffix)
    pattern2 = r'\.reference\s*\{([^}]+)\}'
    for match in re.finditer(pattern2, content, re.DOTALL):
        styles_found.append({
            'selector': '.reference',
            'styles': match.group(1).strip()
        })

    # Pattern 3: .references-item or .ref-item
    pattern3 = r'\.(references?|ref)-item\s*\{([^}]+)\}'
    for match in re.finditer(pattern3, content, re.DOTALL):
        styles_found.append({
            'selector': match.group(0).split('{')[0].strip(),
            'styles': match.group(2).strip()
        })

    # Pattern 4: Dynamic styling in JavaScript (document.querySelectorAll)
    js_pattern = r"querySelector(?:All)?\(['\"]\.reference[^'\"]*['\"]\)[^}]*backgroundColor\s*=\s*([^;]+);"
    for match in re.finditer(js_pattern, content):
        styles_found.append({
            'selector': 'JS: .reference (dynamic)',
            'styles': f'backgroundColor: {match.group(1).strip()}'
        })

    return styles_found

def analyze_background_color(styles_str):
    """Extract and analyze background color from CSS styles string"""
    # Look for background or background-color
    bg_match = re.search(r'background(?:-color)?:\s*([^;]+);', styles_str)
    if not bg_match:
        return None

    color = bg_match.group(1).strip()

    # Check if it's a pure gray or white
    is_neutral = check_if_neutral(color)

    return {
        'color': color,
        'is_neutral': is_neutral,
        'should_fix': not is_neutral
    }

def check_if_neutral(color):
    """Check if color is pure white, gray, or transparent"""
    color = color.lower().strip()

    if 'transparent' in color:
        return True

    if color in ['#fff', '#ffff', '#ffffff', 'white']:
        return True

    # For hex colors
    if color.startswith('#'):
        hex_color = color[1:]
        if len(hex_color) == 3:
            hex_color = ''.join([c*2 for c in hex_color])
        if len(hex_color) == 6:
            try:
                r = int(hex_color[0:2], 16)
                g = int(hex_color[2:4], 16)
                b = int(hex_color[4:6], 16)
                return r == g == b  # Pure gray
            except:
                return False

    # For rgb
    if color.startswith('rgb'):
        rgb_match = re.match(r'rgba?\((\d+),?\s*(\d+),?\s*(\d+)', color)
        if rgb_match:
            r, g, b = int(rgb_match.group(1)), int(rgb_match.group(2)), int(rgb_match.group(3))
            return r == g == b

    # For color variables or keywords, assume they might be colored
    return False

def main():
    """Analyze all templates"""
    template_dir = Path(__file__).parent
    html_files = sorted(template_dir.glob('*.html'))

    print("=" * 100)
    print("COMPREHENSIVE REFERENCE SECTION BACKGROUND CHECK")
    print("=" * 100)
    print()

    templates_to_fix = {}

    for html_file in html_files:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Skip if no reference section
        if 'reference' not in content.lower():
            continue

        styles = extract_all_reference_styles(content)
        if not styles:
            continue

        issues = []
        for style_block in styles:
            bg_info = analyze_background_color(style_block['styles'])
            if bg_info and bg_info['should_fix']:
                issues.append({
                    'selector': style_block['selector'],
                    'background': bg_info['color'],
                    'full_styles': style_block['styles']
                })

        if issues:
            templates_to_fix[html_file.name] = issues

    # Print results
    if not templates_to_fix:
        print("✓ All templates have neutral (white/gray) reference backgrounds!")
        return

    for filename, issues in sorted(templates_to_fix.items()):
        print(f"\n❌ {filename}")
        print(f"   Found {len(issues)} colored reference background(s):\n")

        for i, issue in enumerate(issues, 1):
            print(f"   {i}. Selector: {issue['selector']}")
            print(f"      Background: {issue['background']}")
            # Extract border if exists
            border_match = re.search(r'border(-left|-right)?:\s*([^;]+);', issue['full_styles'])
            if border_match:
                print(f"      Border: {border_match.group(2)}")
            print(f"      → Suggested fix: Change to #fff or #f5f5f5")
            print()

    print("=" * 100)
    print(f"SUMMARY: {len(templates_to_fix)} template(s) need fixing")
    print("=" * 100)

    print("\nTemplates to fix:")
    for filename in sorted(templates_to_fix.keys()):
        print(f"  - {filename}")

if __name__ == '__main__':
    main()
