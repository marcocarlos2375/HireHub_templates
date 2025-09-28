import { defineStore } from 'pinia';

/**
 * Store for managing resume pagination state
 */
export const usePaginationStore = defineStore('pagination', {
  state: () => ({
    currentPage: 1,
    pageCount: 2, // Default to 2 pages for most resume templates
  }),
  
  actions: {
    /**
     * Set the current page
     * @param {number} page - The page number to set
     */
    setCurrentPage(page) {
      if (page >= 1 && page <= this.pageCount) {
        this.currentPage = page;
      }
    },
    
    /**
     * Navigate to the next page
     */
    nextPage() {
      if (this.currentPage < this.pageCount) {
        this.currentPage++;
      }
    },
    
    /**
     * Navigate to the previous page
     */
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    
    /**
     * Set the total number of pages
     * @param {number} count - The total number of pages
     */
    setPageCount(count) {
      this.pageCount = count;
    },
    
    /**
     * Reset pagination to default values
     */
    resetPagination() {
      this.currentPage = 1;
      this.pageCount = 2;
    }
  },
  
  getters: {
    /**
     * Check if there is a next page available
     * @returns {boolean} - True if there is a next page
     */
    hasNextPage: (state) => state.currentPage < state.pageCount,
    
    /**
     * Check if there is a previous page available
     * @returns {boolean} - True if there is a previous page
     */
    hasPrevPage: (state) => state.currentPage > 1,
    
    /**
     * Get the current page display text
     * @returns {string} - Current page display text (e.g., "1/2")
     */
    pageDisplay: (state) => `${state.currentPage}/${state.pageCount}`
  }
});
