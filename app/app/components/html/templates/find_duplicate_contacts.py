#!/usr/bin/env python3
"""
Find templates that display both old contact fields and websitesAndSocialLinks
causing duplicate information
"""

import re
from pathlib import Path

def analyze_contact_fields(filepath):
    """Analyze how a template displays contact information"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if no personal info
    if 'personalInfo' not in content and 'personal' not in content:
        return None

    issues = {
        'has_old_website': False,
        'has_old_socialLinks': False,
        'has_websitesAndSocialLinks': False,
        'old_website_lines': [],
        'old_socialLinks_lines': [],
        'websitesAndSocialLinks_lines': []
    }

    lines = content.split('\n')

    for i, line in enumerate(lines, 1):
        # Check for old website field
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
    """Find all templates with duplicate contact information"""
    template_dir = Path(__file__).parent
    html_files = sorted(template_dir.glob('*.html'))

    print("=" * 100)
    print("DUPLICATE CONTACT INFORMATION CHECK")
    print("=" * 100)
    print()

    templates_with_duplicates = {}

    for html_file in html_files:
        issues = analyze_contact_fields(html_file)
        if issues:
            templates_with_duplicates[html_file.name] = issues

    if not templates_with_duplicates:
        print("✓ No templates found with duplicate contact information!")
        return

    print("❌ TEMPLATES WITH DUPLICATE CONTACT INFORMATION")
    print("-" * 100)
    print()

    for filename, issues in sorted(templates_with_duplicates.items()):
        print(f"\n{filename}:")

        if issues['has_old_website']:
            print(f"  ✓ Displays personal.website (lines: {', '.join(map(str, issues['old_website_lines'][:3]))}...)")

        if issues['has_old_socialLinks']:
            print(f"  ✓ Displays personal.socialLinks.* (lines: {', '.join(map(str, issues['old_socialLinks_lines'][:3]))}...)")

        if issues['has_websitesAndSocialLinks']:
            print(f"  ✓ Displays personal.websitesAndSocialLinks (lines: {', '.join(map(str, issues['websitesAndSocialLinks_lines'][:3]))}...)")

        print(f"  ⚠️  RESULT: Potential duplicates (Website, LinkedIn, etc. may appear twice)")

    print("\n" + "=" * 100)
    print(f"SUMMARY: {len(templates_with_duplicates)} template(s) with potential duplicate contact info")
    print("=" * 100)

    print("\n📋 RECOMMENDATION:")
    print("-" * 100)
    print("Templates should use EITHER:")
    print("  Option A: Old fields (personal.website, personal.socialLinks.*)")
    print("  Option B: New field (personal.websitesAndSocialLinks)")
    print("But NOT both at the same time.")
    print()
    print("PREFERRED: Use websitesAndSocialLinks when it exists (more flexible)")
    print()

    print("Templates needing fixes:")
    for filename in sorted(templates_with_duplicates.keys()):
        print(f"  - {filename}")

if __name__ == '__main__':
    main()
