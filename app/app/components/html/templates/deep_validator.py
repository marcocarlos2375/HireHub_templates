#!/usr/bin/env python3
"""
Deep Validator - Comprehensive undefined variable detection
Checks template strings, innerHTML, textContent, and all property accesses
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Set, Tuple
from collections import defaultdict

class DeepValidator:
    def __init__(self, json_path: str):
        """Initialize with resume.json"""
        self.json_path = Path(json_path)
        self.json_data = {}
        self.valid_fields = self._load_structure()

    def _load_structure(self) -> Dict[str, Set[str]]:
        """Load resume.json and extract all valid field names by category"""
        with open(self.json_path, 'r', encoding='utf-8') as f:
            self.json_data = json.load(f)

        content = self.json_data.get('content', {})

        fields = {
            'personalInfo': set(),
            'employment': set(),
            'education': set(),
            'skills': set(),
            'skillGroups': set(),
            'languages': set(),
            'projects': set(),
            'publications': set(),
            'courses': set(),
            'references': set(),
            'awards': set(),
            'volunteering': set(),
            'websitesAndSocialLinks': set(),
        }

        # Extract personalInfo fields
        if 'personalInfo' in content:
            fields['personalInfo'] = set(content['personalInfo'].keys())
            # Add nested socialLinks fields
            if 'socialLinks' in content['personalInfo']:
                for key in content['personalInfo']['socialLinks'].keys():
                    fields['personalInfo'].add(f'socialLinks.{key}')
            # Add websitesAndSocialLinks item fields
            if 'websitesAndSocialLinks' in content['personalInfo']:
                if content['personalInfo']['websitesAndSocialLinks']:
                    fields['websitesAndSocialLinks'] = set(
                        content['personalInfo']['websitesAndSocialLinks'][0].keys()
                    )

        # Extract array item fields
        array_mappings = [
            ('employmentHistory', 'employment'),
            ('education', 'education'),
            ('skills', 'skills'),
            ('skillGroups', 'skillGroups'),
            ('languages', 'languages'),
            ('projects', 'projects'),
            ('publications', 'publications'),
            ('courses', 'courses'),
            ('references', 'references'),
        ]

        for json_key, field_key in array_mappings:
            if json_key in content and content[json_key]:
                if isinstance(content[json_key], list) and len(content[json_key]) > 0:
                    fields[field_key] = set(content[json_key][0].keys())

        # Extract customSections
        if 'customSections' in content:
            if 'awards' in content['customSections'] and content['customSections']['awards']:
                fields['awards'] = set(content['customSections']['awards'][0].keys())
            if 'volunteering' in content['customSections'] and content['customSections']['volunteering']:
                fields['volunteering'] = set(content['customSections']['volunteering'][0].keys())

        return fields

    def find_all_property_accesses(self, content: str) -> List[Tuple[str, str, int, str]]:
        """
        Find ALL property accesses in JavaScript code
        Returns: (variable, property, line_number, context)
        """
        issues = []
        lines = content.split('\n')

        # Variable name patterns for each category
        var_patterns = {
            'personalInfo': ['personal', 'personalInfo', 'contact'],
            'employment': ['job', 'exp', 'employment'],
            'education': ['edu', 'education'],
            'skills': ['skill'],
            'skillGroups': ['group', 'g', 'cat'],
            'languages': ['lang', 'language'],
            'projects': ['proj', 'project'],
            'publications': ['pub', 'publication'],
            'courses': ['course'],
            'references': ['ref', 'reference'],
            'awards': ['award'],
            'volunteering': ['vol', 'volunteer'],
            'websitesAndSocialLinks': ['link', 'social'],
        }

        # JavaScript built-ins to ignore
        js_builtins = {
            'forEach', 'map', 'filter', 'reduce', 'find', 'findIndex',
            'some', 'every', 'includes', 'indexOf', 'length', 'push',
            'pop', 'shift', 'unshift', 'slice', 'splice', 'join',
            'concat', 'toString', 'valueOf', 'hasOwnProperty',
            'toLowerCase', 'toUpperCase', 'trim', 'split', 'replace',
            'charAt', 'charCodeAt', 'substring', 'substr',
            'innerHTML', 'textContent', 'innerText', 'className',
            'style', 'src', 'href', 'value', 'id', 'name',
            'appendChild', 'removeChild', 'createElement',
            'getElementById', 'querySelector', 'querySelectorAll',
            'addEventListener', 'removeEventListener',
            'preventDefault', 'stopPropagation',
            'classList', 'dataset', 'attributes',
            'parentNode', 'childNodes', 'firstChild', 'lastChild',
            'nextSibling', 'previousSibling',
            'display', 'color', 'background', 'width', 'height',
            'toLocaleDateString', 'toLocaleString', 'getTime',
        }

        for line_num, line in enumerate(lines, 1):
            # Skip comments
            if line.strip().startswith('//') or line.strip().startswith('/*'):
                continue

            # Pattern 1: Template strings ${variable.property}
            template_pattern = r'\$\{([a-zA-Z_$][a-zA-Z0-9_$]*)\.([a-zA-Z_$][a-zA-Z0-9_$.]*)\}'
            for match in re.finditer(template_pattern, line):
                var_name = match.group(1)
                prop_chain = match.group(2)
                first_prop = prop_chain.split('.')[0]

                if first_prop not in js_builtins:
                    category = self._get_category(var_name, var_patterns)
                    if category:
                        issues.append((var_name, prop_chain, line_num, f'template string: {match.group(0)}'))

            # Pattern 2: Direct property access variable.property
            direct_pattern = r'\b([a-zA-Z_$][a-zA-Z0-9_$]*)\.([a-zA-Z_$][a-zA-Z0-9_$.]+)\b'
            for match in re.finditer(direct_pattern, line):
                var_name = match.group(1)
                prop_chain = match.group(2)
                first_prop = prop_chain.split('.')[0]

                # Skip common false positives
                if var_name in ['document', 'window', 'console', 'Math', 'Date',
                               'Array', 'Object', 'String', 'JSON', 'localStorage',
                               'sessionStorage', 'navigator', 'location', 'history']:
                    continue

                if first_prop not in js_builtins:
                    category = self._get_category(var_name, var_patterns)
                    if category:
                        issues.append((var_name, prop_chain, line_num, f'property access: {match.group(0)}'))

        return issues

    def _get_category(self, var_name: str, var_patterns: Dict[str, List[str]]) -> str:
        """Get category for a variable name"""
        for category, patterns in var_patterns.items():
            if var_name in patterns:
                return category
        return None

    def validate_property(self, var_name: str, prop_chain: str, category: str) -> Tuple[bool, str]:
        """
        Validate if property exists in category
        Returns: (is_valid, suggestion)
        """
        if not category or category not in self.valid_fields:
            return True, ""  # Can't validate, assume OK

        valid_fields = self.valid_fields[category]

        # Get the first property in the chain
        first_prop = prop_chain.split('.')[0]

        # Check if it exists
        if first_prop in valid_fields:
            return True, ""

        # For nested properties, check the full chain
        if '.' in prop_chain:
            # Try to match nested properties
            for valid_field in valid_fields:
                if valid_field.startswith(first_prop):
                    return True, ""

        # Property doesn't exist - find suggestions
        suggestions = []

        # Common field mappings
        mappings = {
            'platform': 'label',
            'name': 'firstName',
            'title': 'jobTitle',
            'employer': 'company',
            'institution': 'school',
            'proficiency': 'level',
            'date': 'startDate',
            'organization': 'city',
            'position': 'title',
            'role': 'title',
            'summary': 'description',
            'awarder': 'city',
            'issuer': 'city',
        }

        if first_prop in mappings and mappings[first_prop] in valid_fields:
            return False, mappings[first_prop]

        # Try fuzzy matching
        for valid_field in valid_fields:
            if first_prop.lower() in valid_field.lower() or valid_field.lower() in first_prop.lower():
                suggestions.append(valid_field)

        if suggestions:
            return False, suggestions[0]

        # Return available fields
        return False, f"Available fields: {', '.join(sorted(list(valid_fields))[:5])}"

    def validate_template(self, template_path: Path) -> Dict:
        """Validate a single template"""
        with open(template_path, 'r', encoding='utf-8') as f:
            content = f.read()

        all_accesses = self.find_all_property_accesses(content)

        issues = []
        valid_count = 0

        # Variable patterns for category detection
        var_patterns = {
            'personalInfo': ['personal', 'personalInfo', 'contact'],
            'employment': ['job', 'exp', 'employment'],
            'education': ['edu', 'education'],
            'skills': ['skill'],
            'skillGroups': ['group', 'g', 'cat'],
            'languages': ['lang', 'language'],
            'projects': ['proj', 'project'],
            'publications': ['pub', 'publication'],
            'courses': ['course'],
            'references': ['ref', 'reference'],
            'awards': ['award'],
            'volunteering': ['vol', 'volunteer'],
            'websitesAndSocialLinks': ['link', 'social'],
        }

        for var_name, prop_chain, line_num, context in all_accesses:
            category = self._get_category(var_name, var_patterns)
            is_valid, suggestion = self.validate_property(var_name, prop_chain, category)

            if is_valid:
                valid_count += 1
            else:
                issues.append({
                    'line': line_num,
                    'variable': var_name,
                    'property': prop_chain,
                    'context': context,
                    'category': category,
                    'suggestion': suggestion
                })

        return {
            'file': template_path.name,
            'total_accesses': len(all_accesses),
            'valid_accesses': valid_count,
            'issues': issues
        }

    def validate_all(self) -> Dict[str, Dict]:
        """Validate all templates"""
        template_dir = self.json_path.parent
        html_files = sorted(template_dir.glob('*.html'))

        results = {}
        for html_file in html_files:
            results[html_file.name] = self.validate_template(html_file)

        return results

    def print_report(self, results: Dict[str, Dict]):
        """Print detailed report"""
        print("=" * 100)
        print("DEEP VALIDATION REPORT - All Property Accesses")
        print("=" * 100)
        print()

        files_with_issues = 0
        total_issues = 0
        all_issues_summary = defaultdict(list)

        for filename, result in sorted(results.items()):
            has_issues = len(result['issues']) > 0

            if has_issues:
                files_with_issues += 1
                total_issues += len(result['issues'])

            if has_issues:
                print(f"\n❌ {filename}")
                print(f"   Property accesses: {result['total_accesses']} | Valid: {result['valid_accesses']} | Issues: {len(result['issues'])}")
                print()

                for issue in result['issues']:
                    key = f"{issue['variable']}.{issue['property']}"
                    print(f"   ⚠️  Line {issue['line']}: {issue['context']}")
                    print(f"      → {key}")
                    print(f"      → Suggestion: {issue['suggestion']}")
                    print()

                    all_issues_summary[key].append(filename)

        # Print summary
        print("\n" + "=" * 100)
        print(f"SUMMARY: {files_with_issues}/{len(results)} files with undefined variables")
        print(f"Total undefined variables: {total_issues}")
        print("=" * 100)

        if all_issues_summary:
            print("\nMOST COMMON UNDEFINED VARIABLES:")
            print("-" * 100)
            for prop, files in sorted(all_issues_summary.items(), key=lambda x: len(x[1]), reverse=True):
                print(f"  {prop}")
                print(f"    Found in: {', '.join(files)}")

        # Print clean files
        clean_files = [name for name, result in results.items() if not result['issues']]
        if clean_files:
            print(f"\n✓ {len(clean_files)} files with NO issues:")
            for name in clean_files:
                print(f"  ✓ {name}")

def main():
    """Main execution"""
    json_path = Path(__file__).parent / 'resume.json'

    if not json_path.exists():
        print(f"❌ Error: resume.json not found")
        return

    print("Running deep validation...\n")

    validator = DeepValidator(json_path)
    results = validator.validate_all()
    validator.print_report(results)

if __name__ == '__main__':
    main()
