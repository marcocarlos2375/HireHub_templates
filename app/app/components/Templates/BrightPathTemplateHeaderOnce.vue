<template>
  <BaseTemplate 
    :paginator-type="props.templateConfig.paginatorType"
    :header-content="headerContent"
    :left-content="leftContent"
    :right-content="rightContent"
    :background-color="templateBackgroundColor"
    :text-color="templateTextColor"
    :padding="templatePadding"
    :header-bg-color="headerBgColor"
    :left-column-bg-color="leftColumnBgColor"
    :right-column-bg-color="rightColumnBgColor"
    :font-family="props.fontFamily"
    @page-change="handlePageChange"
    ref="baseTemplate"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseTemplate from './BaseTemplate.vue'
import { useResumeDataStore } from '../../../stores/resumeData.js'

const props = defineProps({
  resumeData: {
    type: Object,
    required: true
  },
  templateConfig: {
    type: Object,
    default: () => ({
      id: 'brightpath-header-once',
      name: 'BrightPath (Header Once)',
      paginatorType: 'twoColsHeaderOnce',
      primaryColor: '#fff', // Yellow
      headerColor: '#fff',
      backgroundColor: '#f9f9f9'
    })
  },
  fontFamily: {
    type: String,
    default: 'Josefin Sans, sans-serif'
  },
  activeSection: {
    type: String,
    default: null
  },
  currentPage: {
    type: Number,
    default: 1
  }
})

// Define emits
const emit = defineEmits(['page-change'])

// Get store data
const resumeStore = useResumeDataStore()

// Base font size
const baseFontSize = 12

// Colors from BrightPath template
const primaryColor = '#e6b800'
const secondaryColor = '#f8f4e6'
const textColor = '#2c2c2c'
const lightTextColor = '#555'

// Styles inspired by BrightPath
const styles = {
  sectionTitle: `color: ${primaryColor}; font-size: ${baseFontSize + 4}px; font-weight: 600; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;`,
  timeline: 'position: relative; padding-left: 20px; border-left: 2px solid ' + primaryColor + ';',
  timelineDot: `position: absolute; left: -6px; top: 5px; width: 10px; height: 10px; background-color: ${primaryColor}; border-radius: 50%;`,
  contactTable: `width: 100%; font-size: ${baseFontSize}px; line-height: 1.8;`,
  skillsTable: `width: 100%; font-size: ${baseFontSize}px; line-height: 1.6;`,
  level: `color: ${primaryColor}; font-weight: 600;`
}

// Generate Header HTML
const headerContent = computed(() => {
  const contact = props.resumeData.contact_information || {}
  return `
    <div style="text-align: center; padding: 20px;">
      <h1 style="margin: 0; font-size: 32px; font-weight: 600; color: ${textColor};">
        ${contact.first_name || ''} ${contact.last_name || ''}
      </h1>
      <p style="margin: 5px 0 0 0; font-size: 18px; color: ${lightTextColor};">
        ${contact.job_title || 'Software Engineer'}
      </p>
    </div>
  `
})

// Generate LEFT column content (sidebar)
const leftContent = computed(() => {
  console.log('🔵 BrightPath - Generating LEFT content')
  console.log('Contact:', props.resumeData.contact_information)
  console.log('Skills:', props.resumeData.skills)
  console.log('Languages:', props.resumeData.languages)
  
  const sections = []
  const contact = props.resumeData.contact_information || {}
  const skills = props.resumeData.skills || []
  const languages = props.resumeData.languages || []
  
  // Contact Section
  sections.push(`
    <section style="margin-bottom: 25px;">
      <h2 style="${styles.sectionTitle}">Contact</h2>
      <table style="${styles.contactTable}">
        ${contact.phone_number ? `<tr><td><strong>Phone:</strong></td><td>${contact.phone_number}</td></tr>` : ''}
        ${contact.email ? `<tr><td><strong>Email:</strong></td><td>${contact.email}</td></tr>` : ''}
        ${contact.location ? `<tr><td><strong>Location:</strong></td><td>${contact.location}</td></tr>` : ''}
        ${contact.portfolio_url ? `<tr><td><strong>Portfolio:</strong></td><td>${contact.portfolio_url}</td></tr>` : ''}
        ${contact.linkedin_url ? `<tr><td><strong>LinkedIn:</strong></td><td>${contact.linkedin_url}</td></tr>` : ''}
      </table>
    </section>
  `)
  
  // Technical Skills Section
  if (skills.length > 0) {
    const skillRows = skills.map(skill => `
      <tr>
        <td>${skill.name}</td>
        <td style="${styles.level}">${skill.proficiency || 'Advanced'}</td>
      </tr>
    `).join('')
    
    sections.push(`
      <section style="margin-bottom: 25px;">
        <h2 style="${styles.sectionTitle}">Technical Skills</h2>
        <table style="${styles.skillsTable}">
          ${skillRows}
        </table>
      </section>
    `)
  }
  
  // Languages Section
  if (languages.length > 0) {
    const langRows = languages.map(lang => `
      <tr>
        <td>${lang.language}</td>
        <td style="${styles.level}">${lang.proficiency || 'Fluent'}</td>
      </tr>
    `).join('')
    
    sections.push(`
      <section style="margin-bottom: 25px;">
        <h2 style="${styles.sectionTitle}">Languages</h2>
        <table style="${styles.skillsTable}">
          ${langRows}
        </table>
      </section>
    `)
  }
  
  const result = sections.join('')
  console.log('🔵 LEFT Content length:', result.length)
  console.log('🔵 LEFT Content preview:', result.substring(0, 200))
  return result
})

