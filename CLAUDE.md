# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Nuxt 4 application for generating professional resume and cover letter templates. The application allows users to select from various templates, customize them with their data, and generate PDFs using Paged.js for print media pagination.

## Development Commands

```bash
# Install dependencies
cd app && npm install

# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Generate static site
npm run generate
```

## Architecture

### Directory Structure

- **`app/app/`** - Main Nuxt application code
  - **`app.vue`** - Root component with global styles and template navigation
  - **`pages/`** - Nuxt pages (auto-routed)
    - `index.vue` - Main page with tabbed navigation for resume and cover letter templates
    - `brightpath.vue` - Standalone template page with Paged.js integration
  - **`components/`** - Vue components
    - `html/templates/` - Static HTML resume templates (`.html` files)
    - `html/templates/coverletter/` - Static HTML cover letter templates
    - `Templates/` - Vue template components (referenced but not in repo yet)
  - **`assets/css/`** - Global CSS including fonts.css

- **`app/utils/`** - Utility functions
  - `fonts.js` - Centralized font management with template-specific font combinations

- **`app/public/`** - Static assets served directly

### Key Technologies

- **Nuxt 4** - Vue.js framework with auto-routing and server-side rendering
- **Pinia** - State management (configured via `@pinia/nuxt` module)
- **Paged.js** - CSS Paged Media polyfill for PDF generation and print layouts
- **SCSS** - For component styling (configured with `sass-embedded`)

### Template System

The application has two main template types:

1. **Resume Templates** - HTML-based templates in `app/components/html/templates/`
   - Static HTML files with embedded styles
   - Examples: BrightPath.html, Beige.html, Clarity.html, etc.
   - Vue component wrappers: ClassicTemplates, ModernBoxedTemplate, BrightPathTemplateHeaderOnce

2. **Cover Letter Templates** - HTML templates in `app/components/html/templates/coverletter/`
   - Paired with corresponding resume templates
   - Vue component: ClassicCoverLetter

### Font Management

The `utils/fonts.js` module provides:
- Predefined font families (FONTS object)
- Template-specific font combinations (TEMPLATE_FONTS)
- Font categories for UI selection (FONT_CATEGORIES)
- Helper functions: `getTemplateFonts()`, `getTemplateFont()`, `getSafeFont()`

All fonts are loaded via Google Fonts with common weights (300, 400, 600/700).

### PDF Generation

PDF generation uses Paged.js, which applies CSS Paged Media rules:
- Page breaks are controlled via CSS (`break-before`, `break-after`, `break-inside`)
- Page size is typically A4 (210mm × 297mm)
- Paged.js transforms HTML into paginated layout suitable for printing

See `app/pages/brightpath.vue` for a working example of Paged.js integration.

### Data Flow

Templates expect structured resume/cover letter data with these main sections:
- **personalInfo/contact_information** - Name, title, contact details
- **summary** - Professional summary text
- **skills** - Array of skills with proficiency levels
- **languages** - Array of languages with proficiency
- **experiences** - Work history with HTML-formatted descriptions
- **education** - Degrees with dates and descriptions
- **projects** - Project portfolio with technologies used

Mock data is currently defined in `app/pages/index.vue`.

## Working with Templates

When creating or modifying templates:

1. **HTML Templates** - Place static HTML templates in `app/components/html/templates/`
   - Include all styles inline or in `<style>` tags
   - Use semantic HTML for better Paged.js pagination
   - Test with Paged.js CSS rules for page breaks

2. **Vue Template Components** - Create wrapper components that:
   - Accept `resume-data`, `template-config`, and `font-family` props
   - Emit `page-change` events for pagination tracking
   - Handle Paged.js initialization if using print media

3. **Font Selection** - Use the fonts utility module:
   ```javascript
   import { FONTS, getTemplateFonts } from '@/utils/fonts.js'
   ```

4. **Gallery Registration** - Add new templates to TemplateGallery.vue or CoverLetterGallery.vue

## Nuxt Configuration

The `nuxt.config.ts` is minimal:
- Uses Pinia module for state management
- Global CSS imports fonts.css
- Compatibility date set to 2025-07-15

TypeScript configuration uses Nuxt's project references pattern (see `tsconfig.json`).

## Common Patterns

- **Tab Navigation** - Main page uses reactive `activeTab` to switch between resume and cover letter views
- **Template Selection** - Gallery emits `template-selected` event with template object
- **Back Navigation** - Template view includes back button that resets selected template
- **PDF Generation** - Async function with loading state (`isGeneratingPDF`)
- for all the template please make sure to inlude all part of @app/app/components/html/templates/resume.json including birthDate, nationality,relationshipStatus,drivingLicense,websitesAndSocialLinks