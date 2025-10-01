<template>
    <div class="resume-container">
      <!-- Auto Paginator One Column with Header -->
      <AutoPaginatorOneColWithHeader 
        v-if="paginatorType === 'oneColHeader'"
        :model-value="currentPageIndex"
        :header-html="headerContent"
        :html="mainContent"
        :page-width="pageWidthPx"
        :page-height="pageHeightPx"
        :page-padding="pagePaddingPx"
        :header-bg-color="headerBgColor"
        :column-bg-color="backgroundColor"
        :font-family="fontFamily"
        content-class="resume-typography"
        @page-change="handlePageChange"
      />
      
      <!-- Auto Paginator One Column with Header (Only First Page) -->
      <AutoPaginatorOneColHeaderOnce 
        v-else-if="paginatorType === 'oneColHeaderOnce'"
        :model-value="currentPageIndex"
        :header-html="headerContent"
        :html="mainContent"
        :page-width="pageWidthPx"
        :page-height="pageHeightPx"
        :page-padding="pagePaddingPx"
        :header-bg-color="headerBgColor"
        :column-bg-color="backgroundColor"
        :font-family="fontFamily"
        :safety-buffer="1"
        :fudge-px="0"
        content-class="resume-typography"
        @page-change="handlePageChange"
      />
      
      <!-- Auto Paginator Two Columns -->
      <AutoPaginatorTwoCols 
        v-else-if="paginatorType === 'twoCols'"
        :model-value="currentPageIndex"
        :left-html="leftContent"
        :right-html="rightContent"
        :page-width="pageWidthPx"
        :page-height="pageHeightPx"
        :page-padding="pagePaddingPx"
        :left-column-bg-color="leftColumnBgColor"
        :right-column-bg-color="rightColumnBgColor"
        :font-family="fontFamily"
        content-class="resume-typography"
        @page-change="handlePageChange"
      />
      
      <!-- Auto Paginator Two Columns with Header (All Pages) -->
      <AutoPaginatorTwoColsWithHeader 
        v-else-if="paginatorType === 'twoColsWithHeader' || paginatorType === 'twoColsHeader'"
        :model-value="currentPageIndex"
        :headerHtml="headerContent"
        :leftHtml="leftContent"
        :rightHtml="rightContent"
        :pageWidth="pageWidthPx"
        :pageHeight="pageHeightPx"
        :pagePadding="pagePaddingPx"
        :headerHeight="150"
        :headerPaddingTop="20"
        :headerPaddingRight="20"
        :headerPaddingBottom="20"
        :headerPaddingLeft="20"
        :columnPaddingTop="35"
        :columnPaddingRight="35"
        :columnPaddingBottom="35"
        :columnPaddingLeft="35"
        :headerBgColor="headerBgColor"
        :leftColumnBgColor="leftColumnBgColor"
        :rightColumnBgColor="rightColumnBgColor"
        :columnGutter="0"
        :font-family="fontFamily"
        :safetyBuffer="5"
        :fudgePx="1"
        contentClass="resume-typography"
        @page-change="handlePageChange"
      />
      
      <!-- Auto Paginator Two Columns with Header (Only First Page) -->
      <AutoPaginatorTwoColsWithHeaderOnce 
        v-else-if="paginatorType === 'twoColsHeaderOnce'"
        :model-value="currentPageIndex"
        :header-html="headerContent"
        :left-html="leftContent"
        :right-html="rightContent"
        :page-width="pageWidthPx"
        :page-height="pageHeightPx"
        :page-padding="pagePaddingPx"
        :header-height="150"
        :header-padding-top="20"
        :header-padding-right="20"
        :header-padding-bottom="20"
        :header-padding-left="20"
        :column-padding-top="35"
        :column-padding-right="35"
        :column-padding-bottom="35"
        :column-padding-left="35"
        :header-bg-color="headerBgColor"
        :left-column-bg-color="leftColumnBgColor"
        :right-column-bg-color="rightColumnBgColor"
        :left-column-ratio="leftColumnRatio"
        :column-gutter="0"
        :font-family="fontFamily"
        :safety-buffer="5"
        :fudge-px="1"
        content-class="resume-typography"
        @page-change="handlePageChange"
      />
      
      <!-- Pagination Controls -->
      <div v-if="showPaginationControls" class="pagination-controls">
        <button 
          class="pagination-btn prev-btn" 
          @click="prevPage" 
          :disabled="currentPage <= 1"
          aria-label="Previous page"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
          Previous
        </button>
        
        <div class="page-info">
          <span class="page-indicator">{{ currentPage }} / {{ pageCount }}</span>
        </div>
        
        <button 
          class="pagination-btn next-btn" 
          @click="nextPage" 
          :disabled="currentPage >= pageCount"
          aria-label="Next page"
        >
          Next
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { usePaginationStore } from '~/stores/pagination';
  import AutoPaginatorOneColWithHeader from '../paginator/AutoPaginatorOneColWithHeader.vue';
  import AutoPaginatorOneColHeaderOnce from '../paginator/AutoPaginatorOneColHeaderOnce.vue';
  import AutoPaginatorTwoCols from '../paginator/AutoPaginatorTwoCols.vue';
  import AutoPaginatorTwoColsWithHeader from '../paginator/AutoPaginatorTwoColsWithHeader.vue';
  import AutoPaginatorTwoColsWithHeaderOnce from '../paginator/AutoPaginatorTwoColsWithHeaderOnce.vue';
  
  // Initialize Pinia store
  const paginationStore = usePaginationStore();
  
  const props = defineProps({
    // Paginator type to use
    paginatorType: {
      type: String,
      default: 'oneColHeader',
      validator: (value) => ['oneColHeader', 'oneColHeaderOnce', 'twoCols', 'twoColsHeader', 'twoColsWithHeader', 'twoColsHeaderOnce'].includes(value)
    },
    // Total number of pages to render (for legacy paginator)
    pageCount: {
      type: Number,
      default: 1
    },
    // Whether to automatically detect and create pages based on content overflow
    autoPages: {
      type: Boolean,
      default: true
    },
    // Page padding (in mm)
    padding: {
      type: Object,
      default: () => ({
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      })
    },
    // Background color for pages
    backgroundColor: {
      type: String,
      default: 'white'
    },
    // Text color
    textColor: {
      type: String,
      default: '#1f2937' // gray-800
    },
    // Initial page to display
    initialPage: {
      type: Number,
      default: 1
    },
    // Header content HTML (for paginators with headers)
    headerContent: {
      type: String,
      default: ''
    },
    // Main content HTML (for single column paginators)
    mainContent: {
      type: String,
      default: ''
    },
    // Left column content HTML (for two column paginators)
    leftContent: {
      type: String,
      default: ''
    },
    // Right column content HTML (for two column paginators)
    rightContent: {
      type: String,
      default: ''
    },
    // Header height in pixels (for paginators with headers)
   
    // Header background color
    headerBgColor: {
      type: String,
      default: '#0EA5E9'
    },
    // Left column background color
    leftColumnBgColor: {
      type: String,
      default: '#0EA5E9'
    },
    // Right column background color
    rightColumnBgColor: {
      type: String,
      default: '#e9e9e9'
    },
    // Left column width ratio (0-1)
    leftColumnRatio: {
      type: Number,
      default: 0.3
    },
    // Show pagination controls
    showPaginationControls: {
      type: Boolean,
      default: true
    },
    // Font family
    fontFamily: {
      type: String,
      default: 'Gabarito, sans-serif'
    }
  });
  
  // Define emits
  const emit = defineEmits(['page-change']);
  
  // Use store values instead of local state
  const currentPage = computed(() => paginationStore.currentPage);
  const pageCount = computed(() => paginationStore.pageCount);
  
  // Convert 1-based store index to 0-based for paginator components
  const currentPageIndex = computed(() => Math.max(0, paginationStore.currentPage - 1));
  
  // Navigation functions using Pinia store
  function nextPage() {
    if (currentPage.value < pageCount.value) {
      paginationStore.nextPage();
      emit('page-change', currentPage.value);
    }
  }
  
  function prevPage() {
    if (currentPage.value > 1) {
      paginationStore.prevPage();
      emit('page-change', currentPage.value);
    }
  }
  
  // Set specific page using store
  function goToPage(page) {
    if (page >= 1 && page <= pageCount.value) {
      paginationStore.setCurrentPage(page);
      emit('page-change', page);
    }
  }
  
  // Update page count when paginator components determine total pages
  function updatePageCount(count) {
    paginationStore.setPageCount(count);
  }
  
  // Calculate available space in the resume page (in mm and px)
  const availableSpace = computed(() => {
    // A4 paper size in mm
    const a4Width = 210; // mm
    const a4Height = 297; // mm
    
    // Calculate available space after padding
    const availableWidth = a4Width - props.padding.left - props.padding.right;
    const availableHeight = a4Height - props.padding.top - props.padding.bottom;
    
    // Convert to pixels (1mm ≈ 3.78px)
    const mmToPx = 3.78;
    const availableWidthPx = availableWidth * mmToPx;
    const availableHeightPx = availableHeight * mmToPx;
    
    return {
      width: availableWidth,
      height: availableHeight,
      widthPx: availableWidthPx,
      heightPx: availableHeightPx
    };
  });
  
  // Convert mm to px for paginator components
  const pageWidthPx = computed(() => {
    const width = Math.round(210 * 3.78);
    console.log('📐 BaseTemplate - pageWidthPx:', width);
    return width;
  });
  const pageHeightPx = computed(() => {
    const height = Math.round(297 * 3.78);
    console.log('📐 BaseTemplate - pageHeightPx:', height);
    return height;
  });
  const pagePaddingPx = computed(() => {
    const padding = Math.round(props.padding.top * 3.78);
    console.log('📐 BaseTemplate - pagePaddingPx:', padding, 'from padding.top:', props.padding.top);
    return padding;
  });
  
  // Handle page change from paginator components
  const handlePageChange = (page) => {
    // The paginator components emit 0-based page indices, but we need 1-based for the store
    const oneBased = page + 1;
    paginationStore.setCurrentPage(oneBased);
    emit('page-change', oneBased);
  };
  
  // Expose navigation methods and available space to parent components
  defineExpose({
    nextPage,
    prevPage,
    goToPage,
    currentPage,
    availableSpace
  });
  
  // Function to check if content overflows and needs additional pages
  const checkContentOverflow = () => {
    if (!props.autoPages) return;
    
    // Implementation for auto-pagination would go here
    // This would require DOM manipulation to check heights and create new pages
    // For now, we'll rely on the pageCount prop and CSS page-break properties
    
    console.log('Available space:', availableSpace.value);
  };
  // Re-check when content might have changed
  watch(() => props.pageCount, checkContentOverflow);
  
  // Reset to page 1 if pageCount changes and current page is out of bounds
  watch(() => props.pageCount, (newPageCount) => {
    paginationStore.setPageCount(newPageCount);
    if (currentPage.value > newPageCount) {
      paginationStore.setCurrentPage(1);
      emit('page-change', 1);
    }
  });
  
  // Watch for changes in store pageCount and reset current page if needed
  watch(() => paginationStore.pageCount, (newPageCount) => {
    if (currentPage.value > newPageCount) {
      const newPage = Math.max(1, newPageCount);
      paginationStore.setCurrentPage(newPage);
      emit('page-change', newPage);
    }
  });
  
  // Initialize store with initial values
  onMounted(() => {
    paginationStore.setCurrentPage(props.initialPage);
    paginationStore.setPageCount(props.pageCount);
    checkContentOverflow();
  });
  </script>

  <style lang="scss" scoped>
  .resume-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .pagination-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 1.5rem;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
  }
  
  .pagination-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background: #f8fafc;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    color: #374151;
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover:not(:disabled) {
      background: #0ea5e9;
      color: white;
      border-color: #0ea5e9;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: #f3f4f6;
      color: #9ca3af;
    }
    
    svg {
      transition: transform 0.2s ease;
    }
    
    &.prev-btn svg {
      margin-right: 0.25rem;
    }
    
    &.next-btn svg {
      margin-left: 0.25rem;
    }
    
    &:hover:not(:disabled) svg {
      transform: translateX(2px);
    }
    
    &.prev-btn:hover:not(:disabled) svg {
      transform: translateX(-2px);
    }
  }
  
  .page-info {
    display: flex;
    align-items: center;
    padding: 0 1rem;
  }
  
  .page-indicator {
    font-weight: 600;
    color: #374151;
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
    background: #f1f5f9;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
    min-width: 4rem;
    text-align: center;
  }
  
  @media (max-width: 640px) {
    .pagination-controls {
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .pagination-btn {
      width: 100%;
      justify-content: center;
    }
  }
  </style>
  