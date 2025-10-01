# Pagination Best Practices

## Overview
This guide explains how to structure HTML content in Vue templates to work optimally with the `AutoPaginatorOneColHeaderOnce` component. Following these practices ensures content splits cleanly across pages without overflow issues.

---

## Core Principles

### 1. **Use Semantic Section Wrappers**

The paginator recognizes special CSS classes that help it split content intelligently:
- `.section` - Wraps a logical content section
- `.section-title` - Marks section headers (kept with first content)

```javascript
// ✅ GOOD - Splittable structure
const generateExperienceHTML = (experiences) => {
  return `
    <section class="section experience-section">
      <h2 class="section-title" style="${styles.sectionTitle}">Experience</h2>
      ${experiences.map(exp => `
        <div class="experience-item" style="margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <h3 style="${styles.jobTitle}">${exp.job_title}</h3>
            <span style="${styles.dateRange}">${exp.start_date} - ${exp.end_date}</span>
          </div>
          <p style="${styles.companyName}">${exp.company}</p>
          <div class="description">${exp.description}</div>
        </div>
      `).join('')}
    </section>
  `
}
```

---

### 2. **Break Large Blocks into Smaller Units**

Each repeating item (experience, education, project) should be a separate top-level element:

```javascript
// ❌ BAD - One giant unsplittable block (wrapper acts as a single block)
const generateExperienceHTML = (experiences) => {
  return `
    <div class="all-experiences">
      ${experiences.map(exp => `
        <div style="margin-bottom: 25px;">
          <h3>${exp.company}</h3>
          <p>${exp.job_title}</p>
          <div>${exp.description}</div>
          <ul>${exp.achievements.map(a => `<li>${a}</li>`).join('')}</ul>
        </div>
      `).join('')}
    </div>
  `
}
// ⚠️ Problem: The wrapper <div class="all-experiences"> is treated as ONE block
// The paginator must split INSIDE it, which is harder and less predictable

// ✅ GOOD - Each experience is independent and can be split
const generateExperienceHTML = (experiences) => {
  return experiences.map(exp => `
    <div class="experience-item" style="margin-bottom: 20px;">
      <div class="header">
        <h3 style="${styles.jobTitle}">${exp.job_title}</h3>
        <span style="${styles.dateRange}">${exp.start_date} - ${exp.end_date}</span>
      </div>
      <p style="${styles.companyName}">${exp.company}</p>
      <div class="description">${exp.description}</div>
      ${exp.achievements?.length ? `
        <ul style="${styles.achievementList}">
          ${exp.achievements.map(a => `
            <li style="${styles.achievementItem}">${a}</li>
          `).join('')}
        </ul>
      ` : ''}
    </div>
  `).join('') // ✅ CRITICAL: No wrapper div! Returns multiple sibling elements
}
```

**Key Difference**: The `.join('')` without a wrapper returns multiple adjacent **sibling elements**, not one wrapped container.

### **Why Wrappers Are Problematic**

```javascript
// With wrapper - Paginator sees ONE block
<div class="wrapper">  ← This is treated as ONE unsplittable unit
  <div>Item 1</div>
  <div>Item 2</div>    ← Can't easily split between items
  <div>Item 3</div>
</div>

// Without wrapper - Paginator sees MULTIPLE blocks
<div>Item 1</div>  ← Independent block
<div>Item 2</div>  ← Can split HERE ✂️
<div>Item 3</div>  ← Independent block
```

**When the paginator encounters a wrapper div**, it must:
1. Try to fit the entire wrapper on the page
2. If it doesn't fit, recursively split INSIDE the wrapper
3. This requires extra processing and can lead to suboptimal splits

**Without a wrapper**, the paginator can:
1. Process each item individually
2. Fit as many items as possible on the current page
3. Move remaining items to the next page cleanly

**Rule**: Only wrap content when it's semantically necessary (like `<section class="section">`), never for grouping items that should be independently splittable.

---

### 3. **Use Lists for Repeating Items**

The paginator has special `splitListInContext()` logic that splits lists item-by-item:

```javascript
// ✅ EXCELLENT - Title separate, UL separate (no wrapper!)
const generateSkillsHTML = (skillCategories) => {
  const header = `
    <section class="section">
      <h2 class="section-title" style="${styles.sectionTitle}">Skills</h2>
    </section>
  `
  
  const list = `
    <ul style="list-style: none; padding: 0; margin: 0;">
      ${skillCategories.map(category => `
        <li style="margin-bottom: 12px;">
          <strong style="${styles.skillCategory}">${category.name}:</strong>
          <div style="${styles.skillContainer}">
            ${category.skills.map(skill => 
              `<span style="${styles.skillTag}">${skill}</span>`
            ).join('')}
          </div>
        </li>
      `).join('')}
    </ul>
  `
  
  return header + list  // Two sibling elements!
}

// Also works for achievements
const generateAchievements = (achievements) => {
  if (!achievements?.length) return ''
  
  return `
    <ul style="margin: 8px 0; padding-left: 20px; line-height: 1.4;">
      ${achievements.map(achievement => `
        <li style="margin-bottom: 6px; font-size: 12px;">${achievement}</li>
      `).join('')}
    </ul>
  `
}
```

