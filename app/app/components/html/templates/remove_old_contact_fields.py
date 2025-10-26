#!/usr/bin/env python3
"""
Remove old contact field displays (personal.website, personal.socialLinks.*)
to prevent duplicates with websitesAndSocialLinks
"""

import re
from pathlib import Path

def remove_old_contact_displays(content):
    """Remove old website and socialLinks display code"""

    # Pattern 1: Remove if (personal.website) { html += ... } blocks
    # This matches the entire if block for website
    pattern1 = r'\s+if \(personal\.website\) \{[^}]*?html \+= `[^`]*?personal\.website[^`]*?`;[^}]*?\}\s*'
    content = re.sub(pattern1, '\n\n      // Old website field removed - using websitesAndSocialLinks\n\n', content, flags=re.DOTALL)

    # Pattern 2: Remove if (personal.socialLinks && personal.socialLinks.linkedin) blocks
    pattern2 = r'\s+if \(personal\.socialLinks && personal\.socialLinks\.linkedin\) \{[^}]*?html \+= `[^`]*?socialLinks\.linkedin[^`]*?`;[^}]*?\}\s*'
    content = re.sub(pattern2, '', content, flags=re.DOTALL)

    # Pattern 3: Remove if (personal.socialLinks && personal.socialLinks.github) blocks
    pattern3 = r'\s+if \(personal\.socialLinks && personal\.socialLinks\.github\) \{[^}]*?html \+= `[^`]*?socialLinks\.github[^`]*?`;[^}]*?\}\s*'
    content = re.sub(pattern3, '', content, flags=re.DOTALL)

    # Pattern 4: Remove if (personal.socialLinks && personal.socialLinks.twitter) blocks
    pattern4 = r'\s+if \(personal\.socialLinks && personal\.socialLinks\.twitter\) \{[^}]*?html \+= `[^`]*?socialLinks\.twitter[^`]*?`;[^}]*?\}\s*'
    content = re.sub(pattern4, '', content, flags=re.DOTALL)

    # Pattern 5: Remove if (personal.socialLinks?.linkedin) blocks (optional chaining)
    pattern5 = r'\s+if \(personal\.socialLinks\?\.linkedin\) \{[^}]*?socialLinks\.linkedin[^}]*?\}\s*'
    content = re.sub(pattern5, '', content, flags=re.DOTALL)

    # Pattern 6: Handle inline displays like personal.website in template
    # Look for standalone website references in contact sections
    pattern6 = r'<p[^>]*>\s*<strong>Website:</strong>.*?\$\{personal\.website[^<]*</p>'
    content = re.sub(pattern6, '<!-- Website moved to websitesAndSocialLinks -->', content)

    return content

def process_template(filepath):
    """Process a single template file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Remove old contact displays
    content = remove_old_contact_displays(content)

    # Only write if changed
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True

    return False

def main():
    """Fix all templates"""
    template_dir = Path(__file__).parent

    # All templates with duplicates (excluding BlueAccent which we already fixed manually)
    templates_to_fix = [
        'Aurora.html',
        'Balance.html',
        'Beige.html',
        # 'BlueAccent.html',  # Already fixed manually
        'BrightPath.html',
        'Clarity.html',
        'CleanGradient.html',
        'DiamondFlow.html',
        'Elegance.html',
        'ElegantWatermark.html',
        'Epure.html',
        'Focus.html',
        'GradientSidebar.html',
        'Gridline.html',
        'Midnight.html',
        'MidnightBlue.html',
        'MinimalistFlow.html',
        'ModernEdge.html',
        'Mono.html',
        'ProfessionalBlock.html',
        'Sapphire.html',
        'modern.html',
        'pastel.html',
    ]

    print("=" * 100)
    print("REMOVING OLD CONTACT FIELD DISPLAYS")
    print("=" * 100)
    print()
    print("Removing duplicate displays of:")
    print("  - personal.website")
    print("  - personal.socialLinks.linkedin")
    print("  - personal.socialLinks.github")
    print("  - personal.socialLinks.twitter")
    print()
    print("Keeping: websitesAndSocialLinks (single source of truth)")
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
                print(f"  {filename} (no changes)")

        except Exception as e:
            print(f"❌ Error with {filename}: {e}")

    print()
    print("=" * 100)
    print(f"SUMMARY: Fixed {fixed_count} template(s)")
    print("=" * 100)
    print()
    print("Run find_duplicate_contacts.py to verify no duplicates remain.")

if __name__ == '__main__':
    main()
