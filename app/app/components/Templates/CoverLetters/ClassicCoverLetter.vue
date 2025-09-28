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
  import BaseTemplate from '../BaseTemplate.vue'
  
  const props = defineProps({
    coverLetterData: {
      type: Object,
      required: true
    },
    templateConfig: {
      type: Object,
      default: () => ({
        id: 'classic-cover',
        name: 'Classic Cover Letter',
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
  
  // Template styling properties
  const templatePadding = computed(() => ({
    top: 15,
    right: 15,
    bottom: 15,
    left: 15
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
    const { personalInfo } = props.coverLetterData
    
    return `
      <div style="display: flex; flex-direction: column; justify-content: center; height: 100%; padding: 20px 30px; color: white;">
        <div style="margin-bottom: 20px;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 500; letter-spacing: 0.5px; text-transform: uppercase;">${personalInfo.name || 'Carlos Idriss Saez'}</h1>
          <p style="margin: 8px 0 0; font-size: 18px; font-weight: 500; opacity: 0.9;">${personalInfo.title || 'Software Engineer'}</p>
        </div>
        
        <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 10px; font-size: 13px; font-weight: 400; line-height: 0.8;">
          ${personalInfo.email ? `<div style="display: flex; align-items: center;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px; opacity: 0.8;">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span>${personalInfo.email}</span>
          </div>` : ''}
          
          ${personalInfo.phone ? `<div style="display: flex; align-items: center;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px; opacity: 0.8;">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span>${personalInfo.phone}</span>
          </div>` : ''}
          
          ${personalInfo.location ? `<div style="display: flex; align-items: center;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px; opacity: 0.8;">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>${personalInfo.location}</span>
          </div>` : ''}
          
          ${personalInfo.linkedin ? `<div style="display: flex; align-items: center;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px; opacity: 0.8;">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect x="2" y="9" width="4" height="12"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
            <span>${personalInfo.linkedin}</span>
          </div>` : ''}
          
          ${personalInfo.portfolio ? `<div style="display: flex; align-items: center;">
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
  
  // Generate main content for cover letter
  const mainContent = computed(() => {
    const { letterDetails, personalInfo } = props.coverLetterData
    
    // Date and recipient information
    const dateAndRecipientHTML = `
      <div style="margin-bottom: 30px;">
        <div style="text-align: right; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 14px; color: #666;">${letterDetails?.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <p style="margin: 0; font-weight: 600; font-size: 16px;">${letterDetails?.recipientName || 'Hiring Manager'}</p>
          <p style="margin: 2px 0 0; font-size: 14px;">${letterDetails?.companyName || 'Company Name'}</p>
          <p style="margin: 2px 0 0; font-size: 14px;">${letterDetails?.companyAddress || 'Company Address'}</p>
        </div>
      </div>
    `
    
    // Salutation
    const salutationHTML = `
      <div style="margin-bottom: 20px;">
        <p style="margin: 0; font-size: 16px;">Dear ${letterDetails?.recipientName || 'Hiring Manager'},</p>
      </div>
    `
    
    // Opening paragraph
    const openingHTML = `
      <div style="margin-bottom: 20px;">
        <p style="margin: 0; line-height: 1.6; font-size: 14px;">
          ${letterDetails?.opening || `I am writing to express my strong interest in the ${letterDetails?.position || 'Software Engineer'} position at ${letterDetails?.companyName || 'your company'}. With over 8 years of experience in software development and a proven track record of delivering innovative solutions, I am excited about the opportunity to contribute to your team's success.`}
        </p>
      </div>
    `
    
    // Body paragraphs
    const bodyHTML = `
      <div style="margin-bottom: 20px;">
        <p style="margin: 0 0 15px 0; line-height: 1.6; font-size: 14px;">
          ${letterDetails?.body1 || `In my current role as Senior Software Engineer at Google, I have led the development of machine learning features that improved system performance by 40%. My expertise in Python, Java, and cloud technologies, combined with my experience in leading cross-functional teams, aligns perfectly with the requirements outlined in your job posting.`}
        </p>
        
        <p style="margin: 0 0 15px 0; line-height: 1.6; font-size: 14px;">
          ${letterDetails?.body2 || `What particularly excites me about this opportunity is your company's commitment to innovation and technological excellence. I am eager to bring my passion for problem-solving and my experience with distributed systems to help drive your next phase of growth. My recent work on optimizing cloud infrastructure and implementing CI/CD pipelines has prepared me to make an immediate impact on your development processes.`}
        </p>
        
        <p style="margin: 0; line-height: 1.6; font-size: 14px;">
          ${letterDetails?.body3 || `I would welcome the opportunity to discuss how my technical skills and leadership experience can contribute to your team's objectives. Thank you for considering my application. I look forward to hearing from you soon.`}
        </p>
      </div>
    `
    
    // Closing
    const closingHTML = `
      <div style="margin-bottom: 30px;">
        <p style="margin: 0 0 20px 0; font-size: 14px;">
          ${letterDetails?.closing || 'Sincerely,'}
        </p>
        <p style="margin: 0; font-weight: 600; font-size: 16px;">
          ${personalInfo?.name || 'Carlos Idriss Saez'}
        </p>
      </div>
    `
    
    // Combine all sections
    return `
      <div style="padding: 20px; max-width: 100%; line-height: 1.5;">
        ${dateAndRecipientHTML}
        ${salutationHTML}
        ${openingHTML}
        ${bodyHTML}
        ${closingHTML}
      </div>
    `
  })
  
  // Left column content for two-column layouts (contact info)
  const leftContent = computed(() => {
    const { personalInfo } = props.coverLetterData
    
    return `
      <div style="padding: 20px; color: white;">
        <div style="margin-bottom: 20px;">
          <h3 style="color: white; margin-bottom: 15px; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Contact Information</h3>
          <div style="margin-bottom: 10px;">
            <div style="font-size: 14px;">${personalInfo?.email || 'carlos.idriss@example.com'}</div>
          </div>
          <div style="margin-bottom: 10px;">
            <div style="font-size: 14px;">${personalInfo?.phone || '+33 6 12 34 56 78'}</div>
          </div>
          <div style="margin-bottom: 10px;">
            <div style="font-size: 14px;">${personalInfo?.location || 'Paris, France'}</div>
          </div>
          <div style="margin-bottom: 10px;">
            <div style="font-size: 14px;">${personalInfo?.linkedin || 'linkedin.com/in/carlossaez'}</div>
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: white; margin-bottom: 15px; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Key Skills</h3>
          <div style="margin-bottom: 8px;">
            <div style="font-size: 13px; line-height: 1.4;">• Leadership & Team Management</div>
          </div>
          <div style="margin-bottom: 8px;">
            <div style="font-size: 13px; line-height: 1.4;">• Full-Stack Development</div>
          </div>
          <div style="margin-bottom: 8px;">
            <div style="font-size: 13px; line-height: 1.4;">• Cloud Architecture</div>
          </div>
          <div style="margin-bottom: 8px;">
            <div style="font-size: 13px; line-height: 1.4;">• Machine Learning</div>
          </div>
          <div style="margin-bottom: 8px;">
            <div style="font-size: 13px; line-height: 1.4;">• DevOps & CI/CD</div>
          </div>
        </div>
      </div>
    `
  })
  
  // Right column content for two-column layouts (main letter)
  const rightContent = computed(() => {
    const { letterDetails, personalInfo } = props.coverLetterData
    
    return `
      <div style="padding: 20px;">
        <div style="margin-bottom: 25px;">
          <div style="text-align: right; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 14px; color: #666;">${letterDetails?.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <p style="margin: 0; font-weight: 600; font-size: 16px;">${letterDetails?.recipientName || 'Hiring Manager'}</p>
            <p style="margin: 2px 0 0; font-size: 14px;">${letterDetails?.companyName || 'Company Name'}</p>
          </div>
          
          <p style="margin: 0 0 20px 0; font-size: 16px;">Dear ${letterDetails?.recipientName || 'Hiring Manager'},</p>
          
          <p style="margin: 0 0 15px 0; line-height: 1.6; font-size: 14px;">
            ${letterDetails?.opening || `I am writing to express my interest in the ${letterDetails?.position || 'Software Engineer'} position at ${letterDetails?.companyName || 'your company'}.`}
          </p>
          
          <p style="margin: 0 0 15px 0; line-height: 1.6; font-size: 14px;">
            ${letterDetails?.body1 || 'With my extensive experience in software development and proven leadership skills, I am confident I can make a valuable contribution to your team.'}
          </p>
          
          <p style="margin: 0 0 20px 0; line-height: 1.6; font-size: 14px;">
            ${letterDetails?.body2 || 'I look forward to discussing how my skills and experience align with your needs.'}
          </p>
          
          <p style="margin: 0 0 15px 0; font-size: 14px;">
            ${letterDetails?.closing || 'Sincerely,'}
          </p>
          <p style="margin: 0; font-weight: 600; font-size: 16px;">
            ${personalInfo?.name || 'Carlos Idriss Saez'}
          </p>
        </div>
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
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }
  </script>
  
  <style scoped>
  
  </style>
