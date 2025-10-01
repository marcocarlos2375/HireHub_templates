<template>
  <div class="template-gallery">
    <!-- Google Fonts Link -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Gabarito:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <div class="gallery-header">
      <h1 class="gallery-title">Choose Your Resume Template</h1>
      <p class="gallery-subtitle">Select from our collection of professional resume templates</p>
    </div>
    
    <div class="templates-grid">
      <div 
        v-for="template in templates" 
        :key="template.id"
        class="template-card"
        @click="selectTemplate(template)"
      >
       
        
        <div class="template-info">
          <h3 class="template-name">{{ template.name }}</h3>
          <p class="template-description">{{ template.description }}</p>
          <div class="template-tags">
            <span 
              v-for="tag in template.tags" 
              :key="tag"
              class="template-tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>
        
        <div class="template-actions">
          <button class="select-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 12l2 2 4-4"/>
              <circle cx="12" cy="12" r="10"/>
            </svg>
            Select Template
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['template-selected'])

// Available templates data
const templates = ref([
  {
    id: 'classic',
    name: 'Classic Professional',
    description: 'Clean and professional design perfect for corporate positions',
    tags: ['Professional', 'Corporate', 'ATS-Friendly'],
    primaryColor: '#ffffff',
    headerColor: '#0EA5E9',
    sampleName: 'John Doe',
    sampleTitle: 'Software Engineer',
    paginatorType: 'oneColHeader'
  },
  {
    id: 'classic-header-once',
    name: 'Classic Professional (Header Once)',
    description: 'Classic design with header only on first page for more content space',
    tags: ['Professional', 'Space-Efficient', 'Multi-Page'],
    primaryColor: '#ffffff',
    headerColor: '#0EA5E9',
    sampleName: 'John Doe',
    sampleTitle: 'Software Engineer',
    paginatorType: 'oneColHeaderOnce'
  },
  {
    id: 'modern-two-col',
    name: 'Modern Two Column',
    description: 'Contemporary design with sidebar for skills and contact info',
    tags: ['Modern', 'Creative', 'Two-Column'],
    primaryColor: '#f8fafc',
    headerColor: '#6366f1',
    sampleName: 'Jane Smith',
    sampleTitle: 'UX Designer',
    paginatorType: 'twoCols'
  },
  {
    id: 'modern-boxed',
    name: 'Modern Boxed',
    description: 'Elegant design with bordered header and two-column layout',
    tags: ['Modern', 'Boxed', 'Professional'],
    primaryColor: '#ffffff',
    headerColor: '#000000',
    accentColor: '#000000',
    sampleName: 'Sophia Alvarez',
    sampleTitle: 'Graphic Designer',
    paginatorType: 'twoColsWithHeader'
  },
  {
    id: 'executive',
    name: 'Executive Header',
    description: 'Professional layout with prominent header section',
    tags: ['Executive', 'Leadership', 'Premium'],
    primaryColor: '#ffffff',
    headerColor: '#059669',
    sampleName: 'Michael Johnson',
    sampleTitle: 'Project Manager',
    paginatorType: 'twoColsHeader'
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Simple and clean design focusing on content',
    tags: ['Minimalist', 'Simple', 'Clean'],
    primaryColor: '#ffffff',
    headerColor: '#64748b',
    sampleName: 'Sarah Wilson',
    sampleTitle: 'Data Analyst',
    paginatorType: 'oneColHeader'
  },
  {
    id: 'creative',
    name: 'Creative Professional',
    description: 'Eye-catching design for creative professionals',
    tags: ['Creative', 'Artistic', 'Unique'],
    primaryColor: '#fef3c7',
    headerColor: '#f59e0b',
    sampleName: 'Alex Chen',
    sampleTitle: 'Graphic Designer',
    paginatorType: 'twoCols'
  },
  {
    id: 'tech',
    name: 'Tech Specialist',
    description: 'Modern design tailored for technology professionals',
    tags: ['Technology', 'Modern', 'Developer'],
    primaryColor: '#f1f5f9',
    headerColor: '#3b82f6',
    sampleName: 'David Kim',
    sampleTitle: 'Full Stack Developer',
    paginatorType: 'twoColsHeader'
  }
])

const selectTemplate = (template) => {
  emit('template-selected', template)
}
</script>

<style lang="scss" scoped>
.template-gallery {
  min-height: 100vh;
  padding: 2rem;
  background: white;
  font-family: 'Gabarito', sans-serif;
}

.gallery-header {
  text-align: center;
  margin-bottom: 3rem;
  
  .gallery-title {
    font-size: 3rem;
    font-weight: 700;
    color: #0c4a6e;
    margin-bottom: 1rem;
    font-family: 'Gabarito', sans-serif;
  }
  
  .gallery-subtitle {
    font-size: 1.25rem;
    color: #0369a1;
    margin: 0;
    font-family: 'Gabarito', sans-serif;
  }
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.template-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid #e0f2fe;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  font-family: 'Gabarito', sans-serif;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 16px rgba(14, 165, 233, 0.08);
  
  &:hover {
    transform: translateY(-8px);
    border-color: #0ea5e9;
    box-shadow: 0 12px 32px rgba(14, 165, 233, 0.2);
  }
}

.template-info {
  padding: 1.5rem;
  flex: 1;
  
  .template-name {
    font-size: 1.25rem;
    font-weight: 600;
    color: #0c4a6e;
    margin-bottom: 0.5rem;
    font-family: 'Gabarito', sans-serif;
  }
  
  .template-description {
    color: #0369a1;
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 1rem;
    font-family: 'Gabarito', sans-serif;
  }
  
  .template-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .template-tag {
    background: #dbeafe;
    color: #0369a1;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
    font-family: 'Gabarito', sans-serif;
  }
}

.template-actions {
  padding: 1.5rem;
  padding-top: 0;
  display: flex;
  justify-content: center;
  
  .select-btn {
    background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
    color: white;
    border: none;
    padding: 0.875rem 2rem;
    border-radius: 10px;
    font-weight: 600;
    font-size: 1rem;
    font-family: 'Gabarito', sans-serif;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
    width: 100%;
    justify-content: center;
    
    &:hover {
      background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(14, 165, 233, 0.4);
    }
    
    svg {
      width: 20px;
      height: 20px;
      transition: transform 0.3s ease;
    }
    
    &:hover svg {
      transform: scale(1.15);
    }
  }
}

@media (max-width: 768px) {
  .template-gallery {
    padding: 1rem;
  }
  
  .gallery-header {
    .gallery-title {
      font-size: 2rem;
    }
    
    .gallery-subtitle {
      font-size: 1rem;
    }
  }
  
  .templates-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .template-card {
    .template-preview {
      height: 250px;
    }
  }
}
</style>
