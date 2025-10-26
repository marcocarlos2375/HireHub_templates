#!/usr/bin/env python3
"""
Find all templates with colored reference section backgrounds
"""

import re
from pathlib import Path

def analyze_reference_styling(filepath):
    """Analyze reference section styling in a template"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if template has references section
    if 'reference' not in content.lower():
        return None

    issues = []

    # Pattern 1: .reference-item with background color
    ref_item_pattern = r'\.reference-item\s*\{([^}]+)\}'
    matches = re.finditer(ref_item_pattern, content, re.DOTALL)

    for match in matches:
        styles = match.group(1)

        # Check for background color
        bg_match = re.search(r'background(-color)?:\s*([^;]+);', styles)
        if bg_match:
            bg_color = bg_match.group(2).strip()

            # Check if it's a colored background (not white, gray, or transparent)
            if not is_neutral_color(bg_color):
                # Get border if exists
                border_match = re.search(r'border(-left|-right|-top|-bottom)?:\s*([^;]+);', styles)
                border = border_match.group(2) if border_match else 'none'

                issues.append({
                    'type': 'reference-item background',
                    'current_bg': bg_color,
                    'border': border,
                    'full_match': match.group(0)
                })

    # Pattern 2: .reference with background
    ref_pattern = r'\.reference[^-\w][^{]*\{([^}]+)\}'
    matches = re.finditer(ref_pattern, content, re.DOTALL)

    for match in matches:
        styles = match.group(1)
        bg_match = re.search(r'background(-color)?:\s*([^;]+);', styles)
        if bg_match:
            bg_color = bg_match.group(2).strip()
            if not is_neutral_color(bg_color):
                border_match = re.search(r'border(-left|-right|-top|-bottom)?:\s*([^;]+);', styles)
                border = border_match.group(2) if border_match else 'none'

                issues.append({
                    'type': 'reference background',
                    'current_bg': bg_color,
                    'border': border,
                    'full_match': match.group(0)
                })

    return issues if issues else None

def is_neutral_color(color):
    """Check if color is white, gray, or transparent - STRICT version"""
    color = color.lower().strip()

    # Transparent
    if 'transparent' in color:
        return True

    # White variations (exact white only)
    white_colors = ['#fff', '#ffff', '#ffffff', 'white', 'rgb(255,255,255)', 'rgb(255, 255, 255)']
    if color in white_colors:
        return True

    # Gray variations - STRICT: only pure grays where R=G=B exactly
    if color.startswith('#'):
        # Remove #
        hex_color = color[1:]
        if len(hex_color) == 3:
            # Expand short form
            hex_color = ''.join([c*2 for c in hex_color])
        if len(hex_color) == 6:
            r = int(hex_color[0:2], 16)
            g = int(hex_color[2:4], 16)
            b = int(hex_color[4:6], 16)
            # STRICT: All values must be EXACTLY equal for gray
            if r == g == b:
                return True

    # RGB format - STRICT: R=G=B exactly
    if color.startswith('rgb'):
        rgb_match = re.match(r'rgba?\((\d+),?\s*(\d+),?\s*(\d+)', color)
        if rgb_match:
            r, g, b = int(rgb_match.group(1)), int(rgb_match.group(2)), int(rgb_match.group(3))
            if r == g == b:
                return True

    return False

def main():
    """Find all templates with colored reference sections"""
    template_dir = Path(__file__).parent
    html_files = sorted(template_dir.glob('*.html'))

    print("=" * 100)
    print("COLORED REFERENCE SECTIONS REPORT")
    print("=" * 100)
    print()

    templates_with_issues = {}

    for html_file in html_files:
        issues = analyze_reference_styling(html_file)
        if issues:
            templates_with_issues[html_file.name] = issues

    if not templates_with_issues:
        print("✓ No templates with colored reference backgrounds found!")
        return

    for filename, issues in sorted(templates_with_issues.items()):
        print(f"\n❌ {filename}")
        print(f"   Found {len(issues)} colored reference section(s):")

        for issue in issues:
            print(f"\n   Type: {issue['type']}")
            print(f"   Current background: {issue['current_bg']}")
            print(f"   Border: {issue['border']}")
            print(f"   Suggested: Change background to #fff or #f5f5f5 (keep border)")

    print("\n" + "=" * 100)
    print(f"SUMMARY: {len(templates_with_issues)} templates need reference section updates")
    print("=" * 100)

    # Save list of templates to fix
    with open(template_dir / 'reference_sections_to_fix.txt', 'w') as f:
        for filename in sorted(templates_with_issues.keys()):
            f.write(f"{filename}\n")

    print(f"\n✓ List saved to: reference_sections_to_fix.txt")

if __name__ == '__main__':
    main()
