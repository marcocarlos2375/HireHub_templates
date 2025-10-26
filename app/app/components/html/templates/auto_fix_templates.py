#!/usr/bin/env python3
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
        pattern = r'\b' + re.escape(old) + r'\b'
        content = re.sub(pattern, new, content)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✓ Fixed {path.name}")

# Fixes to apply
fixes = {
    'Aurora.html': [
        ('award.date', 'award.startDate'),
        ('course.name', 'course.title'),
        ('job.employer', 'job.company'),
        ('lang.proficiency', 'lang.level'),
        ('personal.name', 'personal.lastName'),
        ('personal.title', 'personal.jobTitle'),
        ('pub.date', 'pub.publicationDate'),
        ('skill.name', 'skill.skill'),
        ('vol.role', 'vol.title'),
    ],
    'Clarity.html': [
        ('award.date', 'award.startDate'),
        ('job.current', 'job.currentlyWorking'),
        ('job.title', 'job.jobTitle'),
        ('lang.proficiency', 'lang.level'),
        ('personal.name', 'personal.lastName'),
        ('personal.title', 'personal.jobTitle'),
        ('pub.date', 'pub.publicationDate'),
    ],
    'DiamondFlow.html': [
        ('award.date', 'award.startDate'),
        ('job.current', 'job.currentlyWorking'),
        ('job.title', 'job.jobTitle'),
        ('lang.proficiency', 'lang.level'),
        ('personal.name', 'personal.lastName'),
        ('personal.title', 'personal.jobTitle'),
        ('pub.date', 'pub.publicationDate'),
    ],
    'Epure.html': [
        ('award.date', 'award.startDate'),
        ('job.current', 'job.currentlyWorking'),
        ('job.title', 'job.jobTitle'),
        ('lang.proficiency', 'lang.level'),
        ('personal.name', 'personal.lastName'),
        ('personal.title', 'personal.jobTitle'),
        ('pub.date', 'pub.publicationDate'),
    ],
    'Focus.html': [
        ('award.date', 'award.startDate'),
        ('job.current', 'job.currentlyWorking'),
        ('job.title', 'job.jobTitle'),
        ('lang.proficiency', 'lang.level'),
        ('personal.name', 'personal.lastName'),
        ('personal.title', 'personal.jobTitle'),
        ('pub.date', 'pub.publicationDate'),
    ],
    'ModernEdge.html': [
        ('award.date', 'award.startDate'),
        ('job.current', 'job.currentlyWorking'),
        ('job.title', 'job.jobTitle'),
        ('lang.proficiency', 'lang.level'),
        ('personal.name', 'personal.lastName'),
        ('personal.title', 'personal.jobTitle'),
        ('pub.date', 'pub.publicationDate'),
    ],
    'Mono.html': [
        ('award.date', 'award.startDate'),
        ('job.current', 'job.currentlyWorking'),
        ('job.title', 'job.jobTitle'),
        ('lang.proficiency', 'lang.level'),
        ('personal.name', 'personal.lastName'),
        ('personal.title', 'personal.jobTitle'),
        ('pub.date', 'pub.publicationDate'),
    ],
    'ProfessionalBlock.html': [
        ('award.date', 'award.startDate'),
        ('course.name', 'course.title'),
        ('job.employer', 'job.company'),
        ('lang.proficiency', 'lang.level'),
        ('personal.name', 'personal.lastName'),
        ('personal.title', 'personal.jobTitle'),
        ('pub.date', 'pub.publicationDate'),
        ('skill.name', 'skill.skill'),
        ('vol.role', 'vol.title'),
    ],
    'Sapphire.html': [
        ('personal.name', 'personal.lastName'),
        ('personal.title', 'personal.jobTitle'),
    ],
    'modern.html': [
        ('award.date', 'award.startDate'),
        ('course.name', 'course.title'),
        ('job.employer', 'job.company'),
        ('lang.proficiency', 'lang.level'),
        ('personalInfo.name', 'personalInfo.lastName'),
        ('personalInfo.title', 'personalInfo.jobTitle'),
        ('pub.date', 'pub.publicationDate'),
        ('skill.name', 'skill.skill'),
        ('vol.role', 'vol.title'),
    ],
    'pastel.html': [
        ('award.date', 'award.startDate'),
        ('course.name', 'course.title'),
        ('job.employer', 'job.company'),
        ('lang.proficiency', 'lang.level'),
        ('personal.name', 'personal.lastName'),
        ('personal.title', 'personal.jobTitle'),
        ('pub.date', 'pub.publicationDate'),
        ('skill.name', 'skill.skill'),
        ('vol.role', 'vol.title'),
    ],
}

if __name__ == '__main__':
    template_dir = Path(__file__).parent

    for filename, replacements in fixes.items():
        filepath = template_dir / filename
        if filepath.exists():
            fix_template(filepath, replacements)
        else:
            print(f"❌ File not found: {filename}")

    print(f"\n✓ Fixed {len(fixes)} template(s)")
