#!/usr/bin/env python3
"""
Fix remaining duplicate contact fields with various patterns
"""

import re
from pathlib import Path

def fix_array_pattern(content):
    """
    Fix pattern where website is in contacts array
    Example: { icon: websiteIcon, value: personal.website }
    """
    # Pattern: Remove the website line from contacts array
    pattern = r',?\s*\{\s*icon:\s*\w+Icon,\s*value:\s*personal\.website\s*\}'
    content = re.sub(pattern, '\n        // personal.website removed - using websitesAndSocialLinks below', content)

    return content

def fix_inline_pattern(content):
    """
    Fix inline displays of website/socialLinks
    """
    # Pattern: Direct assignment like: <p>Website: ${personal.website}</p>
    # or contactStr += personal.website

    # Remove inline website displays
    patterns = [
        # Template literals with website
        (r"<p[^>]*>.*?Website:.*?\$\{personal\.website\}.*?</p>", "<!-- Website moved to websitesAndSocialLinks -->"),

        # String concatenation with website
        (r"contactStr \+= .*?personal\.website.*?;", "// contactStr += personal.website; // Removed: duplicate"),

        # Direct website displays in HTML strings
        (r'html \+= .*?personal\.website.*?;', '// Website display removed - using websitesAndSocialLinks'),
    ]

    for pattern, replacement in patterns:
        content = re.sub(pattern, replacement, content, flags=re.DOTALL)

    return content

def fix_contact_section_pattern(content):
    """
    Fix templates that build contact sections with individual fields
    """

    # Pattern for personal.website in contact sections
    # Looking for lines that add website to display

    lines = content.split('\n')
    new_lines = []
    skip_next = 0

    for i, line in enumerate(lines):
        if skip_next > 0:
            skip_next -= 1
            continue

        # Check if line contains personal.website display code
        if 'personal.website' in line and ('html +=' in line or 'contactStr' in line or '<p>' in line):
            # Check if it's a conditional or direct display
            if i > 0 and 'if (personal.website)' in lines[i-1]:
                # Skip the if line too
                if new_lines and 'if (personal.website)' in new_lines[-1]:
                    new_lines.pop()
                new_lines.append('      // personal.website display removed - using websitesAndSocialLinks')
                # Skip closing brace if next line
                if i+1 < len(lines) and lines[i+1].strip() == '}':
                    skip_next = 1
                continue
            else:
                new_lines.append('      // ' + line + '  // Removed: duplicate')
                continue

        # Check for socialLinks display
        if 'personal.socialLinks' in line and ('html +=' in line or 'contactStr' in line):
            if i > 0 and 'if (personal.socialLinks' in lines[i-1]:
                if new_lines and 'if (personal.socialLinks' in new_lines[-1]:
                    new_lines.pop()
                new_lines.append('      // personal.socialLinks display removed - using websitesAndSocialLinks')
                if i+1 < len(lines) and lines[i+1].strip() == '}':
                    skip_next = 1
                continue
            else:
                new_lines.append('      // ' + line + '  // Removed: duplicate')
                continue

        new_lines.append(line)

    return '\n'.join(new_lines)

def process_template(filepath):
    """Process a single template"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Apply all fix patterns
    content = fix_array_pattern(content)
    content = fix_inline_pattern(content)
    # content = fix_contact_section_pattern(content)  # This one is risky, comment out for now

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True

    return False

def main():
    """Fix remaining templates"""
    template_dir = Path(__file__).parent

    # Remaining templates with duplicates
    templates = [
        # 'Aurora.html',  # Already fixed manually
        'Balance.html',
        'Beige.html',
        'BrightPath.html',
        'Clarity.html',
        'CleanGradient.html',
        'DiamondFlow.html',
        'ElegantWatermark.html',
        'Epure.html',
        'Focus.html',
        'ModernEdge.html',
        'Mono.html',
        'ProfessionalBlock.html',
        'Sapphire.html',
        'pastel.html',
    ]

    print("=" * 100)
    print("FIXING REMAINING DUPLICATE CONTACT FIELDS")
    print("=" * 100)
    print()

    fixed_count = 0

    for filename in templates:
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
                print(f"  {filename} (no automatic fixes)")

        except Exception as e:
            print(f"❌ Error with {filename}: {e}")

    print()
    print("=" * 100)
    print(f"Fixed {fixed_count} template(s) automatically")
    print("=" * 100)
    print()
    print("Some templates may need manual review.")
    print("Run find_duplicate_contacts.py to check remaining issues.")

if __name__ == '__main__':
    main()
