#!/usr/bin/env python3
"""
Template Validator - Validates HTML templates against resume.json structure
Focuses on actual data field references, ignoring DOM/JavaScript properties
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Set, Tuple
from collections import defaultdict

class TemplateValidator:
    def __init__(self, json_path: str):
        """Initialize with resume.json path"""
        self.json_path = Path(json_path)
        self.json_data = {}
        self.field_mappings = {}
        self.load_json_structure()

    def load_json_structure(self):
        """Load resume.json and build field maps"""
        with open(self.json_path, 'r', encoding='utf-8') as f:
            self.json_data = json.load(f)

        # Map resume.json actual fields
        content = self.json_data.get('content', {})

        # Build mappings for common variable names used in templates
        self.field_mappings = {
            # personalInfo fields
            'personalInfo': self._get_fields(content.get('personalInfo', {})),
            # employmentHistory fields
            'employment': self._get_fields(content.get('employmentHistory', [{}])[0]) if content.get('employmentHistory') else {},
            # education fields
            'education': self._get_fields(content.get('education', [{}])[0]) if content.get('education') else {},
            # skills fields
            'skills': self._get_fields(content.get('skills', [{}])[0]) if content.get('skills') else {},
            # languages fields
            'languages': self._get_fields(content.get('languages', [{}])[0]) if content.get('languages') else {},
            # projects fields
            'projects': self._get_fields(content.get('projects', [{}])[0]) if content.get('projects') else {},
            # publications fields
            'publications': self._get_fields(content.get('publications', [{}])[0]) if content.get('publications') else {},
            # courses fields
            'courses': self._get_fields(content.get('courses', [{}])[0]) if content.get('courses') else {},
            # references fields
            'references': self._get_fields(content.get('references', [{}])[0]) if content.get('references') else {},
            # awards fields
            'awards': self._get_fields(content.get('customSections', {}).get('awards', [{}])[0]) if content.get('customSections', {}).get('awards') else {},
            # volunteering fields
            'volunteering': self._get_fields(content.get('customSections', {}).get('volunteering', [{}])[0]) if content.get('customSections', {}).get('volunteering') else {},
        }

        print(f"✓ Loaded resume.json structure\n")

    def _get_fields(self, obj: dict) -> Set[str]:
        """Extract field names from object"""
        if isinstance(obj, dict):
            fields = set(obj.keys())
            # Handle nested objects
            for key, value in obj.items():
                if isinstance(value, dict):
                    fields.update(f"{key}.{k}" for k in value.keys())
            return fields
        return set()

    def find_data_references(self, html_content: str) -> List[Tuple[str, str, int]]:
        """
        Find data field references in templates
        Returns list of (variable_name, field, line_number)
        """
        references = []

        # Patterns for common template variable usage
        # Match: personal.fieldName, job.fieldName, edu.fieldName, etc.
        patterns = {
            'personalInfo': [r'\bpersonal\.(\w+)', r'\bpersonalInfo\.(\w+)', r'\bdata\.personalInfo\.(\w+)'],
            'employment': [r'\bjob\.(\w+)', r'\bexp\.(\w+)', r'\bemployment\.(\w+)'],
            'education': [r'\bedu\.(\w+)', r'\beducation\.(\w+)'],
            'skills': [r'\bskill\.(\w+)'],
            'languages': [r'\blang\.(\w+)', r'\blanguage\.(\w+)'],
            'projects': [r'\bproj\.(\w+)', r'\bproject\.(\w+)'],
            'publications': [r'\bpub\.(\w+)', r'\bpublication\.(\w+)'],
            'courses': [r'\bcourse\.(\w+)'],
            'references': [r'\bref\.(\w+)', r'\breference\.(\w+)'],
            'awards': [r'\baward\.(\w+)'],
            'volunteering': [r'\bvol\.(\w+)', r'\bvolunteer\.(\w+)'],
        }

        lines = html_content.split('\n')
        for line_num, line in enumerate(lines, 1):
            # Skip HTML comments
            if '<!--' in line or '-->' in line:
                continue

            for category, pattern_list in patterns.items():
                for pattern in pattern_list:
                    matches = re.finditer(pattern, line)
                    for match in matches:
                        field = match.group(1)

                        # Skip JavaScript built-in methods and properties
                        js_builtins = {
                            'forEach', 'map', 'filter', 'reduce', 'find', 'findIndex',
                            'some', 'every', 'includes', 'indexOf', 'length', 'push',
                            'pop', 'shift', 'unshift', 'slice', 'splice', 'join',
                            'concat', 'toString', 'valueOf', 'hasOwnProperty'
                        }

                        if field in js_builtins:
                            continue

                        var_name = match.group(0).split('.')[0]
                        references.append((var_name, field, line_num, category))

        return references

    def validate_field(self, field: str, category: str) -> Tuple[bool, List[str]]:
        """
        Check if field exists in the category
        Returns (is_valid, suggestions)
        """
        valid_fields = self.field_mappings.get(category, set())

        # Check exact match
        if field in valid_fields:
            return True, []

        # Find suggestions
        suggestions = []

        # Common field name mappings
        field_aliases = {
            'name': ['firstName', 'lastName', 'skill', 'language', 'title'],
            'title': ['jobTitle', 'degree'],
            'employer': ['company'],
            'proficiency': ['level'],
            'date': ['startDate', 'endDate', 'publicationDate', 'completionDate'],
            'organization': ['company', 'institution', 'school'],
            'role': ['jobTitle', 'title'],
        }

        # Try aliases
        if field in field_aliases:
            for alias in field_aliases[field]:
                if alias in valid_fields:
                    suggestions.append(alias)

        # Try case-insensitive match
        field_lower = field.lower()
        for valid_field in valid_fields:
            if valid_field.lower() == field_lower:
                suggestions.append(valid_field)
            elif field_lower in valid_field.lower() or valid_field.lower() in field_lower:
                suggestions.append(valid_field)

        return False, list(set(suggestions))[:3]

    def validate_template(self, template_path: str) -> Dict:
        """Validate a single template file"""
        path = Path(template_path)

        if not path.exists():
            return {'error': f'File not found: {template_path}'}

        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()

        references = self.find_data_references(content)

        issues = []
        valid_count = 0

        for var_name, field, line_num, category in references:
            is_valid, suggestions = self.validate_field(field, category)

            if is_valid:
                valid_count += 1
            else:
                issues.append({
                    'variable': var_name,
                    'field': field,
                    'line': line_num,
                    'category': category,
                    'suggestions': suggestions,
                    'valid_fields': sorted(self.field_mappings.get(category, set()))
                })

        return {
            'file': path.name,
            'total_data_references': len(references),
            'valid_references': valid_count,
            'issues': issues
        }

    def validate_all_templates(self, template_dir: str = None) -> Dict[str, Dict]:
        """Validate all HTML templates in directory"""
        if template_dir is None:
            template_dir = self.json_path.parent

        template_dir = Path(template_dir)
        html_files = sorted(template_dir.glob('*.html'))

        results = {}
        for html_file in html_files:
            results[html_file.name] = self.validate_template(html_file)

        return results

    def print_report(self, results: Dict[str, Dict]):
        """Print formatted validation report"""
        print("=" * 100)
        print("TEMPLATE VALIDATION REPORT - Data Field References Only")
        print("=" * 100)
        print()

        total_issues = 0
        files_with_issues = 0
        all_issues_by_type = defaultdict(list)

        for filename, result in sorted(results.items()):
            if 'error' in result:
                print(f"❌ {filename}: {result['error']}")
                continue

            has_issues = len(result['issues']) > 0
            if has_issues:
                files_with_issues += 1
                total_issues += len(result['issues'])

            status = "❌" if has_issues else "✓"
            print(f"\n{status} {filename}")
            print(f"   Data references: {result['total_data_references']} | Valid: {result['valid_references']} | Issues: {len(result['issues'])}")

            if has_issues:
                # Group issues by field for better readability
                issues_by_field = defaultdict(list)
                for issue in result['issues']:
                    key = f"{issue['variable']}.{issue['field']}"
                    issues_by_field[key].append(issue)

                for field_ref, issue_list in sorted(issues_by_field.items()):
                    issue = issue_list[0]  # Take first occurrence
                    lines = [str(i['line']) for i in issue_list]
                    line_info = f"line{'s' if len(lines) > 1 else ''} {', '.join(lines)}"

                    print(f"   ⚠️  {field_ref} ({line_info})")

                    if issue['suggestions']:
                        print(f"      → Should be: {', '.join(issue['suggestions'])}")
                    else:
                        print(f"      → Available fields in {issue['category']}: {', '.join(issue['valid_fields'][:5])}...")

                    # Track for summary
                    all_issues_by_type[field_ref].append(filename)

        print("\n" + "=" * 100)
        print(f"SUMMARY: {files_with_issues}/{len(results)} files with issues | Total issues: {total_issues}")
        print("=" * 100)

        if all_issues_by_type:
            print("\nMOST COMMON ISSUES:")
            print("-" * 100)
            for field_ref, files in sorted(all_issues_by_type.items(), key=lambda x: len(x[1]), reverse=True)[:10]:
                print(f"  {field_ref} - Found in {len(files)} file(s)")

    def generate_fix_script(self, results: Dict[str, Dict]) -> str:
        """Generate a Python script to auto-fix issues"""
        fixes_by_file = defaultdict(list)

        for filename, result in results.items():
            if 'error' in result or not result['issues']:
                continue

            for issue in result['issues']:
                if issue['suggestions']:
                    fixes_by_file[filename].append({
                        'find': f"{issue['variable']}.{issue['field']}",
                        'replace': f"{issue['variable']}.{issue['suggestions'][0]}",
                        'line': issue['line']
                    })

        if not fixes_by_file:
            return "# No fixes needed!"

        script = '''#!/usr/bin/env python3
"""Auto-generated fix script for template issues"""

import re
from pathlib import Path

def fix_template(filepath, replacements):
    """Apply fixes to a template file"""
    path = Path(filepath)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Apply each replacement
    for old, new in replacements:
        # Use word boundaries to avoid partial matches
        pattern = r'\\b' + re.escape(old) + r'\\b'
        content = re.sub(pattern, new, content)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✓ Fixed {path.name}")

# Fixes to apply
fixes = {
'''

        for filename, fix_list in sorted(fixes_by_file.items()):
            # Group unique replacements
            unique_fixes = {}
            for fix in fix_list:
                unique_fixes[fix['find']] = fix['replace']

            script += f"    '{filename}': [\n"
            for find, replace in sorted(unique_fixes.items()):
                script += f"        ('{find}', '{replace}'),\n"
            script += "    ],\n"

        script += '''}

if __name__ == '__main__':
    template_dir = Path(__file__).parent

    for filename, replacements in fixes.items():
        filepath = template_dir / filename
        if filepath.exists():
            fix_template(filepath, replacements)
        else:
            print(f"❌ File not found: {filename}")

    print(f"\\n✓ Fixed {len(fixes)} template(s)")
'''

        return script


def main():
    """Main execution"""
    import sys

    json_path = Path(__file__).parent / 'resume.json'

    if not json_path.exists():
        print(f"❌ Error: resume.json not found at {json_path}")
        sys.exit(1)

    # Create validator
    validator = TemplateValidator(json_path)

    # Validate all templates
    print("Analyzing templates for data field references...\n")
    results = validator.validate_all_templates()

    # Print report
    validator.print_report(results)

    # Generate fix script
    fix_script = validator.generate_fix_script(results)

    if "No fixes needed" not in fix_script:
        output_file = Path(__file__).parent / 'auto_fix_templates.py'
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(fix_script)
        print(f"\n✓ Auto-fix script generated: {output_file}")
        print(f"  Run it with: python3 {output_file.name}")


if __name__ == '__main__':
    main()