**Why this works**: The paginator can test each `<li>` element individually and split the list when one doesn't fit.

---

### 4. **Avoid Atomic Blocks for Large Content**

Atomic blocks (`data-atomic="true"` or `.lang-item`) cannot be split:

```javascript
// ❌ BAD - Marked as atomic, can't split if content is long
<div class="lang-item" data-atomic="true">
  <div>Very long content that might overflow an entire page...</div>
</div>

// ✅ GOOD - Only use atomic for truly indivisible items (< 50px tall)
<div class="lang-item" data-atomic="true">
  <div style="display: flex; justify-content: space-between; align-items: center;">
    <span>English</span>
    <span style="color: #0EA5E9;">Native</span>
  </div>
  <div class="lang-bar" style="height: 6px; background: #0EA5E9; border-radius: 3px;"></div>
</div>
```

**Rule of thumb**: Only mark content as atomic if it's:
- Small (< 50px height)
- Visually meaningless if split (e.g., progress bars, rating stars)
- A single logical unit (e.g., contact info line)

---

## Recommended Template Structure

### **Main Content Assembly**

```javascript
const mainContent = computed(() => {
  const sections = []
  
  // Each section title is separate
  if (props.resumeData.experiences?.length) {
    sections.push(`
      <section class="section">
        <h2 class="section-title" style="${styles.sectionTitle}">Professional Experience</h2>
      </section>
    `)
    sections.push(generateExperienceHTML(props.resumeData.experiences))
  }
  
  if (props.resumeData.projects?.length) {
    sections.push(`
      <section class="section">
        <h2 class="section-title" style="${styles.sectionTitle}">Projects</h2>
      </section>
    `)
    sections.push(generateProjectsHTML(props.resumeData.projects))
  }
  
  if (props.resumeData.education?.length) {
    sections.push(`
      <section class="section">
        <h2 class="section-title" style="${styles.sectionTitle}">Education</h2>
      </section>
    `)
    sections.push(generateEducationHTML(props.resumeData.education))
  }
  
  return sections.join('')
})
```

### **Experience Items (Detailed Example)**

```javascript
const generateExperienceHTML = (experiences) => {
  return experiences.map(exp => `
    <div class="experience-item" style="margin-bottom: 25px; page-break-inside: avoid;">
      <!-- Header with job title and dates -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #333;">
          ${exp.job_title}
        </h3>
        <span style="font-size: 12px; color: #777; font-weight: 500; white-space: nowrap;">
          ${formatDateRange(exp.start_date, exp.end_date)}
        </span>
      </div>
      
      <!-- Company name -->
      <p style="margin: 0 0 10px 0; font-size: 12px; color: #0EA5E9; font-weight: 500;">
        ${exp.company}${exp.location ? ` • ${exp.location}` : ''}
      </p>
      
      <!-- WYSIWYG description (can contain rich HTML) -->
      <div class="description" style="margin: 8px 0; font-size: 12px; line-height: 1.6;">
        ${exp.description}
      </div>
      
      <!-- Optional: Key achievements as a list -->
      ${exp.achievements?.length ? `
        <ul style="margin: 8px 0; padding-left: 20px; line-height: 1.4;">
          ${exp.achievements.map(achievement => `
            <li style="margin-bottom: 6px; font-size: 12px;">${achievement}</li>
          `).join('')}
        </ul>
      ` : ''}
    </div>
  `).join('') // Important: No wrapper!
}
```

### **Education Items**

```javascript
const generateEducationHTML = (education) => {
  return education.map(edu => `
    <div class="education-item" style="margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <h3 style="margin: 0; font-size: 14px; font-weight: 600; color: #333;">
          ${edu.degree}
        </h3>
        <span style="font-size: 12px; color: #777; font-weight: 500;">
          ${edu.graduation_date}
        </span>
      </div>
      <p style="margin: 0 0 8px 0; font-size: 12px; color: #0EA5E9; font-weight: 500;">
        ${edu.institution}
      </p>
      ${edu.description ? `
        <div class="description" style="margin: 8px 0; font-size: 12px;">
          ${edu.description}
        </div>
      ` : ''}
    </div>
  `).join('')
}
```

### **Skills with Categories**

