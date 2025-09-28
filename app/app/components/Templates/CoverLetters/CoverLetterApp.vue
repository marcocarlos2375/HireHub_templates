<template>
  <div class="app-container">
    <!-- Cover Letter Gallery View -->
    <CoverLetterGallery 
      v-if="!selectedTemplate"
      @template-selected="handleTemplateSelection"
    />
    
    <!-- Cover Letter View with Back Button -->
    <div v-else class="template-view">
      <div class="template-header">
        <button class="back-btn" @click="goBackToGallery">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5"/>
            <path d="M12 19l-7-7 7-7"/>
          </svg>
          Back to Templates
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
      
      <ClassicCoverLetter 
        :cover-letter-data="coverLetterData"
        :template-config="selectedTemplate"
        :font-family="'Wix Madefor Text, sans-serif'"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CoverLetterGallery from './CoverLetterGallery.vue'
import ClassicCoverLetter from './ClassicCoverLetter.vue'

// Template selection state
const selectedTemplate = ref(null)
const isGeneratingPDF = ref(false)

// Mock cover letter data
const coverLetterData = {
  personalInfo: {
    name: 'Carlos Idriss Saez',
    title: 'Software Engineer',
    email: 'carlos.idriss@example.com',
    phone: '+33 6 12 34 56 78',
    location: 'Paris, France',
    linkedin: 'linkedin.com/in/carlossaez'
  },
  letterDetails: {
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    recipientName: 'Sarah Johnson',
    companyName: 'Tech Innovations Inc.',
    companyAddress: '123 Innovation Drive, San Francisco, CA 94105',
    position: 'Senior Software Engineer',
    opening: 'I am writing to express my strong interest in the Senior Software Engineer position at Tech Innovations Inc. With over 8 years of experience in software development and a proven track record of delivering innovative solutions, I am excited about the opportunity to contribute to your team\'s success.',
    body1: 'In my current role as Senior Software Engineer at Google, I have led the development of machine learning features that improved system performance by 40%. My expertise in Python, Java, and cloud technologies, combined with my experience in leading cross-functional teams, aligns perfectly with the requirements outlined in your job posting.',
    body2: 'What particularly excites me about this opportunity is Tech Innovations Inc.\'s commitment to innovation and technological excellence. I am eager to bring my passion for problem-solving and my experience with distributed systems to help drive your next phase of growth. My recent work on optimizing cloud infrastructure and implementing CI/CD pipelines has prepared me to make an immediate impact on your development processes.',
    body3: 'I would welcome the opportunity to discuss how my technical skills and leadership experience can contribute to your team\'s objectives. Thank you for considering my application. I look forward to hearing from you soon.',
    closing: 'Sincerely,'
  }
}

const handleTemplateSelection = (template) => {
  selectedTemplate.value = template
  console.log('Selected cover letter template:', template.name)
}

const goBackToGallery = () => {
  selectedTemplate.value = null
}

const handlePageChange = (page) => {
  console.log('Page changed:', page)
}

const generatePDF = async () => {
  if (isGeneratingPDF.value) return
  
  isGeneratingPDF.value = true
  
  try {
    console.log('Generating PDF for cover letter template:', selectedTemplate.value.name)
    
    // Simulate PDF generation
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

<style>
.app-container {
  min-height: 100vh;
  font-family: 'Gabarito', sans-serif;
}

.template-view {
  min-height: 100vh;
  background-color: #f3f4f6;
}

.template-header {
  background: white;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 2rem;
  font-family: 'Gabarito', sans-serif;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8fafc;
  border: 1px solid #d1d5db;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  color: #374151;
  font-weight: 500;
  font-family: 'Gabarito', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #0ea5e9;
    color: white;
    border-color: #0ea5e9;
    transform: translateX(-2px);
  }
  
  svg {
    transition: transform 0.2s ease;
  }
  
  &:hover svg {
    transform: translateX(-2px);
  }
}

.template-info {
  .template-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 0.25rem 0;
    font-family: 'Gabarito', sans-serif;
  }
  
  .template-desc {
    color: #6b7280;
    margin: 0;
    font-size: 0.9rem;
    font-family: 'Gabarito', sans-serif;
  }
}

.pdf-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #0ea5e9;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  font-family: 'Gabarito', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: #0284c7;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }
  
  svg {
    transition: transform 0.2s ease;
  }
  
  &:hover:not(:disabled) svg {
    transform: scale(1.1);
  }
}

@media (max-width: 768px) {
  .template-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
  }
  
  .back-btn {
    align-self: flex-start;
  }
}
</style>
