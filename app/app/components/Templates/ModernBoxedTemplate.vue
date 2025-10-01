<template>
  <BaseTemplate 
    :paginator-type="props.templateConfig.paginatorType"
    :header-content="headerContent"
    :main-content="mainContent"
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
      id: 'modern-boxed',
      name: 'Modern Boxed',
      paginatorType: 'twoColsWithHeader',
      headerColor: '#000000',
      primaryColor: '#ffffff',
      accentColor: '#000000'
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

// Base font size for consistent scaling
const baseFontSize = 12.5 // Base font size in px

// CSS Classes for consistent styling
const styles = {
  sectionTitle: `font-size: 14px; font-weight: 600; border-bottom: 2px solid #000; padding-bottom: 3px; margin: 25px 0 10px 0; text-transform: uppercase;`,
  subTitle: `font-size: 13px; font-weight: 600; margin: 10px 0 5px 0; color: #000;`,
  bodyText: `font-size: ${baseFontSize}px; line-height: 1.5; margin: 0 0 10px 0; color: #333;`,
  dateText: `font-size: 12px; color: #777; display: inline-block; margin-right: 10px;`,
  locationText: `font-size: 12px; color: #777; display: inline-block;`,
  contactLabel: `font-weight: 600; color: #000;`,
  skillName: `font-size: ${baseFontSize}px; color: #000;`,
  linkColor: '#000'
}

// Generate contact info for left column
const generateContactHTML = (contact) => {
  const contacts = []
  
  if (contact.location) {
    contacts.push(`<p><span style="${styles.contactLabel}">Address</span><br>${contact.location}</p>`)
  }
  if (contact.phone_number || contact.phone) {
    contacts.push(`<p><span style="${styles.contactLabel}">Phone</span><br>${contact.phone_number || contact.phone}</p>`)
  }
  if (contact.email) {
    contacts.push(`<p><span style="${styles.contactLabel}">Email</span><br>${contact.email}</p>`)
  }
  if (contact.linkedin_url || contact.linkedin) {
    contacts.push(`<p><span style="${styles.contactLabel}">LinkedIn</span><br>${contact.linkedin_url || contact.linkedin}</p>`)
  }
  if (contact.portfolio_url || contact.portfolio) {
    contacts.push(`<p><span style="${styles.contactLabel}">Portfolio</span><br>${contact.portfolio_url || contact.portfolio}</p>`)
  }
  
  return contacts.join('')
}

// Generate skills with dot rating system
const generateSkillsHTML = (skills) => {
  if (Array.isArray(skills)) {
    return skills.map(skill => {
      const skillLevel = 3 // Default level
      const dots = Array.from({length: 5}, (_, i) => 
        `<div class="dot${i < skillLevel ? ' filled' : ''}"></div>`
      ).join('')
      
      return `
        <div style="display: flex; justify-content: space-between; align-items: center; margin: 6px 0;">
          <span style="${styles.skillName}">${typeof skill === 'string' ? skill : skill.name}</span>
          <div style="display: flex; gap: 4px;">
            ${dots}
          </div>
        </div>
      `
    }).join('')
  }
  return Object.entries(skills).map(([category, skillList]) => `
    ${skillList.map(skill => {
      const skillLevel = skill.level || 3
      const dots = Array.from({length: 5}, (_, i) => 
        `<div class="dot${i < skillLevel ? ' filled' : ''}"></div>`
      ).join('')
      
      return `
        <div style="display: flex; justify-content: space-between; align-items: center; margin: 6px 0;">
          <span style="${styles.skillName}">${typeof skill === 'string' ? skill : skill.name}</span>
          <div style="display: flex; gap: 4px;">
            ${dots}
          </div>
        </div>
      `
    }).join('')}
  `).join('')
}

// Generate experience for right column
const generateExperienceHTML = (experiences) => {
  return experiences.map(exp => `
    <div style="margin-bottom: 20px;">
      <h4 style="${styles.subTitle}">${exp.job_title} at ${exp.company}</h4>
      <div style="margin-bottom: 5px;">
        <span style="${styles.dateText}">${exp.start_date} — ${exp.end_date}</span>
        <span style="${styles.locationText}">${exp.location || ''}</span>
      </div>
      ${exp.description}
    </div>
  `).join('')
}

// Generate education for right column
const generateEducationHTML = (education) => {
  return education.map(edu => `
    <div style="margin-bottom: 15px;">
      <h4 style="${styles.subTitle}">${edu.degree}</h4>
      <div style="margin-bottom: 5px;">
        <span style="${styles.dateText}">${edu.start_date} — ${edu.end_date}</span>
        <span style="${styles.locationText}">${edu.institution}</span>
      </div>
      ${edu.description || ''}
    </div>
  `).join('')
}