```javascript
const generateSkillsHTML = (skillCategories) => {
  if (!skillCategories?.length) return ''
  
  return `
    <section class="section">
      <h2 class="section-title" style="color: #0EA5E9; border-bottom: 2px solid #0EA5E9; padding-bottom: 5px; margin-bottom: 15px; font-size: 16px; font-weight: 600;">
        Skills
      </h2>
      <ul style="list-style: none; padding: 0; margin: 0;">
        ${skillCategories.map(category => `
          <li style="margin-bottom: 12px;">
            <strong style="font-size: 12px; font-weight: 600; color: #333; display: block; margin-bottom: 6px;">
              ${category.name}:
            </strong>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              ${category.skills.map(skill => `
                <span style="background-color: #f0f0f0; padding: 4px 10px; border-radius: 8px; font-size: 11px; color: #333;">
                  ${skill}
                </span>
              `).join('')}
            </div>
          </li>
        `).join('')}
      </ul>
    </section>
  `
}
```

---

## How the Paginator Splits Content

### **Splitting Hierarchy** (in order of preference)

1. **Section boundaries** - Tries to keep sections together
2. **Section title + first content** - Keeps title with at least one item
3. **List items** - Splits `<ul>/<ol>` one `<li>` at a time
4. **Block elements** - Splits `<div>`, `<p>`, etc. recursively
5. **Text nodes** - Uses binary search to split long text

### **What Gets Kept Together**

- ✅ Section title with first item of content
- ✅ Atomic blocks (`.lang-item`, `data-atomic="true"`)
- ✅ Small blocks that fit in remaining space
- ❌ Large blocks that exceed page height (will be split)

### **Splitting Example Flow**

```
Input:
  <section class="section">
    <h2 class="section-title">Experience</h2>
    <div>Experience 1 (200px tall)</div>
    <div>Experience 2 (180px tall)</div>
    <div>Experience 3 (200px tall)</div>
  </section>

Page 1 (400px available):
  <section class="section">
    <h2 class="section-title">Experience</h2>
    <div>Experience 1 (200px)</div>
    <div>Experience 2 (180px)</div>
  </section>

Page 2 (500px available):
  <section class="section">
    <h2 class="section-title">Experience</h2>  <!-- Title repeated! -->
    <div>Experience 3 (200px)</div>
  </section>
```

**Note**: Section titles are automatically duplicated on continuation pages.

---

## Common Pitfalls

### ❌ **Pitfall 1: Using Wrapper Divs Around Repeating Items**

**This is the #1 mistake that causes pagination issues!**

```javascript
// ❌ VERY BAD - Wrapper creates one giant unsplittable block
const generateSkillsHTML = (skills) => {
  return `
    <div class="skills-wrapper">
      ${Object.entries(skills).map(([category, skillList]) => `
        <h3>${category}</h3>
        <div>...</div>
      `).join('')}
    </div>
  `
}
// The paginator sees <div class="skills-wrapper"> as ONE block
// It must recursively split INSIDE the wrapper = harder, slower, less predictable

// ✅ PERFECT - No wrapper, each category is independent
const generateSkillsHTML = (skills) => {
  return Object.entries(skills).map(([category, skillList]) => `
    <h3>${category}</h3>
    <div style="display: flex; flex-wrap: wrap; gap: 6px;">
      ${skillList.map(skill => `<span>${skill}</span>`).join('')}
    </div>
    <div style="margin-bottom: 15px;"></div>
  `).join('') // ← No wrapper! Returns sibling elements
}
// The paginator sees: h3, div, spacer, h3, div, spacer...
// It can split between ANY category cleanly
```

**Visual Comparison:**
```
With wrapper:                   Without wrapper:
┌─────────────────────┐        ┌─────────┐
│ <div class="wrap">  │        │ <h3>    │ ← Block 1
│  ├─ <h3>Category 1  │        └─────────┘
│  ├─ <div>Skills     │        ┌─────────┐
│  ├─ <h3>Category 2  │   ✂️   │ <div>   │ ← Block 2
│  └─ <div>Skills     │        └─────────┘
│ </div>              │        ┌─────────┐
└─────────────────────┘        │ <h3>    │ ← Block 3 (can move to page 2)
     ONE block                 └─────────┘
                               Multiple blocks
```

### ❌ **Pitfall 2: Deep Nesting**

```javascript
// BAD - Hard to split
<div class="all-content">
  <div class="section-wrapper">
    <div class="content-container">
      <div class="item">...</div>
    </div>
  </div>
</div>

// GOOD - Flat structure
<section class="section">
  <h2 class="section-title">Title</h2>
</section>
<div class="item">...</div>
<div class="item">...</div>
```

### ❌ **Pitfall 3: Large Unbreakable Blocks**

```javascript
// BAD - 500px tall block
<div style="margin-bottom: 40px;">
  <h3>Title</h3>
  <p>Subtitle</p>
  <div>Long description...</div>
  <ul>Many items...</ul>
</div>

// GOOD - Broken into pieces
<div style="margin-bottom: 10px;">
  <h3>Title</h3>
  <p>Subtitle</p>
</div>
<div style="margin-bottom: 10px;">
  <div>Long description...</div>
</div>
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
```

