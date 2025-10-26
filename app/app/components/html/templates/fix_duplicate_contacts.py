#!/usr/bin/env python3
"""
Fix duplicate contact information by removing old field displays
(personal.website, personal.socialLinks.*) when websitesAndSocialLinks exists
"""

import re
from pathlib import Path

def fix_template_duplicates(content, filename):
    """
    Remove duplicate contact field displays
    Strategy: Comment out old website/socialLinks display code
    """

    # Pattern 1: Lines that display personal.website
    # Match lines like: html += `<p>...${personal.website}...`
    # or: <p>Website: ${personal.website}</p>

    # Find sections that display website
    website_patterns = [
        # HTML template strings with personal.website
        (r'(\s+)(html \+= `[^`]*?\$\{personal\.website[^`]*?`;)', r'\1// \2  // Removed: duplicate of websitesAndSocialLinks'),
        # Direct HTML with personal.website
        (r'(\s+)(<p[^>]*>.*?personal\.website.*?</p>)', r'\1<!-- \2 Removed: duplicate -->'),
    ]

    # Pattern 2: Lines that display personal.socialLinks
    sociallinks_patterns = [
        # HTML template strings with socialLinks
        (r'(\s+)(html \+= `[^`]*?\$\{personal\.socialLinks\.[^`]*?`;)', r'\1// \2  // Removed: duplicate of websitesAndSocialLinks'),
    ]

    # Track if we made changes
    original = content

    # Apply website pattern fixes
    for pattern, replacement in website_patterns:
        content = re.sub(pattern, replacement, content, flags=re.MULTILINE)

    # Apply socialLinks pattern fixes
    for pattern, replacement in sociallinks_patterns:
        content = re.sub(pattern, replacement, content, flags=re.MULTILINE)

    # Additional manual patterns for specific templates
    # These handle multi-line constructs

    # Pattern: if (personal.website) { html += `...` }
    if_website_pattern = r'(\s+)(if \(personal\.website\) \{[^\}]*?html \+= `[^`]*?personal\.website[^`]*?`;[^\}]*?\})'
    content = re.sub(if_website_pattern, r'\1// \2  // Removed: duplicate of websitesAndSocialLinks', content, flags=re.DOTALL)

    # Pattern: if (personal.socialLinks && personal.socialLinks.linkedin) { ... }
    if_sociallinks_pattern = r'(\s+)(if \(personal\.socialLinks.*?\{[^\}]*?personal\.socialLinks\.[^;]*?;[^\}]*?\})'
    content = re.sub(if_sociallinks_pattern, r'\1// \2  // Removed: duplicate of websitesAndSocialLinks', content, flags=re.DOTALL)

    return content != original, content

def main():
    """Fix all templates with duplicate contact information"""
    template_dir = Path(__file__).parent

    # Templates identified as having duplicates
    templates_to_fix = [
        'Aurora.html',
        'Balance.html',
        'Beige.html',
        'BlueAccent.html',
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
    print("FIXING DUPLICATE CONTACT INFORMATION")
    print("=" * 100)
    print()
    print("Strategy: Comment out old contact field displays")
    print("  - Removing: personal.website display code")
    print("  - Removing: personal.socialLinks.* display code")
    print("  - Keeping: websitesAndSocialLinks (single source of truth)")
    print()

    fixed_count = 0

    for filename in templates_to_fix:
        filepath = template_dir / filename

        if not filepath.exists():
            print(f"❌ Not found: {filename}")
            continue

        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            was_fixed, new_content = fix_template_duplicates(content, filename)

            if was_fixed:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"✓ Fixed {filename}")
                fixed_count += 1
            else:
                print(f"  {filename} (no automatic fixes applied - may need manual review)")

        except Exception as e:
            print(f"❌ Error with {filename}: {e}")

    print()
    print("=" * 100)
    print(f"SUMMARY: Fixed {fixed_count} template(s)")
    print("=" * 100)
    print()
    print("⚠️  IMPORTANT: Some templates may need manual review")
    print("   The script comments out simple patterns, but complex multi-line")
    print("   constructs may need manual fixes.")
    print()
    print("Run find_duplicate_contacts.py to verify remaining issues.")

if __name__ == '__main__':
    main()
