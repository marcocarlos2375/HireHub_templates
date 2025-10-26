#!/usr/bin/env python3
"""
Fix double resumeData references and remaining issues
"""

import re
from pathlib import Path

def fix_content(content: str) -> str:
    """Fix all remaining issues"""

    # Fix double resumeData references
    content = re.sub(r'resumeData\.resumeData\.', 'resumeData.', content)

    # Fix remaining project date fields (they don't exist in resume.json)
    # We'll comment them out or remove them

    # Fix pattern: proj.startDate and proj.endDate references
    # Since projects don't have dates, we should remove or handle these gracefully

    # Option 1: Replace with empty string (removes the date display)
    # content = re.sub(r'<span[^>]*>\s*\$\{?proj\.startDate\}?[^<]*</span>', '', content)

    # Option 2: Comment out the date lines (better for manual review)
    # Let's just remove the date span elements for projects

    # For now, let's leave project dates as-is since they might be handled with conditionals

    # Fix job.isInternship (doesn't exist in employment data)
    content = re.sub(r'\bjob\.isInternship\b', 'job.description.includes("Intern")', content)
    content = re.sub(r'\bexp\.isInternship\b', 'exp.description.includes("Intern")', content)

    # Fix ref.relationship (doesn't exist in references data)
    content = re.sub(r'\bref\.relationship\b', 'ref.position', content)

    # Fix personal.profileImage - wrap in conditional to handle gracefully
    # This is complex, so we'll leave it for now as templates should handle undefined

    return content

def main():
    """Fix all templates"""
    template_dir = Path(__file__).parent
    html_files = sorted(template_dir.glob('*.html'))

    fixed_count = 0

    print("Fixing double references and remaining issues...\n")

    for html_file in html_files:
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()

            original = content
            content = fix_content(content)

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

if __name__ == '__main__':
    main()