// Generate projects
const generateProjectsHTML = (projects) => {
  return projects.map(project => `
    <div style="margin-bottom: 20px;">
      <h4 style="${styles.subTitle}">${project.title}</h4>
      <div style="margin-bottom: 5px;">
        <span style="${styles.dateText}">${project.start_date} — ${project.end_date}</span>
        <span style="${styles.locationText}">${project.organization}</span>
      </div>
      ${project.description}
      ${project.technologies ? `<p style="margin-top: 5px;"><strong>Technologies:</strong> ${project.technologies.join(', ')}</p>` : ''}
    </div>
  `).join('')
}

// Header content with bordered box design
const headerContent = computed(() => {
  const contact = props.resumeData.contact_information || {}
  const name = `${contact.first_name || ''} ${contact.last_name || ''}`.trim() || props.resumeData.personalInfo?.name || ''
  const title = contact.job_title || props.resumeData.personalInfo?.title || ''
  
  return `
    <div style="border: 2px solid #000; text-align: center; padding: 20px; margin-bottom: 30px; background: #fff;">
      <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #000;">${name}</h1>
      <h2 style="margin: 5px 0 0; font-size: 14px; font-weight: 400; text-transform: uppercase; letter-spacing: 1px; color: #555;">${title}</h2>
    </div>
  `
})

// Left column content
const leftContent = computed(() => {
  const contact = props.resumeData.contact_information || props.resumeData.personalInfo || {}
  const skills = props.resumeData.skills || []
  
  let content = `
    <h3 style="${styles.sectionTitle}">Info</h3>
    ${generateContactHTML(contact)}
  `
  
  if (skills && (Array.isArray(skills) ? skills.length > 0 : Object.keys(skills).length > 0)) {
    content += `
      <h3 style="${styles.sectionTitle}">Skills</h3>
      <div id="skills">
        ${generateSkillsHTML(skills)}
      </div>
    `
  }
  
  return content
})

// Right column content
const rightContent = computed(() => {
  const summary = props.resumeData.summary || props.resumeData.personalInfo?.summary || ''
  const experiences = props.resumeData.experiences || props.resumeData.experience || []
  const education = props.resumeData.education || []
  const projects = props.resumeData.projects || []
  
  let content = ''
  
  // Professional Summary
  if (summary) {
    content += `
      <h3 style="${styles.sectionTitle}">Profile</h3>
      <p style="${styles.bodyText}">${summary}</p>
    `
  }
  
  // Experience
  if (experiences && experiences.length > 0) {
    content += `
      <h3 style="${styles.sectionTitle}">Employment</h3>
      ${generateExperienceHTML(experiences)}
    `
  }
  
  // Projects
  if (projects && projects.length > 0) {
    content += `
      <h3 style="${styles.sectionTitle}">Projects</h3>
      ${generateProjectsHTML(projects)}
    `
  }
  
  // Education
  if (education && education.length > 0) {
    content += `
      <h3 style="${styles.sectionTitle}">Education</h3>
      ${generateEducationHTML(education)}
    `
  }
  
  return content
})

// Main content (empty for two-column layout)
const mainContent = computed(() => '')

// Template styling properties
const templatePadding = computed(() => ({
  top: 20,
  right: 20,
  bottom: 20,
  left: 20
}))

const templateBackgroundColor = computed(() => props.templateConfig.primaryColor || '#ffffff')
const templateTextColor = computed(() => '#000000')
const headerBgColor = computed(() => '#ffffff')
const leftColumnBgColor = computed(() => '#ffffff')
const rightColumnBgColor = computed(() => '#ffffff')

// Page change handler
const handlePageChange = (page) => {
  emit('page-change', page)
}

// Date formatting helper
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}
</script>

<style scoped>
/* Dot rating system for skills */
:deep(.dot) {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ccc;
}

:deep(.dot.filled) {
  background: #000;
}

/* Ensure proper spacing and typography */
:deep(h1), :deep(h2), :deep(h3), :deep(h4) {
  font-family: 'Josefin Sans', sans-serif;
}

:deep(p), :deep(span), :deep(div) {
  font-family: 'Josefin Sans', sans-serif;
}

/* Override any default margins */
:deep(h1) {
  margin: 0;
}

:deep(h2) {
  margin: 5px 0 0;
}

:deep(h3) {
  margin: 25px 0 10px;
}

:deep(h4) {
  margin: 10px 0 5px;
}

:deep(p) {
  margin: 0 0 10px;
}
</style>
