<!-- AutoPaginatorOneColWithHeader.vue -->
<template>
    <div class="auto-paginator-1ch" :style="componentStyle" role="region" aria-label="Paginated document">
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
        <!-- Header area -->
        <div 
          class="page-header" 
          :style="{ 
            height: headerHeight + 'px',
            paddingTop: `${headerPaddingTop}px`,
            paddingRight: `${headerPaddingRight}px`,
            paddingBottom: `${headerPaddingBottom}px`,
            paddingLeft: `${headerPaddingLeft}px`,
            backgroundColor: headerBgColor
          }"
          role="banner"
          aria-label="Page header"
        >
          <div class="header-content" v-html="headerHtml"></div>
        </div>
        
        <!-- Column area (fills remaining height) -->
        <div
          class="col page-content column"
          :class="contentClass"
          :style="{ 
            width: '100%', 
            margin: '0 auto',
            backgroundColor: columnBgColor,
            paddingTop: columnPaddingTop + 'px',
            paddingRight: columnPaddingRight + 'px',
            paddingBottom: columnPaddingBottom + 'px',
            paddingLeft: columnPaddingLeft + 'px'
          }"
          v-html="pages[currentIdx]"
          role="region"
          aria-label="Column content"
        />
      </div>
  
     


      <!-- Hidden measurer (must mirror visible layout for accurate sizing) -->
      <div
        ref="measurer"
        class="hidden-measurer page-content"
        :class="contentClass"
        :style="{ 
          width: `${columnWidth}px`,
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
// Import Outfit font from local CDN
const outfitCssUrl = 'http://localhost:8081/fonts/css?family=Outfit:300,400,500,600,700';
  
  export default {
    name: 'AutoPaginatorOneColWithHeader',
    
    props: {
      /* content */
      html: { type: String, default: '' },
      headerHtml: { type: String, default: '' },
  
      /* page geometry */
      pageWidth:   { type: Number, default: 600 },
      pageHeight:  { type: Number, default: 420 },
      pagePadding: { type: Number, default: 0 },
      headerHeight:{ type: Number, default: 150 },
  
      /* header padding */
      headerPaddingTop: { type: [Number, String], default: 20 },
      headerPaddingRight: { type: [Number, String], default: 20 },
      headerPaddingBottom: { type: [Number, String], default: 20 },
      headerPaddingLeft: { type: [Number, String], default: 20 },
      headerBgColor: { type: String, default: '#0EA5E9' },
  
      /* column padding */
      columnPaddingTop: { type: [Number, String], default: 35 },
      columnPaddingRight: { type: [Number, String], default: 35 },
      columnPaddingBottom: { type: [Number, String], default: 35 },
      columnPaddingLeft: { type: [Number, String], default: 35 },
      columnBgColor: { type: String, default: '#e9e9e9' },
  
      /* styling helpers */
      contentClass:{ type: String, default: '' },
      fudgePx:     { type: Number, default: 1 },     // anti sub-pixel clipping
      safetyBuffer:{ type: Number, default: 15 },    // margin for overflow detection
      maxPages:    { type: Number, default: Infinity }, // hard cap
  
      /* controls */
      modelValue:  { type: Number, default: 0 },     // v-model for current page (0-index)
      showControls:{ type: Boolean, default: true },
      
      /* font */
      fontFamily: { type: String, default: 'Gabarito, sans-serif' },
    },
    
    emits: ['update:modelValue', 'page-change', 'update:pageCount'],
    
    data() {
      return {
        pages: [] // ['<html>', '<html>', ...]
      };
    },
    
    setup() {
      const paginationStore = usePaginationStore();
      return { paginationStore };
    },
    
    computed: {
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
      
      columnWidth() {
        const inner = this.pageWidth - 2 * this.pagePadding;
        return Math.max(0, inner);
      },
      
      componentStyle() {
        return {
          fontFamily: this.fontFamily + ' !important',
          '--component-font-family': this.fontFamily
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
      html: 'repaginate',
      headerHtml: 'repaginate',
      pageWidth: 'repaginate',
      pageHeight: 'repaginate',
      pagePadding: 'repaginate',
      headerHeight: 'repaginate',
      contentClass: 'repaginate',
      fudgePx: 'repaginate',
      headerPaddingTop: 'repaginate',
      headerPaddingRight: 'repaginate',
      headerPaddingBottom: 'repaginate',
      headerPaddingLeft: 'repaginate',
      headerBgColor: 'repaginate',
      columnPaddingTop: 'repaginate',
      columnPaddingRight: 'repaginate',
      columnPaddingBottom: 'repaginate',
      columnPaddingLeft: 'repaginate',
      columnBgColor: 'repaginate',
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
      
      logPageHtml() {
        console.log('--- Page HTML Content ---');
        this.pages.forEach((pageHtml, index) => {
          console.log(`--- Page ${index + 1} of ${this.pages.length} ---`);
          console.log(pageHtml);
        });
        console.log('--- End of Page HTML Content ---');
        alert(`HTML for ${this.pages.length} pages logged to console. Press F12 to view.`);
      },

      async generatePDF() {
        try {
          // Show loading indicator
          const button = document.querySelector('.pdf-button');
          const originalText = button.textContent;
          button.textContent = 'Generating...';
          button.disabled = true;
          
          // Prepare each page content with proper styling and font embedding
          const pagesWithStyles = this.pages.map(pageHtml => {
            // Create a div for each page with proper styling and font embedding
            return `
              <div style="
                page-break-after: always;
                font-size: 14px;
               
                font-family: 'Wix Madefor Text', sans-serif;
              ">
                <div style="
                
                  background-color: ${this.headerBgColor};
                  color: white;
                  text-align: center;
                  font-family: 'Wix Madefor Text', sans-serif;
                  padding: 20px;
                ">
                  ${this.headerHtml}
                </div>
                <div style="font-family: 'Wix Madefor Text', sans-serif;font-weight: 400; padding: 20px">
                  ${pageHtml}
                </div>
              </div>
            `;
          });
          
          // Add Google Fonts Wix Madefor Text link to each page
          const pagesWithFont = pagesWithStyles.map(pageHtml => {
            return `
              <link rel="preconnect" href="https://fonts.googleapis.com">
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
              <link href="https://fonts.googleapis.com/css2?family=Wix+Madefor+Text:wght@400;500;600;700&display=swap" rel="stylesheet">
              ${pageHtml}
            `;
          });
          
          // Call the PDF generation endpoint
          const response = await fetch('http://localhost:5001/generate-multi-page-pdf', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              pages: pagesWithFont,
              options: {
                format: 'A4',
                printBackground: true
              }
            })
          });
          
          if (!response.ok) {
            throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
          }
          
          // Get PDF as blob instead of trying to parse as JSON
          const pdfBlob = await response.blob();
          const pdfUrl = URL.createObjectURL(pdfBlob);
          
          // Create download link for the PDF
          const link = document.createElement('a');
          link.href = pdfUrl;
          link.download = `resume_${new Date().toISOString().slice(0,10)}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Clean up the URL object
          URL.revokeObjectURL(pdfUrl);
          
          // Reset button
          button.textContent = originalText;
          button.disabled = false;
          
          console.log('PDF generated successfully');
        } catch (error) {
          console.error('Error generating PDF:', error);
          alert(`Error generating PDF: ${error.message}`);
          
          // Reset button on error
          const button = document.querySelector('.pdf-button');
          button.textContent = 'Generate PDF';
          button.disabled = false;
        }
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
  
      /* -------------------- Margin-aware measurement (TOP-LEVEL) -------------------- */
      getEdgeMarginsForTopLevel(rootEl) {
        const first = rootEl.firstElementChild;
        const last  = rootEl.lastElementChild;
        const mt = first ? parseFloat(getComputedStyle(first).marginTop || '0') : 0;
        const mb = last  ? parseFloat(getComputedStyle(last).marginBottom || '0') : 0;
        return { mt, mb };
      },
      measuredHeightWithMargins(rootEl) {
        const { mt, mb } = this.getEdgeMarginsForTopLevel(rootEl);
        return rootEl.scrollHeight + mt + mb;
      },
  
      /* -------------------- Atomic block detection (e.g., languages rows) -------------------- */
      isAtomicBlock(node) {
        if (!node || node.nodeType !== Node.ELEMENT_NODE) return false;
        const el = node;
        if (el.classList?.contains('lang-item')) return true;
        if (el.dataset?.atomic === 'true') return true;
  
        // Heuristic: a row div with a small progress bar sibling/child
        if (el.tagName === 'DIV') {
          const hasBar =
            (el.querySelector && (el.querySelector('.lang-bar') ||
             el.querySelector('[style*="height: 6px"]') ||
             el.querySelector('[style*="height:6px"]')));
          const first = el.firstElementChild;
          const hasFlexHeader = first && getComputedStyle(first).display.includes('flex');
          if (hasBar && hasFlexHeader) return true;
        }
        return false;
      },
  
      /* -------------------- HTML-aware splitting core -------------------- */
      splitHtmlIntoChunks(html, measurer, maxContentHeight, safety = 0, maxPages = Infinity) {
        const self = this;
  
        const overflows = () => self.measuredHeightWithMargins(measurer) > (maxContentHeight - safety);
  
        const setMeasure = (node) => {
          // Wrap probe to mirror render (.column-content) for parity
          measurer.innerHTML = '';
          const wrap = document.createElement('div');
          wrap.className = 'column-content';
          wrap.appendChild(node.cloneNode(true));
          measurer.appendChild(wrap);
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
        
        const isSection = (node) =>
          node?.nodeType === Node.ELEMENT_NODE && node.classList?.contains('section');
  
        const isSectionTitle = (node) =>
          node?.nodeType === Node.ELEMENT_NODE && node.classList?.contains('section-title');
  
        // --- splitting helpers ---
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
  
        const splitSimpleBlock = (blockEl) => {
          const left = blockEl.cloneNode(false);
          const right = blockEl.cloneNode(false);
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
  
        const splitList = (listEl) => {
          const left = listEl.cloneNode(false);
          const right = listEl.cloneNode(false);
          for (const li of Array.from(listEl.children)) {
            const liClone = li.cloneNode(true);
            if (!tryAppend(left, liClone)) {
              const res = splitSimpleBlock(li);
              if (res.left && res.left.childNodes.length) { 
                const l = li.cloneNode(false); l.append(...res.left.childNodes); left.appendChild(l); 
              }
              if (res.right && res.right.childNodes.length) { 
                const r = li.cloneNode(false); r.append(...res.right.childNodes); right.appendChild(r); 
              } else { 
                right.appendChild(li.cloneNode(true)); 
              }
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
  
        const splitSection = (sectionEl) => {
          const left = sectionEl.cloneNode(false);
          const right = sectionEl.cloneNode(false);
  
          // Keep title with first content if possible
          let sectionTitle = null;
          for (const child of Array.from(sectionEl.childNodes)) {
            if (isSectionTitle(child)) { sectionTitle = child.cloneNode(true); break; }
          }
          if (sectionTitle) left.appendChild(sectionTitle.cloneNode(true));
  
          let foundTitle = false;
          for (const child of Array.from(sectionEl.childNodes)) {
            if (isSectionTitle(child)) { foundTitle = true; continue; }
  
            // FIRST content after title: force it with title if possible
            if (foundTitle && left.childNodes.length === 1) {
              const childClone = child.cloneNode(true);
              if (!tryAppend(left, childClone)) {
                // if even the first content can't fit, split it
                if (child.nodeType === Node.ELEMENT_NODE) {
                  // atomic? push whole to right with title copy
                  if (this.isAtomicBlock(child)) {
                    if (sectionTitle) right.appendChild(sectionTitle.cloneNode(true));
                    right.appendChild(child.cloneNode(true));
                  } else {
                    const res = splitSimpleBlock(child);
                    if (res.left && res.left.childNodes.length) left.appendChild(res.left);
                    if (res.right && res.right.childNodes.length) {
                      if (sectionTitle) right.appendChild(sectionTitle.cloneNode(true));
                      right.appendChild(res.right);
                    }
                  }
                }
                // move rest to right
                for (let sib = child.nextSibling; sib; sib = sib.nextSibling) right.appendChild(sib.cloneNode(true));
                return { left, right };
              }
              continue;
            }
  
            // Subsequent items
            const ok = tryAppend(left, child.cloneNode(true));
            if (!ok) {
              if (child.nodeType === Node.ELEMENT_NODE) {
                if (this.isAtomicBlock(child)) {
                  if (sectionTitle && right.childNodes.length === 0) {
                    right.appendChild(sectionTitle.cloneNode(true));
                  }
                  right.appendChild(child.cloneNode(true));
                } else {
                  const res = splitSimpleBlock(child);
                  if (res.left && res.left.childNodes.length) left.appendChild(res.left);
                  if (res.right && res.right.childNodes.length) {
                    if (sectionTitle && right.childNodes.length === 0) {
                      right.appendChild(sectionTitle.cloneNode(true));
                    }
                    right.appendChild(res.right);
                  } else {
                    if (sectionTitle && right.childNodes.length === 0) {
                      right.appendChild(sectionTitle.cloneNode(true));
                    }
                    right.appendChild(child.cloneNode(true));
                  }
                }
              } else {
                if (sectionTitle && right.childNodes.length === 0) {
                  right.appendChild(sectionTitle.cloneNode(true));
                }
                right.appendChild(child.cloneNode(true));
              }
              // move rest to right
              for (let sib = child.nextSibling; sib; sib = sib.nextSibling) {
                right.appendChild(sib.cloneNode(true));
              }
              return { left, right };
            }
          }
          return { left, right: right.childNodes.length > 0 ? right : null };
        };
  
        // --- main paginate loop ---
        const wrap = document.createElement('div');
        wrap.innerHTML = html || '';
        const nodes = Array.from(wrap.childNodes);
  
        let chunks = [];
        let col = document.createElement('div');
        const pushCol = () => {
          if (col.innerHTML.trim()) chunks.push(col.innerHTML);
          col = document.createElement('div');
        };
  
        for (const node of nodes) {
          const clone = node.cloneNode(true);
          if (tryAppend(col, clone)) continue;
  
          if (col.childNodes.length) {
            // current page has content; close it
            pushCol();
  
            // special: atomic block should go to next page intact if possible
            if (this.isAtomicBlock(clone)) {
              if (!tryAppend(col, clone)) {
                const { left, right } = splitSimpleBlock(clone);
                if (left) col.appendChild(left);
                pushCol();
                if (right) col.appendChild(right);
              }
              continue;
            }
  
            if (clone.nodeType === Node.ELEMENT_NODE && (clone.tagName === 'UL' || clone.tagName === 'OL')) {
              const { left, right } = splitList(clone);
              if (left) col.appendChild(left);
              pushCol();
              if (right) col.appendChild(right);
            } else if (isSection(clone)) {
              const { left, right } = splitSection(clone);
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
  
          // new page; atomic fast-path
          if (this.isAtomicBlock(clone)) {
            if (!tryAppend(col, clone)) {
              const { left, right } = splitSimpleBlock(clone);
              if (left) col.appendChild(left);
              pushCol();
              if (right) col.appendChild(right);
            }
            continue;
          }
  
          if (clone.nodeType === Node.ELEMENT_NODE && (clone.tagName === 'UL' || clone.tagName === 'OL')) {
            const { left, right } = splitList(clone);
            if (left) col.appendChild(left);
            pushCol();
            if (right) col.appendChild(right);
          } else if (isSection(clone)) {
            const { left, right } = splitSection(clone);
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
  
        if (col.childNodes.length) pushCol();
        if (chunks.length === 0) chunks.push('');
  
        // Re-split last chunk until it fits or max passes reached
        let passes = 0;
        while (passes < maxPages) {
          const last = chunks[chunks.length - 1];
          measurer.innerHTML = last;
          if (!(self.measuredHeightWithMargins(measurer) > (maxContentHeight - safety))) break;
  
          const wrap2 = document.createElement('div');
          wrap2.innerHTML = last;
          const nodes2 = Array.from(wrap2.childNodes);
  
          let col2 = document.createElement('div');
          const newChunks = [];
  
          for (const node of nodes2) {
            const clone = node.cloneNode(true);
            if (!tryAppend(col2, clone)) {
              if (col2.childNodes.length) {
                newChunks.push(col2.innerHTML);
                col2 = document.createElement('div');
              }
              if (clone.nodeType === Node.ELEMENT_NODE) {
                if (this.isAtomicBlock(clone)) {
                  // push whole atomic block to a new page
                  newChunks.push(''); // close empty current if needed
                  col2 = document.createElement('div');
                  if (!tryAppend(col2, clone)) {
                    // atomic too tall: split as last resort
                    const { left, right } = splitSimpleBlock(clone);
                    if (left) {
                      col2.appendChild(left);
                      newChunks.push(col2.innerHTML);
                      col2 = document.createElement('div');
                    }
                    if (right) col2.appendChild(right);
                  }
                } else {
                  const { left, right } = splitSimpleBlock(clone);
                  if (left) {
                    col2.appendChild(left);
                    newChunks.push(col2.innerHTML);
                    col2 = document.createElement('div');
                  }
                  if (right) col2.appendChild(right);
                }
              } else {
                col2.appendChild(clone);
              }
            }
          }
          if (col2.childNodes.length) newChunks.push(col2.innerHTML);
  
          chunks.splice(chunks.length - 1, 1, ...newChunks.filter(s => s !== ''));
          passes++;
        }
  
        return chunks;
      },
  
      /* -------------------- Optional auto-wrapper for Languages HTML -------------------- */
      autoWrapLanguages(html) {
        if (!html) return html;
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
  
        if (tmp.querySelector('.languages-section')) return html; // already wrapped
  
        const nodes = Array.from(tmp.childNodes);
        const out = document.createElement('section');
        out.className = 'section languages-section';
  
        let i = 0;
        if (nodes[i] && nodes[i].nodeType === 1 && (nodes[i].matches('h1,h2,h3') || nodes[i].classList?.contains('section-title'))) {
          const h = nodes[i++].cloneNode(true);
          h.classList.add('section-title');
          out.appendChild(h);
        }
  
        for (; i < nodes.length; i++) {
          const n = nodes[i];
          if (n.nodeType === 1 && n.tagName === 'DIV') {
            const item = document.createElement('div');
            item.className = 'lang-item';
            item.appendChild(n.cloneNode(true));
  
            const next = nodes[i + 1];
            if (next && next.nodeType === 1 && next.tagName === 'DIV') {
              const s = next.getAttribute('style') || '';
              if (s.includes('height: 6px') || next.querySelector?.('[style*="width:"]')) {
                // mark the bar for heuristics too
                next.classList?.add('lang-bar');
                item.appendChild(next.cloneNode(true));
                i++;
              }
            }
            out.appendChild(item);
          }
        }
        return out.outerHTML;
      },
  
      repaginate() {
        // Prepare content: optional auto-wrap + ensure column-content wrapper for input
        let prepared = this.html.trim();
        prepared = this.autoWrapLanguages(prepared);
  
        if (!prepared.startsWith('<div class="column-content">')) {
          prepared = `<div class="column-content">${prepared}</div>`;
        }
  
        // Mirror measurer styles
        if (this.$refs.measurer) {
          this.$refs.measurer.style.paddingTop = `${this.columnPaddingTop}px`;
          this.$refs.measurer.style.paddingRight = `${this.columnPaddingRight}px`;
          this.$refs.measurer.style.paddingBottom = `${this.columnPaddingBottom}px`;
          this.$refs.measurer.style.paddingLeft = `${this.columnPaddingLeft}px`;
          this.$refs.measurer.style.boxSizing = 'border-box';
          this.$refs.measurer.style.width = `${this.columnWidth}px`;
        }
  
        // Compute safe height
        const columnHeight = this.pageHeight - 2 * this.pagePadding - this.headerHeight - this.fudgePx;
        const safeHeightNoPad = columnHeight - (Number(this.columnPaddingTop) + Number(this.columnPaddingBottom));
        const finalSafeHeight = Math.max(100, safeHeightNoPad);
  
        // Split content
        let chunks = this.splitHtmlIntoChunks(
          prepared,
          this.$refs.measurer,
          finalSafeHeight,
          this.safetyBuffer,
          this.maxPages
        );
  
        // Ensure each page has the wrapper for render/measurer parity
        chunks = chunks.map(c => `<div class="column-content">${c}</div>`);
  
        // Enforce maxPages hard cap (merge tail, then fit tail into one page)
        if (Number.isFinite(this.maxPages) && chunks.length > this.maxPages) {
          const keep = chunks.slice(0, this.maxPages - 1);
          const mergedTailRaw = chunks.slice(this.maxPages - 1).join('');
          const fittedTailArr = this.splitHtmlIntoChunks(
            `<div class="column-content">${mergedTailRaw}</div>`,
            this.$refs.measurer,
            finalSafeHeight,
            this.safetyBuffer,
            1
          );
          const fittedTail = (fittedTailArr[0] || `<div class="column-content"></div>`);
          chunks = [...keep, fittedTail];
        }
  
        // Set pages
        this.pages = chunks;
  
        // Update store & emit count
        this.paginationStore.setPageCount(this.pages.length);
        this.$emit('update:pageCount', this.pages.length);
  
        // Keep current index in bounds
        if (this.currentIdx > this.pages.length - 1) {
          this.currentIdx = this.pages.length - 1;
        }
        if (this.currentIdx < 0) {
          this.currentIdx = 0;
        }
  
        // Debug verify: log any overflow
        this.$nextTick(() => {
          if (this.$refs.measurer && chunks.length > 0) {
            for (let i = 0; i < chunks.length; i++) {
              this.$refs.measurer.innerHTML = chunks[i];
              const contentHeight = this.measuredHeightWithMargins(this.$refs.measurer);
              if (contentHeight > (finalSafeHeight - this.safetyBuffer)) {
                console.warn(`⚠️ Page ${i+1} exceeds available height by ${contentHeight - (finalSafeHeight - this.safetyBuffer)}px`);
              }
            }
          }
        });
      }
    }
  }
  </script>
    
  <style scoped>
  /* Base styles */
  .auto-paginator-1ch {
    display: grid;
    font-family: 'Outfit', sans-serif !important;
  }
  
  .page {
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    box-sizing: border-box;
    overflow: hidden;
  }
  
  .page-header {
    color: white;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow: hidden;
    box-sizing: border-box; /* headerHeight includes padding */
    position: relative; /* Ensure positioning context */
  }
  
  .header-content {
    width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* Remove max-height constraint */
    /* Remove overflow hidden which might be clipping content */
  }
  
  /* Ensure header content is always visible */
  .header-content * {
    margin: 0;
    padding: 0;
    line-height: 1.3;
    white-space: normal;
    overflow-wrap: break-word;
  }
  
  /* Column area */
  .column {
    flex: 1;
    box-sizing: border-box;
  }
  
  .page-content {
    font-size: 14px;
    line-height: 1.6;
    word-break: break-word;
    /* tiny padding to prevent parent/child margin collapse at the bottom edge */
    padding-bottom: 0.1px;
  }
  
  /* Keep default block flow (avoid display: contents) */
  .column-content {
    /* structure wrapper to match measurer */
  }
  
  /* Hidden measurer */
  .hidden-measurer {
    position: absolute;
    visibility: hidden;
    pointer-events: none;
    left: -9999px;
    top: 0;
    z-index: -1;
  }
  
  /* Guardrails for images and trailing margins */
  .page-content img { max-width: 100%; height: auto; }
  .page-content > *:last-child { margin-bottom: 0 !important; }
  .page-content .column-content > *:last-child { margin-bottom: 0 !important; }
  
  /* Debug button styles */
  .debug-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #0EA5E9;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 14px;
    cursor: pointer;
    z-index: 1000;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transition: background-color 0.2s;
  }

  .debug-button:hover {
    background-color: #0284c7;
  }

  .debug-button:active {
    transform: translateY(1px);
  }

  /* PDF button styles */
  .pdf-button {
    position: fixed;
    bottom: 20px;
    right: 150px;
    background-color: #10B981;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 14px;
    cursor: pointer;
    z-index: 1000;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transition: background-color 0.2s;
  }

  .pdf-button:hover {
    background-color: #059669;
  }

  .pdf-button:active {
    transform: translateY(1px);
  }

  .pdf-button:disabled {
    background-color: #94A3B8;
    cursor: not-allowed;
  }

  /* Font inheritance for all child elements */
  .auto-paginator-1ch,
  .auto-paginator-1ch * {
    font-family: var(--component-font-family) !important;
  }

  /* Print media styles */
  @media print {
    .auto-paginator-1ch { display: block; }
    .page {
      border: none;
      page-break-after: always;
      margin: 0;
      padding: 0;
      width: 100% !important;
      height: auto !important;
    }
    .page:not(:first-child) { display: block !important; }
    .debug-button { display: none; }
  }
  </style>
  