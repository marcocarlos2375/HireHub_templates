#!/usr/bin/env python3
"""
Validate that all templates handle all fields from resume.json
Checks for:
1. Missing fields (in resume.json but not in template)
2. Undefined fields (in template but not in resume.json)
"""

import json
import re
from pathlib import Path
from collections import defaultdict

def extract_all_json_paths(obj, prefix=''):
    """Extract all possible field paths from JSON structure"""
    paths = set()

    if isinstance(obj, dict):
        for key, value in obj.items():
            current_path = f"{prefix}.{key}" if prefix else key
            paths.add(current_path)

            # Recursively extract nested paths
            if isinstance(value, (dict, list)):
                paths.update(extract_all_json_paths(value, current_path))

    elif isinstance(obj, list) and obj:
        # For arrays, analyze the first item to get structure
        if isinstance(obj[0], dict):
            for key in obj[0].keys():
                current_path = f"{prefix}.{key}" if prefix else key
                paths.add(current_path)

                # Recursively extract nested paths
                if isinstance(obj[0][key], (dict, list)):
                    paths.update(extract_all_json_paths(obj[0][key], current_path))

    return paths

def get_resume_fields():
    """Load resume.json and extract all field paths"""
    resume_path = Path(__file__).parent / 'resume.json'

    with open(resume_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Extract from content
    if 'content' in data:
        fields = extract_all_json_paths(data['content'])
    else:
        fields = extract_all_json_paths(data)

    return fields

def find_field_references(content):
    """Find all resumeData field references in template"""
    # JavaScript methods to exclude
    js_methods = {'forEach', 'map', 'filter', 'reduce', 'length', 'push', 'pop', 'shift', 'unshift',
                  'slice', 'splice', 'charAt', 'charCodeAt', 'indexOf', 'lastIndexOf', 'substring',
                  'toUpperCase', 'toLowerCase', 'trim', 'split', 'join', 'replace', 'match',
                  'toLocaleDateString', 'toLocaleString', 'getMonth', 'getFullYear', 'getDate'}

    # Patterns to match
    patterns = [
        # resumeData.field or personal.field
        r'(?:resumeData|personal|data\.content)\.(\w+(?:\.\w+)*)',
    ]

    found_fields = set()

    for pattern in patterns:
        matches = re.finditer(pattern, content)
        for match in matches:
            field_path = match.group(1)

            # Skip if it's a JavaScript method
            parts = field_path.split('.')
            if any(part in js_methods for part in parts):
                continue

            # Handle nested paths
            found_fields.add(field_path)

            # Also add parent paths
            for i in range(1, len(parts)):
                parent_path = '.'.join(parts[:i])
                if parent_path not in js_methods:
                    found_fields.add(parent_path)

    return found_fields

def analyze_template(filepath, resume_fields):
    """Analyze a single template for field coverage"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find fields referenced in template
    template_fields = find_field_references(content)

    # Normalize personalInfo references
    # When template uses personal.X, that's actually personalInfo.X
    normalized_template_fields = set()
    for field in template_fields:
        if not field.startswith('personalInfo'):
            # Assume it might be under personalInfo
            normalized_template_fields.add(field)
            normalized_template_fields.add(f'personalInfo.{field}')
        else:
            normalized_template_fields.add(field)

    # Find missing fields (in resume but not in template)
    missing_fields = set()
    for resume_field in resume_fields:
        # Check if field or any parent is referenced
        field_parts = resume_field.split('.')
        found = False

        for i in range(len(field_parts), 0, -1):
            partial_path = '.'.join(field_parts[:i])
            if partial_path in normalized_template_fields:
                found = True
                break

        if not found:
            # Special handling for personalInfo
            if resume_field.startswith('personalInfo.'):
                short_field = resume_field.replace('personalInfo.', '')
                if short_field in template_fields:
                    found = True

        if not found:
            missing_fields.add(resume_field)

    # Find undefined fields (in template but not in resume)
    undefined_fields = set()
    for template_field in template_fields:
        # Check against resume fields
        found = False

        # Direct match
        if template_field in resume_fields:
            found = True

        # Check with personalInfo prefix
        if f'personalInfo.{template_field}' in resume_fields:
            found = True

        # Check if it's a parent of any resume field
        for resume_field in resume_fields:
            if resume_field.startswith(template_field + '.'):
                found = True
                break

        if not found and template_field not in ['content', 'personalInfo', 'resumeData']:
            undefined_fields.add(template_field)

    return {
        'template_fields': template_fields,
        'missing_fields': missing_fields,
        'undefined_fields': undefined_fields
    }

def main():
    template_dir = Path(__file__).parent

    print("=" * 100)
    print("TEMPLATE COMPLETENESS VALIDATION")
    print("=" * 100)
    print()

    # Load resume fields
    print("Loading resume.json structure...")
    resume_fields = get_resume_fields()
    print(f"Found {len(resume_fields)} fields in resume.json")
    print()

    # Get all HTML templates
    templates = sorted(template_dir.glob('*.html'))

    issues_found = 0
    all_results = {}

    for template_path in templates:
        print(f"\n{'=' * 100}")
        print(f"ANALYZING: {template_path.name}")
        print('=' * 100)

        results = analyze_template(template_path, resume_fields)
        all_results[template_path.name] = results

        has_issues = False

        # Report missing fields
        if results['missing_fields']:
            has_issues = True
            issues_found += 1
            print(f"\n❌ MISSING FIELDS ({len(results['missing_fields'])} fields not handled):")
            print("-" * 100)
            for field in sorted(results['missing_fields']):
                print(f"  • {field}")

        # Report undefined fields
        if results['undefined_fields']:
            has_issues = True
            print(f"\n⚠️  UNDEFINED FIELDS ({len(results['undefined_fields'])} fields referenced but not in resume.json):")
            print("-" * 100)
            for field in sorted(results['undefined_fields']):
                print(f"  • {field}")

        if not has_issues:
            print("\n✓ Template appears complete (all major fields handled)")

    # Summary
    print("\n\n" + "=" * 100)
    print("SUMMARY")
    print("=" * 100)

    templates_with_missing = sum(1 for r in all_results.values() if r['missing_fields'])
    templates_with_undefined = sum(1 for r in all_results.values() if r['undefined_fields'])

    print(f"\nTotal templates analyzed: {len(all_results)}")
    print(f"Templates with missing fields: {templates_with_missing}")
    print(f"Templates with undefined fields: {templates_with_undefined}")

    # Show most commonly missing fields
    missing_count = defaultdict(int)
    for results in all_results.values():
        for field in results['missing_fields']:
            missing_count[field] += 1

    if missing_count:
        print(f"\n\nMOST COMMONLY MISSING FIELDS:")
        print("-" * 100)
        for field, count in sorted(missing_count.items(), key=lambda x: -x[1])[:20]:
            print(f"  {field:50} (missing in {count} templates)")

    print()
    print("=" * 100)
    print("RECOMMENDATION: Review templates with missing fields to ensure all resume data is displayed")
    print("=" * 100)

if __name__ == '__main__':
    main()