// Generate RIGHT column content (main content)
const rightContent = computed(() => {
  console.log('🟢 BrightPath - Generating RIGHT content')
  console.log('Summary:', props.resumeData.summary)
  console.log('Experiences:', props.resumeData.experiences)
  console.log('Education:', props.resumeData.education)
  console.log('Projects:', props.resumeData.projects)
  
  const sections = []
  const summary = props.resumeData.summary || ''
  const experiences = props.resumeData.experiences || []
  const education = props.resumeData.education || []
  const projects = props.resumeData.projects || []
  
  // Professional Summary
  if (summary) {
    sections.push(`
      <section style="margin-bottom: 30px;">
        <h2 style="${styles.sectionTitle}">Professional Summary</h2>
        <p style="font-size: ${baseFontSize}px; line-height: 1.6; color: ${textColor};">
          ${summary}
        </p>
      </section>
    `)
  }
  
  // Education Section with Timeline
  if (education.length > 0) {
    const eduItems = education.map(edu => `
      <div style="position: relative; margin-bottom: 20px; padding-left: 20px; border-left: 2px solid ${primaryColor};">
        <div style="${styles.timelineDot}"></div>
        <h3 style="margin: 0 0 5px 0; font-size: ${baseFontSize + 2}px; font-weight: 600; color: ${textColor};">
          ${edu.degree}
        </h3>
        <p style="margin: 0 0 8px 0; font-size: ${baseFontSize}px; color: ${lightTextColor}; font-style: italic;">
          ${edu.institution} — ${edu.start_date} - ${edu.end_date}
        </p>
        ${edu.description ? `<p style="margin: 0; font-size: ${baseFontSize}px; line-height: 1.6;">${edu.description}</p>` : ''}
      </div>
    `).join('')
    
    sections.push(`
      <section style="margin-bottom: 30px;">
        <h2 style="${styles.sectionTitle}">Education</h2>
        ${eduItems}
      </section>
    `)
  }
  
  // Experience Section with Timeline
  if (experiences.length > 0) {
    const expItems = experiences.map(exp => `
      <div style="position: relative; margin-bottom: 20px; padding-left: 20px; border-left: 2px solid ${primaryColor};">
        <div style="${styles.timelineDot}"></div>
        <h3 style="margin: 0 0 5px 0; font-size: ${baseFontSize + 2}px; font-weight: 600; color: ${textColor};">
          ${exp.job_title}
        </h3>
        <p style="margin: 0 0 8px 0; font-size: ${baseFontSize}px; color: ${lightTextColor}; font-style: italic;">
          ${exp.company} — ${exp.start_date} - ${exp.end_date}
        </p>
        ${exp.description || ''}
      </div>
    `).join('')
    
    sections.push(`
      <section style="margin-bottom: 30px;">
        <h2 style="${styles.sectionTitle}">Experience</h2>
        ${expItems}
      </section>
    `)
  }
  
  // Projects Section
  if (projects.length > 0) {
    const projectItems = projects.map(proj => `
      <div style="position: relative; margin-bottom: 20px; padding-left: 20px; border-left: 2px solid ${primaryColor};">
        <div style="${styles.timelineDot}"></div>
        <h3 style="margin: 0 0 5px 0; font-size: ${baseFontSize + 2}px; font-weight: 600; color: ${textColor};">
          ${proj.title}
        </h3>
        <p style="margin: 0 0 5px 0; font-size: ${baseFontSize}px; color: ${lightTextColor}; font-style: italic;">
          ${proj.organization || ''} — ${proj.start_date} - ${proj.end_date}
        </p>
        ${proj.technologies?.length ? `<p style="margin: 0 0 8px 0; font-size: ${baseFontSize - 1}px;"><strong>Technologies:</strong> ${proj.technologies.join(', ')}</p>` : ''}
        ${proj.description || ''}
      </div>
    `).join('')
    
    sections.push(`
      <section style="margin-bottom: 30px;">
        <h2 style="${styles.sectionTitle}">Key Projects</h2>
        ${projectItems}
      </section>
    `)
  }
  
  const result = sections.join('')
  console.log('🟢 RIGHT Content length:', result.length)
  console.log('🟢 RIGHT Content preview:', result.substring(0, 200))
  return result
})

// Template colors
const templateBackgroundColor = computed(() => props.templateConfig.backgroundColor || '#f9f9f9')
const templateTextColor = computed(() => '#2c2c2c')
const headerBgColor = computed(() => secondaryColor)
const leftColumnBgColor = computed(() => secondaryColor)
const rightColumnBgColor = computed(() => '#ffffff')
const templatePadding = computed(() => ({
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
}))

// Handle page change
const handlePageChange = (page) => {
  emit('page-change', page)
}
</script>
