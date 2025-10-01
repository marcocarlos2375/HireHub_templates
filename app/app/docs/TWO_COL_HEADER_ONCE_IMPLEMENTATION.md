# AutoPaginatorTwoColsWithHeaderOnce Implementation Plan

## Goal
Create a performant two-column paginator with header-once pattern, combining:
- ✅ Advanced splitting from `AutoPaginatorOneColHeaderOnce.vue`
- ✅ Two-column layout from `AutoPaginatorTwoColsWithHeader.vue`
- ✅ Header shown only on first page

---

## Architecture

### **Template Structure**
```vue
<template>
  <div class="auto-paginator-2ch">
    <div class="page">
      <!-- Header (v-if="currentIdx === 0") -->
      <div v-if="currentIdx === 0" class="page-header">
        {{ headerHtml }}
      </div>
      
      <!-- Two columns -->
      <div class="page-columns">
        <div class="left-column">{{ pages[currentIdx].left }}</div>
        <div class="right-column">{{ pages[currentIdx].right }}</div>
      </div>
    </div>
    
    <!-- 3 Hidden measurers: header, left, right -->
  </div>
</template>
```

### **Data Structure**
```javascript
pages: [
  { left: '<html>', right: '<html>' },
  { left: '<html>', right: '<html>' },
  ...
]
```

---

## Key Implementation Details

### **1. Column Width Calculation**
```javascript
computed: {
  leftColumnWidth() {
    const inner = this.pageWidth - 2 * this.pagePadding - this.columnGutter;
    return inner * this.leftColumnRatio; // Default 0.3 (30%)
  },
  
  rightColumnWidth() {
    const inner = this.pageWidth - 2 * this.pagePadding - this.columnGutter;
    return inner * (1 - this.leftColumnRatio); // Default 0.7 (70%)
  }
}
```

### **2. Dynamic Height Per Page**
```javascript
// Page 1 has header, pages 2+ don't
const getHeightForPage = (pageIndex, column) => {
  if (pageIndex === 0) {
    // First page: less space (has header)
    return pageHeight - pagePadding - headerHeight - columnPadding;
  } else {
    // Pages 2+: more space (no header)
    return pageHeight - pagePadding - columnPadding;
  }
};
```

### **3. Independent Column Pagination**
```javascript
repaginate() {
  // Split LEFT column with dynamic heights
  const leftChunks = this.splitHtmlIntoChunks(
    leftHtml,
    this.$refs.measurerLeft,
    (pageIndex) => getHeightForPage(pageIndex, 'left'),
    this.safetyBuffer,
    this.maxPages
  );
  
  // Split RIGHT column with dynamic heights
  const rightChunks = this.splitHtmlIntoChunks(
    rightHtml,
    this.$refs.measurerRight,
    (pageIndex) => getHeightForPage(pageIndex, 'right'),
    this.safetyBuffer,
    this.maxPages
  );
  
  // Combine into pages
  const maxChunks = Math.max(leftChunks.length, rightChunks.length);
  this.pages = [];
  for (let i = 0; i < maxChunks; i++) {
    this.pages.push({
      left: leftChunks[i] || '',
      right: rightChunks[i] || ''
    });
  }
}
```

---

## Splitting Functions to Include

### **From OneColHeaderOnce (All the advanced ones)**
```javascript
methods: {
  // Core measurement
  measuredHeightWithMargins(rootEl) { ... }
  isAtomicBlock(node) { ... }
  
  // Main splitting function with dynamic height support
  splitHtmlIntoChunks(html, measurer, maxContentHeightOrFn, safety, maxPages) { ... }
  
  // Splitting helpers
  splitTextToFit(baseContainer, textNode) { ... }
  splitListInContext(listEl, contextContainer) { ... }
  splitTable(tableEl, contextContainer) { ... }
  splitDefinitionList(dlEl, contextContainer) { ... }
  splitSimpleBlock(blockEl) { ... }
  splitSection(sectionEl) { ... }
}
```

---

## Props to Add

```javascript
props: {
  // Content (3 inputs)
  leftHtml: String,
  rightHtml: String,
  headerHtml: String,
  
  // Layout control
  leftColumnRatio: { type: Number, default: 0.3 }, // 30%/70% split
  columnGutter: { type: Number, default: 0 }, // Gap between columns
  
  // All other props from OneColHeaderOnce
  // (pageWidth, pageHeight, padding, colors, etc.)
}
```

---

