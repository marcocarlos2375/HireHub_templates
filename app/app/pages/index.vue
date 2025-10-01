<template>
    <div class="app-container">
      <!-- Google Fonts -->
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600;700&display=swap" rel="stylesheet">
      
      <!-- Tab Navigation -->
      <div v-if="!selectedTemplate && !selectedCoverLetterTemplate" class="tab-navigation">
        <div class="nav-header">
          <h1 class="nav-title">Professional Templates</h1>
          <p class="nav-subtitle">Choose and customize your professional documents</p>
        </div>
        
        <div class="tab-container">
          <div class="tab-buttons">
            <button 
              class="tab-button" 
              :class="{ active: activeTab === 'resume' }"
              @click="activeTab = 'resume'"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              Resume Templates
            </button>
            <button 
              class="tab-button" 
              :class="{ active: activeTab === 'cover-letter' }"
              @click="activeTab = 'cover-letter'"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Cover Letter Templates
            </button>
          </div>
          
          <div class="tab-content">
            <!-- Resume Template Gallery -->
            <div v-if="activeTab === 'resume'" class="tab-panel">
              <TemplateGallery 
                @template-selected="handleResumeTemplateSelection"
              />
            </div>
            
            <!-- Cover Letter Gallery -->
            <div v-if="activeTab === 'cover-letter'" class="tab-panel">
              <CoverLetterGallery 
                @template-selected="handleCoverLetterTemplateSelection"
              />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Resume Template View -->
      <div v-if="selectedTemplate" class="template-view">
        <div class="template-header">
          <button class="back-btn" @click="goBackToResumeGallery">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5"/>
              <path d="M12 19l-7-7 7-7"/>
            </svg>
            Back to Resume Templates
          </button>
          <div class="template-info">
            <h2 class="template-title">{{ selectedTemplate.name }}</h2>
            <p class="template-desc">{{ selectedTemplate.description }}</p>
          </div>
          <button class="pdf-btn" @click="generatePDF" :disabled="isGeneratingPDF">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
            {{ isGeneratingPDF ? 'Generating...' : 'Generate PDF' }}
          </button>
        </div>
        
        <ClassicTemplates 
          v-if="selectedTemplate.id === 'classic'"
          :resume-data="resumeData"
          :template-config="selectedTemplate"
          :font-family="'Wix Madefor Text, sans-serif'"
          @page-change="handlePageChange"
        />
        
        <ClassicTemplatesHeaderOnce 
          v-if="selectedTemplate.id === 'classic-header-once'"
          :resume-data="resumeData"
          :template-config="selectedTemplate"
          :font-family="'Wix Madefor Text, sans-serif'"
          @page-change="handlePageChange"
        />
        
        <ModernBoxedTemplate 
          v-if="selectedTemplate.id === 'modern-boxed'"
          :resume-data="resumeData"
          :template-config="selectedTemplate"
          :font-family="'Josefin Sans, sans-serif'"
          @page-change="handlePageChange"
        />
      </div>
      
      <!-- Cover Letter Template View -->
      <div v-if="selectedCoverLetterTemplate" class="template-view">
        <div class="template-header">
          <button class="back-btn" @click="goBackToCoverLetterGallery">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5"/>
              <path d="M12 19l-7-7 7-7"/>
            </svg>
            Back to Cover Letter Templates
          </button>
          <div class="template-info">
            <h2 class="template-title">{{ selectedCoverLetterTemplate.name }}</h2>
            <p class="template-desc">{{ selectedCoverLetterTemplate.description }}</p>
          </div>
          <button class="pdf-btn" @click="generateCoverLetterPDF" :disabled="isGeneratingPDF">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
            {{ isGeneratingPDF ? 'Generating...' : 'Generate PDF' }}
          </button>
        </div>
        
        <ClassicCoverLetter 
          :cover-letter-data="coverLetterData"
          :template-config="selectedCoverLetterTemplate"
          :font-family="'Wix Madefor Text, sans-serif'"
          @page-change="handlePageChange"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import TemplateGallery from '../components/Templates/TemplateGallery.vue'
  import ClassicTemplates from '../components/Templates/ClassicTemplates.vue'
  import ClassicTemplatesHeaderOnce from '../components/Templates/ClassicTemplatesHeaderOnce.vue'
  import ModernBoxedTemplate from '../components/Templates/ModernBoxedTemplate.vue'
  import CoverLetterGallery from '../components/Templates/CoverLetters/CoverLetterGallery.vue'
  import ClassicCoverLetter from '../components/Templates/CoverLetters/ClassicCoverLetter.vue'
  
  // Navigation state
  const activeTab = ref('resume')
  const showResumeTemplates = ref(false)
  const showCoverLetterTemplates = ref(false)
  
  // Template selection state
  const selectedTemplate = ref(null)
  const selectedCoverLetterTemplate = ref(null)
  const isGeneratingPDF = ref(false)
  
  // Mock resume data
  const resumeData = {
    personalInfo: {
      name: 'Carlos Idriss Saez',
      title: 'Software Engineer',
      email: 'carlos.idriss@example.com',
      phone: '+33 6 12 34 56 78',
      location: 'Paris, France',
      linkedin: 'linkedin.com/in/carlossaez',
      portfolio: 'www.carlossaez.dev'
    }
  }
  
  // Mock cover letter data
  const coverLetterData = {
    personalInfo: {
      name: 'Carlos Idriss Saez',
      title: 'Software Engineer',
      email: 'carlos.idriss@example.com',
      phone: '+33 6 12 34 56 78',
      location: 'Paris, France',
      linkedin: 'linkedin.com/in/carlossaez',
      portfolio: 'www.carlossaez.dev'
    },
    letterDetails: {
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      recipientName: 'Sarah Johnson',
      companyName: 'Tech Innovations Inc.',
      companyAddress: '123 Innovation Drive, San Francisco, CA 94105',
      position: 'Senior Software Engineer',
      opening: 'I am writing to express my strong interest in the Senior Software Engineer position at Tech Innovations Inc. With over 8 years of experience in software development and a proven track record of delivering innovative solutions, I am excited about the opportunity to contribute to your team\'s success.',
      body1: 'In my current role as Senior Software Engineer at Google, I have led the development of machine learning features that improved system performance by 40%. My expertise in Python, Java, and cloud technologies, combined with my experience in leading cross-functional teams, aligns perfectly with the requirements outlined in your job posting.',
      body2: 'What particularly excites me about this opportunity is Tech Innovations Inc.\'s commitment to innovation and technological excellence. I am eager to bring my passion for problem-solving and my experience with distributed systems to help drive your next phase of growth.',
      body3: 'I would welcome the opportunity to discuss how my technical skills and leadership experience can contribute to your team\'s objectives. Thank you for considering my application.',
      closing: 'Sincerely,'
    }
  }
  
  // Tab navigation is handled directly in template with activeTab.value
  
  // Resume template functions
  const handleResumeTemplateSelection = (template) => {
    selectedTemplate.value = template
    console.log('Selected resume template:', template.name)
  }
  
  const goBackToResumeGallery = () => {
    selectedTemplate.value = null
    activeTab.value = 'resume'
  }
  
  // Cover letter template functions
  const handleCoverLetterTemplateSelection = (template) => {
    selectedCoverLetterTemplate.value = template
    console.log('Selected cover letter template:', template.name)
  }
  
  const goBackToCoverLetterGallery = () => {
    selectedCoverLetterTemplate.value = null
    activeTab.value = 'cover-letter'
  }
  
  const handlePageChange = (page) => {
    console.log('Page changed:', page)
  }
  
  const generatePDF = async () => {
    if (isGeneratingPDF.value) return
    
    isGeneratingPDF.value = true
    
    try {
      console.log('Generating PDF for resume template:', selectedTemplate.value.name)
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Resume PDF generated successfully')
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert(`Error generating PDF: ${error.message}`)
    } finally {
      isGeneratingPDF.value = false
    }
  }
  
  const generateCoverLetterPDF = async () => {
    if (isGeneratingPDF.value) return
    
    isGeneratingPDF.value = true
    
    try {
      console.log('Generating PDF for cover letter template:', selectedCoverLetterTemplate.value.name)
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Cover letter PDF generated successfully')
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert(`Error generating PDF: ${error.message}`)
    } finally {
      isGeneratingPDF.value = false
    }
  }
  </script>
  
  <style lang="scss">
  .app-container {
    min-height: 100vh;
    font-family: 'Gabarito', sans-serif;
  }
  
  .template-view {
    min-height: 100vh;
    background: linear-gradient(to bottom, #eff6ff 0%, #dbeafe 100%);
  }
  
  .template-header {
    background: white;
    padding: 1.5rem 2rem;
    border-bottom: 2px solid #bfdbfe;
    display: flex;
    align-items: center;
    gap: 2rem;
    font-family: 'Gabarito', sans-serif;
    box-shadow: 0 4px 16px rgba(14, 165, 233, 0.08);
  }
  
  .back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #eff6ff;
    border: 1.5px solid #93c5fd;
    padding: 0.75rem 1.25rem;
    border-radius: 10px;
    color: #0369a1;
    font-weight: 600;
    font-family: 'Gabarito', sans-serif;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover {
      background: #0ea5e9;
      color: white;
      border-color: #0ea5e9;
      transform: translateX(-4px);
      box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
    }
    
    svg {
      transition: transform 0.3s ease;
    }
    
    &:hover svg {
      transform: translateX(-3px);
    }
  }
  
  .template-info {
    .template-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #0c4a6e;
      margin: 0 0 0.25rem 0;
      font-family: 'Gabarito', sans-serif;
    }
    
    .template-desc {
      color: #0369a1;
      margin: 0;
      font-size: 0.9rem;
      font-family: 'Gabarito', sans-serif;
      font-weight: 500;
    }
  }
  
  .pdf-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 10px;
    color: white;
    font-weight: 600;
    font-family: 'Gabarito', sans-serif;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(14, 165, 233, 0.4);
    }
    
    &:disabled {
      background: #93c5fd;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
    
    svg {
      transition: transform 0.3s ease;
    }
    
    &:hover:not(:disabled) svg {
      transform: scale(1.15) rotate(5deg);
    }
  }
  
  @media (max-width: 768px) {
    .template-header {
      flex-direction: column;
      align-items: flex-start;
      padding: 1rem;
    }
    
    .nav-header {
      .nav-title {
        font-size: 2.5rem;
      }
      
      .nav-subtitle {
        font-size: 1rem;
      }
    }
    
    .nav-options {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .nav-card {
      padding: 1.5rem;
    }
    
    .back-btn {
      align-self: flex-start;
    }
  }
  
  /* Tab Navigation Styles */
  .tab-navigation {
    min-height: 100vh;
    background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 3rem 2rem;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
      border-radius: 50%;
    }
    
    &::after {
      content: '';
      position: absolute;
      bottom: -30%;
      left: -10%;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
      border-radius: 50%;
    }
  }
  
  .nav-header {
    text-align: center;
    margin-bottom: 3rem;
    position: relative;
    z-index: 1;
  }
  
  .nav-title {
    font-size: 3.5rem;
    font-weight: 700;
    color: white;
    margin-bottom: 1rem;
    font-family: 'Gabarito', sans-serif;
    text-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    letter-spacing: -0.02em;
  }
  
  .nav-subtitle {
    font-size: 1.25rem;
    color: rgba(255, 255, 255, 0.95);
    margin: 0;
    font-family: 'Gabarito', sans-serif;
    font-weight: 400;
  }
  
  .tab-container {
    width: 100%;
    max-width: 1200px;
    margin-top: 2rem;
    position: relative;
    z-index: 1;
  }
  
  .tab-buttons {
    display: flex;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 16px;
    padding: 6px;
    margin-bottom: 2rem;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
  
  .tab-button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 1.25rem 2rem;
    border: none;
    background: transparent;
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.05rem;
    font-weight: 500;
    font-family: 'Gabarito', sans-serif;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    
    &:hover:not(.active) {
      color: white;
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }
  }
  
  .tab-button.active {
    background: white;
    color: #0284c7;
    font-weight: 600;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
  
  .tab-button svg {
    width: 22px;
    height: 22px;
    transition: transform 0.3s ease;
  }
  
  .tab-button:hover svg {
    transform: scale(1.1);
  }
  
  .tab-content {
    border-radius: 20px;
    padding: 2.5rem;
    backdrop-filter: blur(20px);
  }
  
  .tab-panel {
    min-height: 400px;
  }
  </style>