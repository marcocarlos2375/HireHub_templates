#!/usr/bin/env python3
"""
Fix project date references by making them conditional or removing them
"""

import re
from pathlib import Path

def fix_project_dates(content: str) -> str:
    """Make project date references conditional"""

    # Pattern 1: dateSpan.textContent = formatDate(proj.startDate) + ' - ' + formatDate(proj.endDate);
    # Replace with conditional version
    pattern1 = r"(dateSpan\.textContent\s*=\s*)formatDate\((proj|project)\.startDate\)\s*\+\s*['\"].*?['\"]\s*\+\s*formatDate\((proj|project)\.endDate\);"

    def replace1(match):
        prefix = match.group(1)
        var = match.group(2)
        return f"if ({var}.startDate && {var}.endDate) {{\n        {prefix}formatDate({var}.startDate) + ' - ' + formatDate({var}.endDate);\n      }}"

    content = re.sub(pattern1, replace1, content)

    # Pattern 2: Template strings in project dates
    # Example: `${proj.startDate} - ${proj.endDate}`
    # We need to find these in context and wrap them

    # Pattern 3: Direct assignment with dates
    # dateStr = `${project.startDate} - ${project.endDate}`;
    pattern3 = r"(const\s+dateStr\s*=\s*)`?\$\{(project|proj)\.startDate\}\s*[-–]\s*\$\{(project|proj)\.endDate\}`?;"

    def replace3(match):
        var = match.group(2)
        return f"const dateStr = {var}.startDate && {var}.endDate ? `${{{var}.startDate}} - ${{{var}.endDate}}` : '';"

    content = re.sub(pattern3, replace3, content)

    # Pattern 4: Multi-line date assignments
    # Look for lines that use startDate and endDate and wrap them
    lines = content.split('\n')
    new_lines = []
    i = 0
    while i < len(lines):
        line = lines[i]

        # Check if line contains both startDate and endDate for projects
        if re.search(r'(proj|project)\.(startDate|endDate)', line):
            # Check if it's already in a conditional
            if 'if' not in line and 'if (' not in lines[max(0, i-1)] and 'if (' not in lines[max(0, i-2)]:
                # Check if it's a simple assignment we can fix
                match = re.search(r'(\w+)\.textContent\s*=.*?(proj|project)\.(startDate|endDate)', line)
                if match:
                    var_name = match.group(2)
                    indent = len(line) - len(line.lstrip())
                    indent_str = ' ' * indent

                    # Add conditional wrapper
                    new_lines.append(f"{indent_str}if ({var_name}.startDate && {var_name}.endDate) {{")
                    new_lines.append(f"  {line}")
                    new_lines.append(f"{indent_str}}}")
                    i += 1
                    continue

        new_lines.append(line)
        i += 1

    content = '\n'.join(new_lines)

    return content

def main():
    """Fix templates with project date issues"""
    template_dir = Path(__file__).parent

    templates_with_dates = [
        'Aurora.html',
        'Gradiento.html',
        'ProfessionalBlock.html',
        'modern.html',
        'pastel.html',
    ]

    fixed_count = 0

    print("Fixing project date references...\n")

    for filename in templates_with_dates:
        filepath = template_dir / filename

        if not filepath.exists():
            print(f"❌ Not found: {filename}")
            continue

        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            original = content
            content = fix_project_dates(content)

            if content != original:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"✓ Fixed {filename}")
                fixed_count += 1
            else:
                print(f"  {filename} (no changes needed)")

        except Exception as e:
            print(f"❌ Error with {filename}: {e}")

    print(f"\n✓ Fixed {fixed_count} template(s)")
    print("\nProject dates are now conditional - won't show 'undefined' if not present.")
    print("Run deep_validator.py to verify.")

if __name__ == '__main__':
    main()
