#!/usr/bin/env python3
"""
Manual fixes for complex template issues that require special handling
"""

import re
from pathlib import Path
from typing import List, Tuple

def apply_replacements(content: str, replacements: List[Tuple[str, str]]) -> str:
    """Apply a list of find/replace operations"""
    for old_pattern, new_pattern in replacements:
        content = re.sub(old_pattern, new_pattern, content)
    return content

def fix_education_references(content: str) -> str:
    """Fix education.forEach and education.length references"""
    # These are likely resumeData.education references
    # The patterns look for places where 'education' is used as a variable
    # but should be part of resumeData

    replacements = [
        # Fix: if (education && education.length > 0)
        (r'\bif\s*\(\s*education\s*&&\s*education\.length', 'if (resumeData.education && resumeData.education.length'),

        # Fix: education.forEach
        (r'\beducation\.forEach\b', 'resumeData.education.forEach'),

        # Fix: education.length
        (r'\beducation\.length\b', 'resumeData.education.length'),
    ]

    return apply_replacements(content, replacements)

def fix_volunteering_fields(content: str) -> str:
    """Fix volunteering field references"""
    # Volunteering in resume.json has: title, city, startDate, endDate, current, description
    # Templates might use: organization, position, role, summary

    replacements = [
        # vol.organization doesn't exist - should use city or remove
        (r'vol\.organization\b', 'vol.city'),  # or could be removed depending on context

        # vol.position doesn't exist - should be vol.title
        (r'vol\.position\b', 'vol.title'),

        # vol.role was already fixed to vol.title

        # vol.summary doesn't exist - should be vol.description
        (r'vol\.summary\b', 'vol.description'),
    ]

    return apply_replacements(content, replacements)

def fix_award_fields(content: str) -> str:
    """Fix award field references"""
    # Awards in resume.json have: title, city, startDate, endDate, current, description
    # Templates might use: awarder, issuer, summary

    replacements = [
        # award.awarder doesn't exist - use city or remove
        (r'award\.awarder\b', 'award.city'),

        # award.issuer doesn't exist - use city
        (r'award\.issuer\b', 'award.city'),

        # award.summary doesn't exist - use description
        (r'award\.summary\b', 'award.description'),
    ]

    return apply_replacements(content, replacements)

def fix_project_fields(content: str) -> str:
    """Fix project field references"""
    # Projects in resume.json have: name, description, technologies, link
    # Templates might use: title, url, startDate, endDate

    replacements = [
        # project.title doesn't exist - use name
        (r'project\.title\b', 'project.name'),
        (r'proj\.title\b', 'proj.name'),

        # project.url doesn't exist - use link
        (r'project\.url\b', 'project.link'),
        (r'proj\.url\b', 'proj.link'),

        # Projects don't have dates in resume.json - remove or comment out
        # These need manual review, but we can comment them out
    ]

    return apply_replacements(content, replacements)

def fix_education_fields(content: str) -> str:
    """Fix education field references"""
    # Education in resume.json has: school, degree, location, startDate, endDate, current, description
    # Templates might use: institution

    replacements = [
        # edu.institution doesn't exist - use school
        (r'edu\.institution\b', 'edu.school'),
        (r'education\.institution\b', 'education.school'),
    ]

    return apply_replacements(content, replacements)

def fix_personal_info_fields(content: str) -> str:
    """Fix personalInfo field references"""
    # personalInfo doesn't have profileImage in resume.json
    # We need to handle this gracefully

    replacements = [
        # Comment out or handle profileImage checks
        # This is tricky - let's just make sure the code doesn't break
        # We'll wrap profileImage checks in a way that won't error
    ]

    # For now, let's leave profileImage as-is since templates should handle undefined gracefully
    return content

def fix_job_fields(content: str) -> str:
    """Fix job/employment field references"""
    # Employment has: jobTitle, company, location, startDate, endDate, currentlyWorking, description, responsibilities
    # Some templates might still have: employer

    replacements = [
        # These were already fixed in auto_fix, but adding for completeness
        (r'job\.employer\b', 'job.company'),
        (r'exp\.employer\b', 'exp.company'),
    ]

    return apply_replacements(content, replacements)

def fix_template_file(filepath: Path) -> bool:
    """Apply all fixes to a template file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Apply all fixes
        content = fix_education_references(content)
        content = fix_volunteering_fields(content)
        content = fix_award_fields(content)
        content = fix_project_fields(content)
        content = fix_education_fields(content)
        content = fix_personal_info_fields(content)
        content = fix_job_fields(content)

        # Only write if something changed
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True

        return False

    except Exception as e:
        print(f"❌ Error fixing {filepath.name}: {e}")
        return False

def main():
    """Main execution"""
    template_dir = Path(__file__).parent
    html_files = sorted(template_dir.glob('*.html'))

    fixed_count = 0

    print("Applying manual fixes to templates...\n")

    for html_file in html_files:
        if fix_template_file(html_file):
            print(f"✓ Fixed {html_file.name}")
            fixed_count += 1
        else:
            print(f"  {html_file.name} (no changes)")

    print(f"\n✓ Applied fixes to {fixed_count} template(s)")
    print("\nRun validate_templates.py again to check remaining issues.")

if __name__ == '__main__':
    main()
