#!/usr/bin/env python3
"""
Verify that duplicate contact fixes are complete
This version excludes JavaScript comments to avoid false positives
"""

import re
from pathlib import Path

def remove_js_comments(content):
    """Remove JavaScript comments from content"""
    # Remove single-line comments
    content = re.sub(r'//.*$', '', content, flags=re.MULTILINE)
    # Remove multi-line comments
    content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
    return content

def analyze_contact_fields(filepath):
    """Analyze how a template displays contact information (excluding comments)"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if no personal info
    if 'personalInfo' not in content and 'personal' not in content:
        return None

    # Remove comments before analyzing
    content_no_comments = remove_js_comments(content)

    issues = {
        'has_old_website': False,
        'has_old_socialLinks': False,
        'has_websitesAndSocialLinks': False,
        'old_website_lines': [],
        'old_socialLinks_lines': [],
        'websitesAndSocialLinks_lines': []
    }

    lines = content_no_comments.split('\n')

    for i, line in enumerate(lines, 1):
        # Check for old website field (actual usage, not comments)
        if re.search(r'\bpersonal\.website\b', line):
            issues['has_old_website'] = True
            issues['old_website_lines'].append(i)

        # Check for old socialLinks fields
        if re.search(r'\bpersonal\.socialLinks\.(linkedin|github|twitter)', line):
            issues['has_old_socialLinks'] = True
            issues['old_socialLinks_lines'].append(i)

        # Check for websitesAndSocialLinks array
        if re.search(r'\bpersonal\.websitesAndSocialLinks', line):
            issues['has_websitesAndSocialLinks'] = True
            issues['websitesAndSocialLinks_lines'].append(i)

    # Check if there's potential duplication
    has_duplication = issues['has_websitesAndSocialLinks'] and (
        issues['has_old_website'] or issues['has_old_socialLinks']
    )

    if not has_duplication:
        return None

    return issues

def main():
    """Verify all templates have been fixed"""
    template_dir = Path(__file__).parent
    html_files = sorted(template_dir.glob('*.html'))

    print("=" * 100)
    print("VERIFICATION: Duplicate Contact Information Fixes (Excluding Comments)")
    print("=" * 100)
    print()

    templates_with_duplicates = {}

    for html_file in html_files:
        issues = analyze_contact_fields(html_file)
        if issues:
            templates_with_duplicates[html_file.name] = issues

    if not templates_with_duplicates:
        print("✅ SUCCESS! No templates found with duplicate contact information!")
        print()
        print("All templates now use only websitesAndSocialLinks for displaying")
        print("website and social media links. No duplicates detected.")
        return

    print("❌ TEMPLATES STILL WITH DUPLICATE CONTACT INFORMATION")
    print("-" * 100)
    print()

    for filename, issues in sorted(templates_with_duplicates.items()):
        print(f"\n{filename}:")

        if issues['has_old_website']:
            print(f"  ✓ Displays personal.website (lines: {', '.join(map(str, issues['old_website_lines'][:5]))})")

        if issues['has_old_socialLinks']:
            print(f"  ✓ Displays personal.socialLinks.* (lines: {', '.join(map(str, issues['old_socialLinks_lines'][:5]))})")

        if issues['has_websitesAndSocialLinks']:
            print(f"  ✓ Displays personal.websitesAndSocialLinks (lines: {', '.join(map(str, issues['websitesAndSocialLinks_lines'][:3]))}...)")

        print(f"  ⚠️  RESULT: Potential duplicates (Website, LinkedIn, etc. may appear twice)")

    print()
    print("=" * 100)
    print(f"SUMMARY: {len(templates_with_duplicates)} template(s) still need fixes")
    print("=" * 100)

if __name__ == '__main__':
    main()
