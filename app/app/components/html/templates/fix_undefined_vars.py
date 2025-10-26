#!/usr/bin/env python3
"""
Fix all undefined variables found by deep_validator
"""

import re
from pathlib import Path

def fix_template(content: str) -> str:
    """Fix all undefined variable references"""

    # CRITICAL FIX: link.platform → link.label
    # This is causing "undefined: https://www.carlossaez.dev" to display
    content = re.sub(r'\blink\.platform\b', 'link.label', content)

    # Fix project date fields (they don't exist in resume.json)
    # Option 1: Remove the date display entirely
    # Option 2: Comment out the date references

    # For now, we'll remove project date references from display
    # This regex finds and removes date spans in project sections
    # Pattern: finds text like "(proj.startDate) - (proj.endDate)" and replaces with empty

    # Remove project date displays in various formats
    content = re.sub(r'\s*-?\s*\$\{proj\.startDate\}\s*[-–]\s*\$\{proj\.endDate\}', '', content)
    content = re.sub(r'\s*-?\s*\$\{project\.startDate\}\s*[-–]\s*\$\{project\.endDate\}', '', content)

    # Remove standalone date references
    content = re.sub(r'\s*\|\s*\$\{proj\.startDate\}\s*[-–]\s*\$\{proj\.endDate\}', '', content)
    content = re.sub(r'\s*\|\s*\$\{project\.startDate\}\s*[-–]\s*\$\{project\.endDate\}', '', content)

    # Handle property access versions (not in template strings)
    # For lines that check or use project dates
    content = re.sub(
        r'const\s+dateStr\s*=\s*.*?(proj|project)\.(startDate|endDate).*?;',
        '// Project dates not available in resume.json',
        content
    )

    # Fix personal.profileImage - these are usually in conditional checks so they're OK
    # But we should ensure they don't break. They're typically like:
    # if (personal.profileImage) { ... }
    # These are fine and handle the undefined gracefully

    return content

def main():
    """Fix all templates"""
    template_dir = Path(__file__).parent

    # Templates with undefined variables (from deep_validator report)
    templates_to_fix = [
        'Aurora.html',
        'Clarity.html',
        'DiamondFlow.html',
        'Epure.html',
        'Focus.html',
        'Gradiento.html',
        'Midnight.html',
        'ModernEdge.html',
        'Mono.html',
        'ProfessionalBlock.html',
        'Sapphire.html',
        'modern.html',
        'pastel.html',
    ]

    fixed_count = 0

    print("Fixing undefined variables...\n")

    for filename in templates_to_fix:
        filepath = template_dir / filename

        if not filepath.exists():
            print(f"❌ Not found: {filename}")
            continue

        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            original = content
            content = fix_template(content)

            if content != original:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"✓ Fixed {filename}")
                fixed_count += 1
            else:
                print(f"  {filename} (no changes)")

        except Exception as e:
            print(f"❌ Error with {filename}: {e}")

    print(f"\n✓ Fixed {fixed_count} template(s)")
    print("\nRun deep_validator.py again to verify all fixes.")

if __name__ == '__main__':
    main()