## Differences from TwoColsWithHeader

### **What to REMOVE**
1. ❌ Verbose logging (`console.log` everywhere)
2. ❌ `analyzeOverflowCause()` - Too verbose for production
3. ❌ `extractSections()` - Fragile, templates should use proper classes
4. ❌ Old `splitList()` - Use `splitListInContext()` instead

### **What to ADD**
1. ✅ `splitTable()` - Table row-by-row splitting
2. ✅ `splitDefinitionList()` - DL element splitting
3. ✅ Support for all block elements (`<article>`, `<blockquote>`, etc.)
4. ✅ Dynamic height function (different for page 1 vs 2+)
5. ✅ Context-aware list splitting
6. ✅ Clean, minimal logging (only show final usage stats)

---

## Implementation Steps

### **Step 1: Copy Base Structure**
- Start with OneColHeaderOnce template
- Modify to show two columns instead of one
- Add header v-if condition

### **Step 2: Add Column Layout**
- Add left/right column divs
- Calculate widths based on ratio
- Add 3 measurers (header, left, right)

### **Step 3: Copy All Splitting Functions**
- Copy entire splitHtmlIntoChunks + helpers from OneColHeaderOnce
- No modifications needed - they work the same

### **Step 4: Implement repaginate()**
```javascript
repaginate() {
  // Calculate heights for each page type
  const firstPageHeight = this.pageHeight - this.pagePadding - this.headerHeight - ...;
  const otherPageHeight = this.pageHeight - this.pagePadding - ...;
  
  const getHeightForPage = (pageIndex) => {
    return pageIndex === 0 ? firstPageHeight : otherPageHeight;
  };
  
  // Split left column
  const leftChunks = this.splitHtmlIntoChunks(
    this.leftHtml,
    this.$refs.measurerLeft,
    getHeightForPage,
    this.safetyBuffer,
    this.maxPages
  );
  
  // Split right column
  const rightChunks = this.splitHtmlIntoChunks(
    this.rightHtml,
    this.$refs.measurerRight,
    getHeightForPage,
    this.safetyBuffer,
    this.maxPages
  );
  
  // Combine
  const maxLen = Math.max(leftChunks.length, rightChunks.length);
  this.pages = Array.from({ length: maxLen }, (_, i) => ({
    left: leftChunks[i] || '',
    right: rightChunks[i] || ''
  }));
  
  // Update store
  this.paginationStore.setPageCount(this.pages.length);
  
  // Log clean summary
  console.log(`📄 Total Pages: ${this.pages.length}`);
  this.$nextTick(() => {
    // Log usage per page (like OneColHeaderOnce)
  });
}
```

### **Step 5: Add Minimal Logging**
```javascript
// Only log final page usage like OneColHeaderOnce
this.$nextTick(() => {
  console.log(`📄 Total Pages: ${this.pages.length}`);
  
  this.pages.forEach((page, i) => {
    // Measure left
    this.$refs.measurerLeft.innerHTML = page.left;
    const leftHeight = this.measuredHeightWithMargins(this.$refs.measurerLeft);
    const leftUsage = ((leftHeight / availableHeight) * 100).toFixed(1);
    
    // Measure right
    this.$refs.measurerRight.innerHTML = page.right;
    const rightHeight = this.measuredHeightWithMargins(this.$refs.measurerRight);
    const rightUsage = ((rightHeight / availableHeight) * 100).toFixed(1);
    
    console.log(`✅ Page ${i + 1}: Left=${leftUsage}%, Right=${rightUsage}%`);
  });
});
```

---

## Testing Checklist

- [ ] Header appears only on page 1
- [ ] Left and right columns split independently
- [ ] Page 1 usage accounts for header height
- [ ] Pages 2+ use full height (no header)
- [ ] Tables split correctly in both columns
- [ ] Lists split correctly in both columns
- [ ] Definition lists work
- [ ] All block elements (`<article>`, `<blockquote>`, etc.) split
- [ ] No wrapper divs around content (follow best practices)
- [ ] Clean console output (just usage percentages)
- [ ] Keyboard navigation works
- [ ] Pagination store stays in sync

---

## File Location
`/Users/carlosid/Desktop/Hirehub__Templates/app/app/components/paginator/AutoPaginatorTwoColsWithHeaderOnce.vue`

---

## Estimated Size
- **~800-900 lines** (similar to OneColHeaderOnce)
- Much cleaner than current TwoColsWithHeader (1058 lines)
