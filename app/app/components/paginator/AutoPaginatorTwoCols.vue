<!-- AutoPaginatorTwoCols.vue -->
<template>
    <div class="auto-paginator-2c" :style="componentStyle" role="region" aria-label="Paginated document">
      <!-- ONE visible page -->
      <div
        v-if="pages.length"
        class="page"
        :style="{
          width: pageWidth + 'px',
          height: pageHeight + 'px',
          padding: pagePadding + 'px',
          boxSizing: 'border-box'
        }"
        role="document"
        aria-label="Page content"
      >
        <!-- Two columns area -->
        <div class="page-columns" :style="{ gap: columnGutter + 'px' }">
          <div
            class="col page-content left-column"
            :class="contentClass"
            :style="{ 
              width: leftColumnWidth + 'px',
              backgroundColor: leftColumnBgColor,
              paddingTop: columnPaddingTop + 'px',
              paddingRight: columnPaddingRight + 'px',
              paddingBottom: columnPaddingBottom + 'px',
              paddingLeft: columnPaddingLeft + 'px'
            }"
            v-html="pages[currentIdx].left"
            role="region"
            aria-label="Left column content"
          />
          <div
            class="col page-content right-column"
            :class="contentClass"
            :style="{ 
              width: rightColumnWidth + 'px',
              backgroundColor: rightColumnBgColor,
              paddingTop: columnPaddingTop + 'px',
              paddingRight: columnPaddingRight + 'px',
              paddingBottom: columnPaddingBottom + 'px',
              paddingLeft: columnPaddingLeft + 'px'
            }"
            v-html="pages[currentIdx].right"
            role="region"
            aria-label="Right column content"
          />
        </div>
      </div>
  
  
      <!-- Pagination controls -->
      <div v-if="showControls && pages.length > 1" class="pager">
        <button 
          class="btn" 
          @click="prevPage" 
          :disabled="!paginationStore.hasPrevPage"
          aria-label="Previous page"
        >
          &larr;
        </button>
        <span class="indicator">{{ paginationStore.currentPage }} / {{ paginationStore.pageCount }}</span>
        <button 
          class="btn" 
          @click="nextPage" 
          :disabled="!paginationStore.hasNextPage"
          aria-label="Next page"
        >
          &rarr;
        </button>
      </div>
  
      <!-- Hidden measurers -->
      <div
        ref="measurerLeft"
        class="hidden-measurer page-content"
        :class="contentClass"
        :style="{ 
          width: leftColumnWidth + 'px',
          paddingTop: `${columnPaddingTop}px`,
          paddingRight: `${columnPaddingRight}px`,
          paddingBottom: `${columnPaddingBottom}px`,
          paddingLeft: `${columnPaddingLeft}px`,
          boxSizing: 'border-box'
        }"
      />
      <div
        ref="measurerRight"
        class="hidden-measurer page-content"
        :class="contentClass"
        :style="{ 
          width: rightColumnWidth + 'px',
          paddingTop: `${columnPaddingTop}px`,
          paddingRight: `${columnPaddingRight}px`,
          paddingBottom: `${columnPaddingBottom}px`,
          paddingLeft: `${columnPaddingLeft}px`,
          boxSizing: 'border-box'
        }"
      />
    </div>
  </template>
  
  <script>
  import { usePaginationStore } from '~/stores/pagination';
  
  // Local font CDN URL
  const outfitCssUrl = 'http://localhost:8081/fonts/css?family=Outfit:300,400,500,600,700';
  
  export default {
    name: 'AutoPaginatorTwoCols',
    
    props: {
      leftHtml: { type: String, default: '' },
      rightHtml: { type: String, default: '' },
      modelValue: { type: Number, default: 0 },
      pageWidth: { type: Number, default: 794 }, // A4 width in px at 96dpi
      pageHeight: { type: Number, default: 1123 }, // A4 height in px at 96dpi
      pagePadding: { type: Number, default: 48 },
      contentClass: { type: String, default: '' },
      fudgePx: { type: Number, default: 0 }, // Adjustment for browser inconsistencies
      columnGutter: { type: Number, default: 0 },
      columnPaddingTop: { type: Number, default: 0 },
      columnPaddingRight: { type: Number, default: 0 },
      columnPaddingBottom: { type: Number, default: 0 },
      columnPaddingLeft: { type: Number, default: 0 },
      leftColumnBgColor: { type: String, default: '#0EA5E9' },
      rightColumnBgColor: { type: String, default: '#e9e9e9' },
      safetyBuffer: { type: Number, default: 10 }, // px to subtract from max height for safety
      maxPages: { type: Number, default: Infinity },
      showControls: { type: Boolean, default: true },
      fontFamily: { type: String, default: 'Gabarito, sans-serif' },
    },
    
    emits: ['update:modelValue', 'page-change'],
    
    data() {
      return {
        pages: [], // [{left: '<html>', right: '<html>'}, ...]
        isGeneratingPDF: false,
        pdfGenerationError: null
      };
    },
    
    setup() {
      const paginationStore = usePaginationStore();
      return { paginationStore };
    },
    
    computed: {
      leftColumnWidth() {
        const inner = this.pageWidth - 2 * this.pagePadding - this.columnGutter;
        return Math.max(0, inner * 0.3); // 30% of available width
      },
      
      rightColumnWidth() {
        const inner = this.pageWidth - 2 * this.pagePadding - this.columnGutter;
        return Math.max(0, inner * 0.7); // 70% of available width
      },
      
      columnWidth() {
        // Legacy support for existing code
        const inner = this.pageWidth - 2 * this.pagePadding - this.columnGutter;
        return Math.max(0, inner / 2);
      },
      
      columnMaxHeight() {
        return Math.max(0, this.pageHeight - 2 * this.pagePadding - this.fudgePx);
      },
      
      totalPages() {
        return this.pages.length || 1;
      },
      
      currentIdx: {
        get() {
          // store is 1-indexed
          return Math.min(Math.max(this.paginationStore.currentPage - 1, 0), this.totalPages - 1);
        },
        set(v) {
          const c = Math.min(Math.max(v, 0), this.totalPages - 1);
          this.$emit('update:modelValue', c);
          this.$emit('page-change', c);
          this.paginationStore.setCurrentPage(c + 1); // sync store (1-indexed)
        }
      },
      
      componentStyle() {
        return {
          fontFamily: this.fontFamily + ' !important'
        };
      }
    },
    
    watch: {
      // Store → component sync
      'paginationStore.currentPage'(newPage) {
        const idx = Math.min(Math.max(newPage - 1, 0), this.totalPages - 1);
        if (idx !== this.currentIdx) {
          this.$emit('update:modelValue', idx);
          this.$emit('page-change', idx);
        }
      },
      // v-model → component/store sync
      modelValue(newIdx) {
        const clamped = Math.min(Math.max(newIdx, 0), this.totalPages - 1);
        if (clamped !== this.currentIdx) {
          this.currentIdx = clamped;
        }
      },
  
      // props that affect layout/pagination
      leftHtml: 'repaginate',
      rightHtml: 'repaginate',
      pageWidth: 'repaginate',
      pageHeight: 'repaginate',
      pagePadding: 'repaginate',
      contentClass: 'repaginate',
      fudgePx: 'repaginate',
      columnGutter: 'repaginate',
      columnPaddingTop: 'repaginate',
      columnPaddingRight: 'repaginate',
      columnPaddingBottom: 'repaginate',
      columnPaddingLeft: 'repaginate',
      leftColumnBgColor: 'repaginate',
      rightColumnBgColor: 'repaginate',
      safetyBuffer: 'repaginate',
      maxPages: 'repaginate'
    },
    
    mounted() {
      // Add Outfit font CSS link to document head
      if (!document.querySelector(`link[href="${outfitCssUrl}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = outfitCssUrl;
        document.head.appendChild(link);
      }
      
      this.$nextTick(() => {
        this.repaginate();
        window.addEventListener('keydown', this.handleKeyDown);
      });
    },
    
    beforeUnmount() {
      window.removeEventListener('keydown', this.handleKeyDown);
    },
    
    methods: {
      nextPage() { 
        if (this.paginationStore.hasNextPage) this.paginationStore.nextPage();
      },
      
      prevPage() { 
        if (this.paginationStore.hasPrevPage) this.paginationStore.prevPage();
      },
      
      handleKeyDown(e) {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
          if (this.paginationStore.hasNextPage) {
            this.nextPage();
            e.preventDefault();
          }
        } else if (e.key === 'ArrowLeft' || e.key === 'Backspace' || e.key === 'PageUp') {
          if (this.paginationStore.hasPrevPage) {
            this.prevPage();
            e.preventDefault();
          }
        } else if (e.key === 'Home') {
          this.paginationStore.setCurrentPage(1);
          e.preventDefault();
        } else if (e.key === 'End') {
          this.paginationStore.setCurrentPage(this.paginationStore.pageCount);
          e.preventDefault();
        }
      },
      
      
      // Split HTML into chunks that fit within maxHeight
      splitHtmlIntoChunks(html, measurer, maxHeight) {
        const MAX = maxHeight;
        const overflows = () => measurer.scrollHeight > MAX;
        
        const setMeasure = (node) => {
          measurer.innerHTML = '';
          measurer.appendChild(node.cloneNode(true));
        };
        
        const tryAppend = (container, node) => {
          container.appendChild(node);
          setMeasure(container);
          if (overflows()) {
            container.removeChild(container.lastChild);
            return false;
          }
          return true;
        };
        
        // Split plain text to fit into baseContainer using binary search
        const splitTextToFit = (baseContainer, textNode) => {
          const full = textNode.textContent || '';
          if (!full) return [null, null];
          let lo = 1, hi = full.length, best = 0;
          while (lo <= hi) {
            const mid = (lo + hi) >> 1;
            const c = baseContainer.cloneNode(true);
            c.appendChild(document.createTextNode(full.slice(0, mid)));
            setMeasure(c);
            if (!overflows()) { best = mid; lo = mid + 1; } else { hi = mid - 1; }
          }
          if (best === 0) return [null, textNode];
          const left = document.createTextNode(full.slice(0, best));
          const right = full.length > best ? document.createTextNode(full.slice(best)) : null;
          return [left, right];
        };
        
        // Split a simple block (p/li/div…) with inline/text children
        const splitSimpleBlock = (blockEl) => {
          const left = blockEl.cloneNode(false);
          const right = blockEl.cloneNode(false);
          
          // Check if this is an atomic block that shouldn't be split
          if (blockEl.classList && blockEl.classList.contains('atomic-block')) {
            return { left: null, right: blockEl.cloneNode(true) };
          }
          
          for (const child of Array.from(blockEl.childNodes)) {
            if (child.nodeType === Node.TEXT_NODE) {
              const [lt, rt] = splitTextToFit(left, child);
              if (lt) left.appendChild(lt);
              
              const probe = document.createElement('div');
              probe.appendChild(left.cloneNode(true));
              setMeasure(probe);
              if (overflows()) {
                if (rt) right.appendChild(rt);
                for (let sib = child.nextSibling; sib; sib = sib.nextSibling) right.appendChild(sib.cloneNode(true));
                return { left, right };
              }
              if (rt) {
                right.appendChild(rt);
                for (let sib = child.nextSibling; sib; sib = sib.nextSibling) right.appendChild(sib.cloneNode(true));
                return { left, right };
              }
            } else {
              const ok = tryAppend(left, child.cloneNode(true));
              if (!ok) {
                if (child.nodeType === Node.ELEMENT_NODE) {
                  const res = splitSimpleBlock(child);
                  if (res.left && res.left.childNodes.length) left.appendChild(res.left);
                  if (res.right && res.right.childNodes.length) right.appendChild(res.right);
                } else {
                  right.appendChild(child.cloneNode(true));
                }
                for (let sib = child.nextSibling; sib; sib = sib.nextSibling) right.appendChild(sib.cloneNode(true));
                return { left, right };
              }
            }
          }
          return { left, right: null };
        };
        
        // Split UL/OL across pages
        const splitList = (listEl) => {
          const left = listEl.cloneNode(false);
          const right = listEl.cloneNode(false);
          
          for (const li of Array.from(listEl.children)) {
            const liClone = li.cloneNode(true);
            if (!tryAppend(left, liClone)) {
              const res = splitSimpleBlock(li);
              if (res.left && res.left.childNodes.length) { 
                const l = li.cloneNode(false); 
                l.append(...res.left.childNodes); 
                left.appendChild(l); 
              }
              if (res.right && res.right.childNodes.length) { 
                const r = li.cloneNode(false); 
                r.append(...res.right.childNodes); 
                right.appendChild(r); 
              } else { 
                right.appendChild(li.cloneNode(true)); 
              }
              
              // move the rest of LIs to right
              let move = false;
              for (const rest of Array.from(listEl.children)) {
                if (rest === li) { move = true; continue; }
                if (move) right.appendChild(rest.cloneNode(true));
              }
              return { left, right };
            }
          }
          return { left, right: null };
        };
        
        // MAIN paginate loop
        const wrap = document.createElement('div');
        wrap.innerHTML = html || '';
        const nodes = Array.from(wrap.childNodes);
        
        const chunks = [];
        let col = document.createElement('div');
        const pushCol = () => { chunks.push(col.innerHTML); col = document.createElement('div'); };
        
        for (const node of nodes) {
          const clone = node.cloneNode(true);
          
          // Special case: first node itself is too tall
          if (col.childNodes.length === 0) {
            col.appendChild(clone);
            setMeasure(col);
            if (overflows()) {
              col.removeChild(clone);
              if (clone.nodeType === Node.ELEMENT_NODE && (clone.tagName === 'UL' || clone.tagName === 'OL')) {
                const { left, right } = splitList(clone);
                if (left) col.appendChild(left);
                pushCol();
                if (right) col.appendChild(right);
              } else if (clone.nodeType === Node.ELEMENT_NODE) {
                const { left, right } = splitSimpleBlock(clone);
                if (left) col.appendChild(left);
                pushCol();
                if (right) col.appendChild(right);
              } else {
                const p = document.createElement('p'); p.appendChild(clone);
                const { left, right } = splitSimpleBlock(p);
                if (left) col.appendChild(left);
                pushCol();
                if (right) col.appendChild(right);
              }
              continue;
            }
          }
          
          // Normal case
          if (tryAppend(col, clone)) continue;
          
          if (col.childNodes.length) {
            pushCol();
            if (!tryAppend(col, clone)) {
              if (clone.nodeType === Node.ELEMENT_NODE && (clone.tagName === 'UL' || clone.tagName === 'OL')) {
                const { left, right } = splitList(clone);
                if (left) col.appendChild(left);
                pushCol();
                if (right) col.appendChild(right);
              } else if (clone.nodeType === Node.ELEMENT_NODE) {
                const { left, right } = splitSimpleBlock(clone);
                if (left) col.appendChild(left);
                pushCol();
                if (right) col.appendChild(right);
              } else {
                const p = document.createElement('p'); p.appendChild(clone);
                const { left, right } = splitSimpleBlock(p);
                if (left) col.appendChild(left);
                pushCol();
                if (right) col.appendChild(right);
              }
            }
            continue;
          }
        }
        
        if (col.childNodes.length) pushCol();
        if (chunks.length === 0) chunks.push('');
        
        return chunks;
      },
      
      // Ensure a chunk fits into safe space; split further if needed
      enforceSafeSpace(html, measurer, maxHeight) {
        if (!html) return [''];
        measurer.innerHTML = html;
        if (measurer.scrollHeight <= maxHeight) {
          return [html]; // already fits
        }
        // re-split this html into smaller pieces
        return this.splitHtmlIntoChunks(html, measurer, maxHeight);
      },
      
      // Repaginate both columns with current measurements
      repaginate() {
        const maxH = this.columnMaxHeight;
        
        // split raw content into initial chunks
        let leftChunks = this.splitHtmlIntoChunks(this.leftHtml, this.$refs.measurerLeft, maxH);
        let rightChunks = this.splitHtmlIntoChunks(this.rightHtml, this.$refs.measurerRight, maxH);
        
        // enforce safe space on each chunk separately
        leftChunks = leftChunks.flatMap(chunk => this.enforceSafeSpace(chunk, this.$refs.measurerLeft, maxH));
        rightChunks = rightChunks.flatMap(chunk => this.enforceSafeSpace(chunk, this.$refs.measurerRight, maxH));
        
        const maxChunks = Math.max(leftChunks.length, rightChunks.length);
        const maxPagesLimit = this.maxPages || 6; // hard cap if not specified
        const pagesArr = [];
        
        for (let i = 0; i < maxChunks && i < maxPagesLimit; i++) {
          pagesArr.push({
            left: leftChunks[i] || '',
            right: rightChunks[i] || ''
          });
        }
        
        if (maxChunks > maxPagesLimit) {
          console.warn(
            `⚠️ Content truncated: ${maxChunks} pages worth of content, but showing only ${maxPagesLimit}.`
          );
        }
        
        this.pages = pagesArr;
        
        // Update pagination store
        this.paginationStore.setPageCount(this.totalPages);
        
        // Ensure current index is valid
        if (this.currentIdx > this.pages.length - 1) {
          this.currentIdx = Math.max(0, this.pages.length - 1);
        }
      },
      
      // Generate PDF from all pages
      async generatePDF() {
        if (this.isGeneratingPDF) return;
        
        this.isGeneratingPDF = true;
        this.pdfGenerationError = null;
        
        try {
          // Add Google font for PDF
          const fontLink = document.createElement('link');
          fontLink.rel = 'stylesheet';
          fontLink.href = 'https://fonts.googleapis.com/css2?family=Wix+Madefor+Text:wght@400;500;600;700&display=swap';
          document.head.appendChild(fontLink);
          
          // Wait for font to load
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Prepare pages with font and styling
          const pagesWithFont = this.pages.map((page, idx) => {
            const pageStyles = `
              <style>
                @import url('https://fonts.googleapis.com/css2?family=Wix+Madefor+Text:wght@400;500;600;700&display=swap');
                body {
                  font-family: 'Wix Madefor Text', sans-serif;
                  margin: 0;
                  padding: 0;
                }
                .page {
                  width: ${this.pageWidth}px;
                  height: ${this.pageHeight}px;
                  padding: ${this.pagePadding}px;
                  box-sizing: border-box;
                  position: relative;
                }
                .page-columns {
                  display: grid;
                  grid-template-columns: 30% 70%;
                  gap: 0px;
                }
                .col.left-column {
                  width: ${this.leftColumnWidth}px;
                  background-color: ${this.leftColumnBgColor};
                  padding-top: ${this.columnPaddingTop}px;
                  padding-right: ${this.columnPaddingRight}px;
                  padding-bottom: ${this.columnPaddingBottom}px;
                  padding-left: ${this.columnPaddingLeft}px;
                  color: white;
                }
                .col.right-column {
                  width: ${this.rightColumnWidth}px;
                  background-color: ${this.rightColumnBgColor};
                  padding-top: ${this.columnPaddingTop}px;
                  padding-right: ${this.columnPaddingRight}px;
                  padding-bottom: ${this.columnPaddingBottom}px;
                  padding-left: ${this.columnPaddingLeft}px;
                  color: black;
                }
              </style>
            `;
            
            return `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
                <title>Resume Page ${idx + 1}</title>
                ${pageStyles}
              </head>
              <body>
                <div class="page">
                  <div class="page-columns">
                    <div class="col left-column">${page.left}</div>
                    <div class="col right-column">${page.right}</div>
                  </div>
                </div>
              </body>
              </html>
            `;
          });
          
          // Call backend PDF generation service
          const response = await fetch('http://localhost:5001/generate-multi-page-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              pages: pagesWithFont,
              options: {
                format: 'A4',
                printBackground: true
              }
            })
          });
          
          if (!response.ok) {
            throw new Error(`PDF generation failed: ${response.statusText}`);
          }
          
          // Get PDF blob and trigger download
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'resume.pdf';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          
          // Clean up font link
          document.head.removeChild(fontLink);
        } catch (error) {
          console.error('PDF generation error:', error);
          this.pdfGenerationError = error.message || 'Failed to generate PDF';
        } finally {
          this.isGeneratingPDF = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .auto-paginator-2c {
    display: grid;
    gap: 12px;
  }
  .page {
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    box-sizing: border-box;
    overflow: hidden;
  }
  .page-columns {
    flex: 1;
    display: grid;
    grid-template-columns: 30% 70%;
    gap: 0;
  }
  .page-content {
    font-size: 14px;
    line-height: 1.6;
    word-break: break-word;
  }
  .hidden-measurer {
    position: absolute;
    visibility: hidden;
    pointer-events: none;
    left: -9999px;
    top: 0;
    z-index: -1;
  }
  .pager {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
  }
  .btn {
    padding: 6px 10px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background: #fff;
    cursor: pointer;
  }
  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .indicator { 
    font-variant-numeric: tabular-nums; 
  }
  .pdf-button {
    padding: 8px 16px;
    background-color: #4f46e5;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  .pdf-button:hover {
    background-color: #4338ca;
  }
  .pdf-button:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
  </style>
  