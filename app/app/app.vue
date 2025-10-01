<template>
  <div class="app-container">
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600;700&display=swap" rel="stylesheet">
    
    <NuxtPage />
  </div>
</template>

<script setup>
</script>

<style lang="scss">
.app-container {
  min-height: 100vh;
  
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2rem;
}

.nav-header {
  text-align: center;
  margin-bottom: 2rem;
}

.nav-title {
  font-size: 3rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
  font-family: 'Gabarito', sans-serif;
}

.nav-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-family: 'Gabarito', sans-serif;
}

.tab-container {
  width: 100%;
  max-width: 1200px;
  margin-top: 2rem;
}

.tab-buttons {
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
}

.tab-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  font-weight: 500;
  font-family: 'Gabarito', sans-serif;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-button:hover {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.1);
}

.tab-button.active {
  background: rgba(255, 255, 255, 0.95);
  color: #374151;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tab-button svg {
  width: 20px;
  height: 20px;
}

.tab-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.tab-panel {
  min-height: 400px;
}
</style>
