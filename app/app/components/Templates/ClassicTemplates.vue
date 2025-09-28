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
      id: 'classic',
      name: 'Classic Professional',
      paginatorType: 'oneColHeader',
      headerColor: '#0EA5E9',
      primaryColor: '#ffffff'
    })
  },
  fontFamily: {
    type: String,
    default: 'Wix Madefor Text, sans-serif'
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
const baseFontSize = 12 // Base font size in px

// Description styling for WYSIWYG content
const descriptionStyle = `font-size: ${baseFontSize}px; margin: 5px 0;`

// CSS Classes for consistent styling
const styles = {
  sectionTitle: `color: #0EA5E9; border-bottom: 2px solid #0EA5E9; padding-bottom: 5px; margin-bottom: 15px; font-size: ${baseFontSize + 4}px; font-weight: 600;`,
  jobTitle: `margin: 0; font-size: ${baseFontSize + 2}px; font-weight: 600; color: #333;`,
  dateRange: `font-size: ${baseFontSize}px; color: #777; font-weight: 500;`,
  companyName: `margin: 0 0 8px 0; font-size: ${baseFontSize}px; color: #0EA5E9; font-weight: 500;`,
  achievementList: 'margin: 8px 0; padding-left: 20px; line-height: 1.4;',
  achievementItem: `margin-bottom: 6px; font-size: ${baseFontSize}px;`,
  skillCategory: `margin: 0 0 10px 0; font-size: ${baseFontSize}px; font-weight: 600; color: #333;`,
  skillTag: `background-color: #f0f0f0; padding: 4px 10px; border-radius: 8px; font-size: ${baseFontSize}px; color: #333;`,
  skillContainer: 'display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 15px;',
  linkColor: '#0EA5E9'
}

const generateExperienceHTML = (experiences) => {
  return experiences.map(exp => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <h3 style="margin: 0; font-size: ${baseFontSize + 4}px;">${exp.company}</h3>
          <span style="font-size: ${baseFontSize}px; color: #777; font-weight: 500;">${exp.start_date} - ${exp.end_date}</span>
        </div>
        <p style="margin: 5px 0 15px 0; font-weight: bold;">${exp.job_title}</p>
${exp.description}
        <div style="margin-bottom: 25px;"></div>
    `).join('')
}

const generateEducationHTML = (education) => {
  return education.map(edu => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <h3 style="margin: 0; font-size: ${baseFontSize + 3}px;">${edu.institution}</h3>
          <span style="font-size: ${baseFontSize}px; color: #777; font-weight: 500;">${edu.start_date} - ${edu.end_date}</span>
        </div>
        <p style="margin: 5px 0 10px 0; font-weight: 500;">${edu.degree}</p>
${edu.description}
        <div style="margin-bottom: 20px;"></div>
    `).join('')
}

const generateSkillsHTML = (skills) => {
  return Object.entries(skills).map(([category, skillList]) => `
        <h3 style="${styles.skillCategory}">${category}</h3>
        <div style="${styles.skillContainer}">
          ${skillList.map(skill => `
            <span style="${styles.skillTag}">${skill}</span>
          `).join('')}
        </div>
        <div style="margin-bottom: 15px;"></div>
    `).join('')
}

const generateProjectsHTML = (projects) => {
  return projects.map(project => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <h3 style="margin: 0; font-size: ${baseFontSize + 2}px; font-weight: 600; color: #333;">${project.title}</h3>
          <span style="font-size: ${baseFontSize}px; color: #777; font-weight: 500;">${project.start_date} - ${project.end_date}</span>
        </div>
        <p style="margin: 5px 0; font-weight: 500; color: #555;">${project.role} • ${project.organization}</p>
        ${project.url ? `<p style="margin: 5px 0; font-size: ${baseFontSize - 1}px;"><a href="${project.url}" target="_blank" style="color: ${styles.linkColor}; text-decoration: none;">${project.url}</a></p>` : ''}
${project.description}
        <div style="margin: 8px 0 20px 0;">
          <strong style="font-size: ${baseFontSize}px;">Technologies:</strong>
          <span style="font-size: ${baseFontSize }px; color: #333; margin-left: 5px;">${project.technologies.join(', ')}</span>
        </div>
    `).join('')
}

const generatePublicationsHTML = (publications) => {
  return publications.map(pub => `
        <h3 style="margin: 0 0 5px 0; font-size: ${baseFontSize + 2}px; font-weight: 600; color: #333;">${pub.title}</h3>
        <p style="margin: 5px 0; font-weight: 500; color: ${styles.linkColor};">${pub.publisher} • ${pub.publication_date}</p>
        ${pub.url ? `<p style="margin: 5px 0; font-size: ${baseFontSize - 1}px;"><a href="${pub.url}" target="_blank" style="color: ${styles.linkColor}; text-decoration: none;">${pub.url}</a></p>` : ''}
${pub.description}
        <div style="margin-bottom: 20px;"></div>
    `).join('')
}

const generateCertificationsHTML = (certifications) => {
  return certifications.map(cert => `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <h3 style="margin: 0; font-size: ${baseFontSize}px; font-weight: 600; color: #333;">${cert.name}</h3>
          <span style="font-size: ${baseFontSize - 1}px; color: #777;">${cert.year}</span>
        </div>
    `).join('')
}

const generateLanguagesHTML = (languages) => {
  return languages.map(lang => `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <span style="font-size: ${baseFontSize}px; font-weight: 500; color: #333;">${lang.name}</span>
          <span style="font-size: ${baseFontSize - 1}px; color: #777;">${lang.level}</span>
        </div>
    `).join('')
}

const generateAwardsHTML = (awards) => {
  return awards.map(award => `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
          <div>
            <h3 style="margin: 0 0 4px 0; font-size: ${baseFontSize}px; font-weight: 600; color: #333;">${award.name}</h3>
            <p style="margin: 0; font-size: ${baseFontSize - 1}px; color: #666;">${award.organization}</p>
          </div>
          <span style="font-size: ${baseFontSize - 1}px; color: #777;">${award.year}</span>
        </div>
    `).join('')
}

const generateReferencesHTML = (references) => {
  return references.map(ref => `
        <h3 style="margin: 0 0 5px 0; font-size: ${baseFontSize + 2}px; font-weight: 600; color: #333;">${ref.full_name}</h3>
        <p style="margin: 5px 0; font-weight: 500; color: ${styles.linkColor};">${ref.position} • ${ref.company}</p>
        <p style="margin: 5px 0; font-size: ${baseFontSize}px; color: #666;">Relationship: ${ref.relationship}</p>
        <p style="margin: 2px 0; font-size: ${baseFontSize}px;">
          <strong>Email:</strong> <a href="mailto:${ref.email}" style="color: #555; text-decoration: none;">${ref.email}</a>
        </p>
        <p style="margin: 2px 0; font-size: ${baseFontSize}px;">
          <strong>Phone:</strong> <a href="tel:${ref.phone}" style="color: #555; text-decoration: none;">${ref.phone}</a>
        </p>
        <div style="margin-bottom: 20px;"></div>
    `).join('')
}

const generateCustomSectionsHTML = (customSections) => {
  return customSections.map(section => `
        <h2 style="${styles.sectionTitle}">${section.section_name}</h2>
        ${section.entries.map(entry => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <h3 style="margin: 0; font-size: ${baseFontSize + 2}px; font-weight: 600; color: #333;">${entry.title}</h3>
              <span style="font-size: ${baseFontSize}px; color: #777; font-weight: 500;">${entry.start_date} - ${entry.end_date}</span>
            </div>
            <p style="margin: 5px 0 10px 0; font-weight: 500; color: ${styles.linkColor};">${entry.city}</p>
${entry.description}
            <div style="margin-bottom: 20px;"></div>
        `).join('')}
        <div style="margin-bottom: 30px;"></div>
    `).join('')
}

// Template styling properties
const templatePadding = computed(() => ({
  top: 10,
  right: 10,
  bottom: 10,
  left: 10
}))
const templateBackgroundColor = computed(() => props.templateConfig.primaryColor || '#ffffff')
const templateTextColor = computed(() => '#333333')
const headerBgColor = computed(() => props.templateConfig.headerColor || '#0EA5E9')
const leftColumnBgColor = computed(() => props.templateConfig.headerColor || '#0EA5E9')
const rightColumnBgColor = computed(() => '#e9e9e9')

// Reference to the BaseTemplate component
const baseTemplate = ref(null)

// Generate header content
const headerContent = computed(() => {
  const { personalInfo } = props.resumeData

  return `
      <div style="display: flex; flex-direction: column; justify-content: center; height: 100%; padding: 20px 30px; color: white;">
        <div style="margin-bottom: 20px;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 500; letter-spacing: 0.5px; text-transform: uppercase;">${personalInfo?.name || 'Carlos Idriss Saez'}</h1>
          <p style="margin: 8px 0 0; font-size: 18px; font-weight: 500; opacity: 0.9;">${personalInfo?.title || 'Software Engineer'}</p>
        </div>
        
        <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 10px; font-size: 13px; font-weight: 400; line-height: 0.8;">
          ${personalInfo?.email ? `<div style="display: flex; align-items: center;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px; opacity: 0.8;">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span>${personalInfo.email}</span>
          </div>` : ''}
          
          ${personalInfo?.phone ? `<div style="display: flex; align-items: center;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px; opacity: 0.8;">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span>${personalInfo.phone}</span>
          </div>` : ''}
          
          ${personalInfo?.location ? `<div style="display: flex; align-items: center;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px; opacity: 0.8;">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>${personalInfo.location}</span>
          </div>` : ''}
          
          ${personalInfo?.linkedin ? `<div style="display: flex; align-items: center;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px; opacity: 0.8;">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect x="2" y="9" width="4" height="12"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
            <span>${personalInfo.linkedin}</span>
          </div>` : ''}
          
          ${personalInfo?.portfolio ? `<div style="display: flex; align-items: center;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px; opacity: 0.8;">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
            <span>${personalInfo.portfolio}</span>
          </div>` : ''}
        </div>
      </div>
    `
})

// Generate main content only for single-column layout
const mainContent = computed(() => {
  // Only generate for single-column layout
  if (props.templateConfig.paginatorType !== 'oneColHeader') {
    return ''
  }
  // Generate sections using store data and HTML generation functions
  const summaryHTML = `
      <h2 style="${styles.sectionTitle}">Professional Summary</h2>
      <div style="margin-bottom: 20px;">
        <p style="margin: 10px 0; line-height: 1.5; font-size: 14px;">
          ${resumeStore.summary.text}
        </p>
      </div>
    `

  const experienceHTML = `
      <h2 style="${styles.sectionTitle}">Professional Experience</h2>
      ${generateExperienceHTML(resumeStore.experience)}
    `

  const educationHTML = `
      <h2 style="${styles.sectionTitle}">Education</h2>
      ${generateEducationHTML(resumeStore.education)}
    `

  const skillsHTML = `
      <h2 style="${styles.sectionTitle}">Technical Skills</h2>
      ${generateSkillsHTML(resumeStore.skills)}
    `

  const projectsHTML = `
      <h2 style="${styles.sectionTitle}">Key Projects</h2>
      ${generateProjectsHTML(resumeStore.projects)}
    `

  const publicationsHTML = `
      <h2 style="${styles.sectionTitle}">Publications</h2>
      ${generatePublicationsHTML(resumeStore.publications)}
    `

  const certificationsHTML = `
      <h2 style="${styles.sectionTitle}">Certifications</h2>
      ${generateCertificationsHTML(resumeStore.certifications)}
    `

  const languagesHTML = `
      <h2 style="${styles.sectionTitle}">Languages</h2>
      ${generateLanguagesHTML(resumeStore.languages)}
    `

  const awardsHTML = `
      <h2 style="${styles.sectionTitle}">Awards & Recognition</h2>
      ${generateAwardsHTML(resumeStore.awards)}
    `

  const referencesHTML = `
      <h2 style="${styles.sectionTitle}">References</h2>
      ${generateReferencesHTML(resumeStore.references)}
    `

  const customSectionsHTML = generateCustomSectionsHTML(resumeStore.customSections)

  // Combine all sections
  return `
      <div style="padding: 20px;">
        ${summaryHTML}
        ${experienceHTML}
        ${educationHTML}
        ${skillsHTML}
        ${projectsHTML}
        ${publicationsHTML}
        ${certificationsHTML}
        ${languagesHTML}
        ${awardsHTML}
        ${referencesHTML}
        ${customSectionsHTML}
      </div>
    `
})



// Handle page change
const handlePageChange = (page) => {
  emit('page-change', page)
}

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}
</script>

<style scoped></style>