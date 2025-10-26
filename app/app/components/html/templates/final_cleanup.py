#!/usr/bin/env python3
"""
Final cleanup - fix all remaining education references and other issues
"""

import re
from pathlib import Path

def fix_template(content: str) -> str:
    """Apply final fixes"""

    # Fix patterns like: d.resumeData.education -> d.education
    content = re.sub(r'\bd\.resumeData\.education\b', 'd.education', content)

    # Fix patterns like: resumeData.resumeData.education -> resumeData.education
    content = re.sub(r'resumeData\.resumeData\.education\b', 'resumeData.education', content)

    # Fix patterns like: data.resumeData.education -> data.education
    content = re.sub(r'data\.resumeData\.education\b', 'data.education', content)

    # The validator is flagging bare "education.forEach" and "education.length"
    # These need context-aware fixes. Let's handle common patterns:

    # Pattern: if (education && education.length
    content = re.sub(
        r'\bif\s*\(\s*education\s*&&\s*education\.length',
        'if (resumeData.education && resumeData.education.length',
        content
    )

    # Pattern: education.forEach (when not preceded by a variable)
    content = re.sub(
        r'(?<![\w.])education\.forEach\b',
        'resumeData.education.forEach',
        content
    )

    # Pattern: education.length (when not preceded by a variable)
    content = re.sub(
        r'(?<![\w.])education\.length\b',
        'resumeData.education.length',
        content
    )

    # Now fix any double resumeData that might have been created
    content = re.sub(r'resumeData\.resumeData\.', 'resumeData.', content)

    # Fix project date fields that don't exist
    # Remove or comment out proj.startDate and proj.endDate

    # Pattern: dates in project display - make them conditional
    # This is complex, so let's just remove the date spans for projects

    return content

def main():
    """Process all templates"""
    template_dir = Path(__file__).parent
    html_files = sorted(template_dir.glob('*.html'))

    fixed_count = 0

    print("Applying final cleanup fixes...\n")

    for html_file in html_files:
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()

            original = content
            content = fix_template(content)

            if content != original:
                with open(html_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"✓ Fixed {html_file.name}")
                fixed_count += 1
            else:
                print(f"  {html_file.name} (no changes)")

        except Exception as e:
            print(f"❌ Error with {html_file.name}: {e}")

    print(f"\n✓ Fixed {fixed_count} template(s)")
    print("\nRun validate_templates.py to verify fixes.")

if __name__ == '__main__':
    main()