### ❌ **Pitfall 4: Missing Section Classes**

```javascript
// BAD - Paginator doesn't know this is a section
<div>
  <h2>Experience</h2>
  <div>Content...</div>
</div>

// GOOD - Explicit section markup
<section class="section">
  <h2 class="section-title">Experience</h2>
  <div>Content...</div>
</section>
```

---

## Testing Your Template

### **1. Check Console Logs**

After implementing your template, check the browser console for:

```
📄 Total Pages: 3
✅ Page 1: 97.3%
✅ Page 2: 98.5%
⚠️ Page 3: 105.2%  // ← Warning: overflow!
```

- ✅ `95-101%` = Optimal usage
- ⚠️ `>101%` = Content overflow (will be clipped)
- ⚠️ `<95%` = Wasted space (except last page)

### **2. Visual Inspection**

- [ ] No content clipping at page bottoms
- [ ] Section titles appear with content
- [ ] Lists don't break mid-item
- [ ] Consistent spacing between sections

### **3. Edge Cases to Test**

- Very long job descriptions (500+ characters)
- Many experiences (10+ items)
- Long skills lists (50+ skills)
- Mixed content types on same page

---

## Quick Reference Checklist

When creating a new template section:

- [ ] Use `<section class="section">` wrapper (only for semantic sections)
- [ ] Use `<h2 class="section-title">` for headers
- [ ] **CRITICAL**: Generate items with `.map().join('')` (NO wrapper div!)
- [ ] Never wrap repeating items in a container div
- [ ] Use `<ul>` for repeating items when possible
- [ ] Keep nesting shallow (max 3 levels)
- [ ] Avoid atomic blocks for content > 50px
- [ ] Add `margin-bottom` between items (15-25px)
- [ ] Test with long content and many items

### **The Golden Rule**
```javascript
// ❌ NEVER do this
return `<div>${items.map(...).join('')}</div>`

// ✅ ALWAYS do this
return items.map(...).join('')
```

---

## Example: Complete Experience Section

```javascript
// styles.js
export const styles = {
  sectionTitle: 'color: #0EA5E9; border-bottom: 2px solid #0EA5E9; padding-bottom: 5px; margin-bottom: 15px; font-size: 16px; font-weight: 600;',
  jobTitle: 'margin: 0; font-size: 16px; font-weight: 600; color: #333;',
  dateRange: 'font-size: 12px; color: #777; font-weight: 500; white-space: nowrap;',
  companyName: 'margin: 0 0 10px 0; font-size: 12px; color: #0EA5E9; font-weight: 500;',
  description: 'margin: 8px 0; font-size: 12px; line-height: 1.6;',
  achievementList: 'margin: 8px 0; padding-left: 20px; line-height: 1.4;',
  achievementItem: 'margin-bottom: 6px; font-size: 12px;'
}

// template.vue
const generateExperienceSection = (experiences) => {
  if (!experiences?.length) return ''
  
  // Section title
  const header = `
    <section class="section">
      <h2 class="section-title" style="${styles.sectionTitle}">
        Professional Experience
      </h2>
    </section>
  `
  
  // Individual experience items (splittable)
  const items = experiences.map(exp => `
    <div class="experience-item" style="margin-bottom: 25px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <h3 style="${styles.jobTitle}">${exp.job_title}</h3>
        <span style="${styles.dateRange}">
          ${formatDateRange(exp.start_date, exp.end_date)}
        </span>
      </div>
      <p style="${styles.companyName}">
        ${exp.company}${exp.location ? ` • ${exp.location}` : ''}
      </p>
      <div class="description" style="${styles.description}">
        ${exp.description}
      </div>
      ${exp.achievements?.length ? `
        <ul style="${styles.achievementList}">
          ${exp.achievements.map(a => `
            <li style="${styles.achievementItem}">${a}</li>
          `).join('')}
        </ul>
      ` : ''}
    </div>
  `).join('')
  
  return header + items
}

// Usage in mainContent
const mainContent = computed(() => {
  return [
    generateExperienceSection(props.resumeData.experiences),
    generateProjectsSection(props.resumeData.projects),
    generateEducationSection(props.resumeData.education)
  ].filter(Boolean).join('')
})
```

---

## Need Help?

If content still overflows after following these guidelines:

1. **Check console logs** - Which pages have issues?
2. **Inspect the HTML** - Use the "Log Page HTML" debug button
3. **Simplify the structure** - Remove unnecessary wrapper divs
4. **Break large blocks** - Split experience items further
5. **Use lists** - Convert grouped content to `<ul>` when possible

The paginator is designed to split almost any content, but it works best with semantic, flat structures!
