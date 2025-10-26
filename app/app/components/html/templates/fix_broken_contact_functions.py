#!/usr/bin/env python3
"""
Fix broken populateContactInfo functions that were damaged by automated scripts
"""

import re
from pathlib import Path

def fix_beige(content):
    """Fix Beige.html - websitesAndSocialLinks is incorrectly nested in birthDate if block"""
    # Find the broken section
    pattern = r'(if \(personal\.birthDate\) \{[^\}]*?)// Website display removed.*?\n.*?personal\.websitesAndSocialLinks\.forEach.*?\n.*?\}\);\s*hasDetails = true;\s*\}'

    # Replace with proper structure
    replacement = r'''\1html += `<p><strong>Birth Date:</strong> ${formattedDate}</p>`;
        hasDetails = true;
      }

      // Display websitesAndSocialLinks
      if (personal.websitesAndSocialLinks && personal.websitesAndSocialLinks.length > 0) {
        personal.websitesAndSocialLinks.forEach(link => {
          html += `<p style="margin-left: 10px;">${link.label}: ${link.url.replace('https://', '').replace('http://', '')}</p>`;
        });
        hasDetails = true;
      }'''

    return re.sub(pattern, replacement, content, flags=re.DOTALL)

def fix_mono(content):
    """Fix Mono.html - completely broken function"""
    pattern = r'function populateContactInfo\(\) \{[^}]*?if \(personal\.phone\).*?if \(hasDetails\) \{'

    replacement = '''function populateContactInfo() {
      const personal = resumeData.personalInfo;
      let html = '';
      let hasDetails = false;

      if (personal.phone) {
        html += `<p><strong>Phone:</strong> ${personal.phone}</p>`;
        hasDetails = true;
      }

      if (personal.email) {
        html += `<p><strong>Email:</strong> ${personal.email}</p>`;
        hasDetails = true;
      }

      if (personal.location) {
        html += `<p><strong>Location:</strong> ${personal.location}</p>`;
        hasDetails = true;
      }

      if (personal.birthDate) {
        const birthDate = new Date(personal.birthDate);
        const formattedDate = birthDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        html += `<p><strong>Birth Date:</strong> ${formattedDate}</p>`;
        hasDetails = true;
      }

      if (personal.nationality) {
        html += `<p><strong>Nationality:</strong> ${personal.nationality}</p>`;
        hasDetails = true;
      }

      if (personal.availability) {
        html += `<p><strong>Availability:</strong> ${personal.availability}</p>`;
        hasDetails = true;
      }

      if (personal.relationshipStatus) {
        html += `<p><strong>Status:</strong> ${personal.relationshipStatus}</p>`;
        hasDetails = true;
      }

      if (personal.drivingLicense) {
        html += `<p><strong>License:</strong> ${personal.drivingLicense}</p>`;
        hasDetails = true;
      }

      // Display websitesAndSocialLinks
      if (personal.websitesAndSocialLinks && personal.websitesAndSocialLinks.length > 0) {
        personal.websitesAndSocialLinks.forEach(link => {
          html += `<p><strong>${link.label}:</strong> ${link.url.replace('https://', '').replace('http://', '')}</p>`;
        });
        hasDetails = true;
      }

      if (hasDetails) {'''

    return re.sub(pattern, replacement, content, flags=re.DOTALL)

def fix_epure(content):
    """Fix Epure.html - broken function"""
    pattern = r'function populateContactInfo\(\) \{[^}]*?if \(personal\.location\).*?if \(hasDetails\) \{'

    replacement = '''function populateContactInfo() {
      const personal = resumeData.personalInfo;
      let html = '';
      let hasDetails = false;

      if (personal.phone) {
        html += `<p><strong>Phone:</strong> ${personal.phone}</p>`;
        hasDetails = true;
      }

      if (personal.email) {
        html += `<p><strong>Email:</strong> ${personal.email}</p>`;
        hasDetails = true;
      }

      if (personal.location) {
        html += `<p><strong>Location:</strong> ${personal.location}</p>`;
        hasDetails = true;
      }

      if (personal.birthDate) {
        const birthDate = new Date(personal.birthDate);
        const formattedDate = birthDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        html += `<p><strong>Birth Date:</strong> ${formattedDate}</p>`;
        hasDetails = true;
      }

      if (personal.nationality) {
        html += `<p><strong>Nationality:</strong> ${personal.nationality}</p>`;
        hasDetails = true;
      }

      if (personal.availability) {
        html += `<p><strong>Availability:</strong> ${personal.availability}</p>`;
        hasDetails = true;
      }

      if (personal.relationshipStatus) {
        html += `<p><strong>Status:</strong> ${personal.relationshipStatus}</p>`;
        hasDetails = true;
      }

      if (personal.drivingLicense) {
        html += `<p><strong>License:</strong> ${personal.drivingLicense}</p>`;
        hasDetails = true;
      }

      // Display websitesAndSocialLinks
      if (personal.websitesAndSocialLinks && personal.websitesAndSocialLinks.length > 0) {
        personal.websitesAndSocialLinks.forEach(link => {
          html += `<p><strong>${link.label}:</strong> ${link.url.replace('https://', '').replace('http://', '')}</p>`;
        });
        hasDetails = true;
      }

      if (hasDetails) {'''

    return re.sub(pattern, replacement, content, flags=re.DOTALL)

def main():
    template_dir = Path(__file__).parent

    fixes = {
        'Beige.html': fix_beige,
        'Mono.html': fix_mono,
        'Epure.html': fix_epure,
    }

    print("=" * 80)
    print("FIXING BROKEN CONTACT FUNCTIONS")
    print("=" * 80)
    print()

    for filename, fix_func in fixes.items():
        filepath = template_dir / filename

        if not filepath.exists():
            print(f"❌ Not found: {filename}")
            continue

        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            original = content
            content = fix_func(content)

            if content != original:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"✓ Fixed {filename}")
            else:
                print(f"  {filename} (no changes)")

        except Exception as e:
            print(f"❌ Error with {filename}: {e}")

    print()
    print("=" * 80)
    print("Done! Check remaining templates manually")
    print("=" * 80)

if __name__ == '__main__':
    main()
