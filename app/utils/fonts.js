/**
 * Font Management Utilities
 * Centralized font definitions and helper functions
 */

// Font definitions matching the CSS variables
export const FONTS = {
  // Primary Fonts
  PRIMARY: 'Gabarito, sans-serif',
  SECONDARY: 'Inter, sans-serif',
  
  // Professional Fonts
  PROFESSIONAL: 'Inter, sans-serif',
  CORPORATE: 'Roboto, sans-serif',
  EXECUTIVE: 'Montserrat, sans-serif',
  CLASSIC: 'Source Sans Pro, sans-serif',
  
  // Modern Fonts
  MODERN: 'Poppins, sans-serif',
  CONTEMPORARY: 'Nunito, sans-serif',
  SLEEK: 'Lato, sans-serif',
  
  // Creative Fonts
  CREATIVE: 'Raleway, sans-serif',
  ARTISTIC: 'Poppins, sans-serif',
  UNIQUE: 'Montserrat, sans-serif',
  
  // Readable Fonts
  READABLE: 'Open Sans, sans-serif',
  CLEAN: 'Source Sans Pro, sans-serif',
  MINIMAL: 'Inter, sans-serif',
  
  // Special Fonts
  WIX_MADEFOR: 'Wix Madefor Text, sans-serif',
  
  // Fallback
  FALLBACK: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
}

// Template-specific font combinations
export const TEMPLATE_FONTS = {
  classic: {
    id: 'classic',
    name: 'Classic Professional',
    header: FONTS.PROFESSIONAL,
    body: FONTS.PROFESSIONAL,
    accent: FONTS.PROFESSIONAL,
    description: 'Clean and professional typography perfect for corporate positions'
  },
  modern: {
    id: 'modern',
    name: 'Modern Two Column',
    header: FONTS.MODERN,
    body: FONTS.MODERN,
    accent: FONTS.SLEEK,
    description: 'Contemporary fonts with a fresh, modern appeal'
  },
  executive: {
    id: 'executive',
    name: 'Executive Header',
    header: FONTS.EXECUTIVE,
    body: FONTS.CORPORATE,
    accent: FONTS.EXECUTIVE,
    description: 'Sophisticated typography for leadership positions'
  },
  minimalist: {
    id: 'minimalist',
    name: 'Minimalist',
    header: FONTS.MINIMAL,
    body: FONTS.CLEAN,
    accent: FONTS.MINIMAL,
    description: 'Simple, clean fonts focusing on readability'
  },
  creative: {
    id: 'creative',
    name: 'Creative Professional',
    header: FONTS.CREATIVE,
    body: FONTS.ARTISTIC,
    accent: FONTS.UNIQUE,
    description: 'Expressive typography for creative professionals'
  },
  tech: {
    id: 'tech',
    name: 'Tech Specialist',
    header: FONTS.CONTEMPORARY,
    body: FONTS.READABLE,
    accent: FONTS.SLEEK,
    description: 'Modern, tech-focused typography'
  }
}

// Font categories for selection UI
export const FONT_CATEGORIES = {
  professional: {
    name: 'Professional',
    fonts: [
      { name: 'Inter', value: FONTS.PROFESSIONAL, preview: 'Professional & Clean' },
      { name: 'Roboto', value: FONTS.CORPORATE, preview: 'Corporate Standard' },
      { name: 'Source Sans Pro', value: FONTS.CLASSIC, preview: 'Classic & Reliable' }
    ]
  },
  modern: {
    name: 'Modern',
    fonts: [
      { name: 'Poppins', value: FONTS.MODERN, preview: 'Modern & Friendly' },
      { name: 'Nunito', value: FONTS.CONTEMPORARY, preview: 'Contemporary Style' },
      { name: 'Lato', value: FONTS.SLEEK, preview: 'Sleek & Minimal' }
    ]
  },
  creative: {
    name: 'Creative',
    fonts: [
      { name: 'Raleway', value: FONTS.CREATIVE, preview: 'Creative & Elegant' },
      { name: 'Montserrat', value: FONTS.UNIQUE, preview: 'Unique Character' },
      { name: 'Gabarito', value: FONTS.PRIMARY, preview: 'Distinctive & Bold' }
    ]
  },
  readable: {
    name: 'Highly Readable',
    fonts: [
      { name: 'Open Sans', value: FONTS.READABLE, preview: 'Maximum Readability' },
      { name: 'Inter', value: FONTS.MINIMAL, preview: 'Clean & Minimal' }
    ]
  }
}

/**
 * Get font configuration for a specific template
 * @param {string} templateId - The template identifier
 * @returns {object} Font configuration object
 */
export function getTemplateFonts(templateId) {
  return TEMPLATE_FONTS[templateId] || TEMPLATE_FONTS.classic
}

/**
 * Get the primary font for a template
 * @param {string} templateId - The template identifier
 * @returns {string} Font family string
 */
export function getTemplateFont(templateId) {
  const config = getTemplateFonts(templateId)
  return config.body || FONTS.PRIMARY
}

/**
 * Get all available fonts as an array
 * @returns {Array} Array of font objects
 */
export function getAllFonts() {
  return Object.entries(FONTS).map(([key, value]) => ({
    id: key.toLowerCase(),
    name: key.charAt(0) + key.slice(1).toLowerCase().replace(/_/g, ' '),
    value: value
  }))
}

/**
 * Validate if a font family string is supported
 * @param {string} fontFamily - Font family string to validate
 * @returns {boolean} Whether the font is supported
 */
export function isSupportedFont(fontFamily) {
  return Object.values(FONTS).includes(fontFamily)
}

/**
 * Get fallback font if the provided font is not supported
 * @param {string} fontFamily - Font family string
 * @returns {string} Supported font family or fallback
 */
export function getSafeFont(fontFamily) {
  return isSupportedFont(fontFamily) ? fontFamily : FONTS.FALLBACK
}

/**
 * Generate CSS custom properties for a template's fonts
 * @param {string} templateId - The template identifier
 * @returns {object} CSS custom properties object
 */
export function getTemplateCSSVars(templateId) {
  const fonts = getTemplateFonts(templateId)
  return {
    '--template-font-header': fonts.header,
    '--template-font-body': fonts.body,
    '--template-font-accent': fonts.accent
  }
}

/**
 * Preload fonts for better performance
 * @param {Array} fontFamilies - Array of font family strings to preload
 */
export function preloadFonts(fontFamilies = []) {
  fontFamilies.forEach(fontFamily => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'font'
    link.type = 'font/woff2'
    link.crossOrigin = 'anonymous'
    
    // Extract font name for Google Fonts URL
    const fontName = fontFamily.split(',')[0].replace(/['"]/g, '').replace(/ /g, '+')
    link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@300;400;500;600;700&display=swap`
    
    document.head.appendChild(link)
  })
}

/**
 * Apply font loading class for better UX
 */
export function initFontLoading() {
  document.documentElement.classList.add('font-loading')
  
  // Remove loading class when fonts are loaded
  document.fonts.ready.then(() => {
    document.documentElement.classList.remove('font-loading')
    document.documentElement.classList.add('fonts-loaded')
  })
}
