const CONFIG = {
    MAX_PAGE_HEIGHT: 827, // Hauteur standard A4
    SAFETY_BUFFER: 1,
    MIN_USAGE_PERCENT: 0.96,
    MAX_USAGE_PERCENT: 1.0, // Ne jamais dépasser 100%
  };
  
  // ================= MEASURER =================
  let measurer = null;
  const heightCache = new Map();
  
  function initMeasurer(widthPx = 595, padding = 20) {
    if (!measurer) {
      measurer = document.createElement('div');
      measurer.style.position = 'absolute';
      measurer.style.visibility = 'hidden';
      measurer.style.pointerEvents = 'none';
      measurer.style.left = '-9999px';
      measurer.style.top = '-9999px';
      measurer.style.width = widthPx + 'px';
      measurer.style.padding = padding + 'px';
      document.body.appendChild(measurer);
    }
    return measurer;
  }
  
  function measuredHeightWithMargins(element) {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    const marginTop = parseFloat(style.marginTop) || 0;
    const marginBottom = parseFloat(style.marginBottom) || 0;
    return rect.height + marginTop + marginBottom;
  }
  
  function getLineHeight(element) {
    const style = window.getComputedStyle(element);
    const lineHeight = parseFloat(style.lineHeight);
    const fontSize = parseFloat(style.fontSize);
    return lineHeight || fontSize || 16;
  }
  
  function measureCandidate(container, content) {
    const key = container.tagName + "::" + (content.textContent || content.outerHTML || '');
    if (heightCache.has(key)) return heightCache.get(key);
  
    measurer.innerHTML = '';
    const clone = container.cloneNode(false);
    clone.appendChild(content);
    measurer.appendChild(clone);
  
    const h = measuredHeightWithMargins(measurer);
    heightCache.set(key, h);
    return h;
  }
  
  function overflows(maxHeight = CONFIG.MAX_PAGE_HEIGHT) {
    const buffer = getLineHeight(measurer) * 0.5;
    return measuredHeightWithMargins(measurer) > (maxHeight - buffer - CONFIG.SAFETY_BUFFER);
  }
  
  function tryAppend(container, node, maxHeight = CONFIG.MAX_PAGE_HEIGHT) {
    container.appendChild(node);
    measurer.innerHTML = '';
    measurer.appendChild(container.cloneNode(true));
    if (overflows(maxHeight)) {
      container.removeChild(container.lastChild);
      return false;
    }
    return true;
  }
  
  // ================= SPLITTING =================
  
  function splitTextToFit(baseContainer, textNode, maxHeight = CONFIG.MAX_PAGE_HEIGHT) {
    const full = textNode.textContent || '';
    if (!full) return [null, null];
  
    let lo = 1, hi = full.length, best = 0;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      const snippet = document.createTextNode(full.slice(0, mid));
      const h = measureCandidate(baseContainer, snippet);
  
      if (h <= maxHeight) {
        best = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
  
    if (best === 0) return [null, textNode];
    const left = document.createTextNode(full.slice(0, best));
    const right = full.length > best ? document.createTextNode(full.slice(best)) : null;
    return [left, right];
  }
  
  function splitListInContext(listEl, contextContainer, maxHeight = CONFIG.MAX_PAGE_HEIGHT) {
    const left = listEl.cloneNode(false);
    const right = listEl.cloneNode(false);
    const listItems = Array.from(listEl.children);
  
    for (let i = 0; i < listItems.length; i++) {
      const li = listItems[i];
      const liClone = li.cloneNode(true);
  
      const testContainer = contextContainer.cloneNode(true);
      const testList = left.cloneNode(true);
      testList.appendChild(liClone);
      testContainer.appendChild(testList);
  
      measurer.innerHTML = '';
      measurer.appendChild(testContainer);
  
      if (overflows(maxHeight)) {
        for (let j = i; j < listItems.length; j++) {
          right.appendChild(listItems[j].cloneNode(true));
        }
        return {
          left: left.childNodes.length > 0 ? left : null,
          right: right.childNodes.length > 0 ? right : null
        };
      }
      left.appendChild(liClone);
    }
  
    return { left: left.childNodes.length > 0 ? left : null, right: null };
  }
  
  function splitDefinitionList(dlEl, maxHeight = CONFIG.MAX_PAGE_HEIGHT, currentContainer = null) {
    const left = dlEl.cloneNode(false);
    const right = dlEl.cloneNode(false);
    const items = Array.from(dlEl.children);
  
    for (let i = 0; i < items.length; i++) {
      const item = items[i].cloneNode(true);
      left.appendChild(item);
  
      const testContainer = currentContainer ? currentContainer.cloneNode(true) : document.createElement('div');
      testContainer.appendChild(left.cloneNode(true));
  
      measurer.innerHTML = '';
      measurer.appendChild(testContainer);
  
      if (overflows(maxHeight)) {
        left.removeChild(left.lastChild);
        for (let j = i; j < items.length; j++) {
          right.appendChild(items[j].cloneNode(true));
        }
        break;
      }
    }
  
    return {
      left: left.children.length > 0 ? left : null,
      right: right.children.length > 0 ? right : null
    };
  }
  
  function splitTable(tableEl, maxHeight = CONFIG.MAX_PAGE_HEIGHT, currentContainer = null) {
    const left = tableEl.cloneNode(false);
    const right = tableEl.cloneNode(false);
  
    const thead = tableEl.querySelector('thead');
    if (thead) {
      left.appendChild(thead.cloneNode(true));
      right.appendChild(thead.cloneNode(true));
    }
  
    const leftTbody = document.createElement('tbody');
    const rightTbody = document.createElement('tbody');
  
    const tbody = tableEl.querySelector('tbody');
    if (!tbody) return { left: tableEl.cloneNode(true), right: null };
  
    const rows = Array.from(tbody.querySelectorAll('tr'));
  
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i].cloneNode(true);
      leftTbody.appendChild(row);
  
      const testLeft = left.cloneNode(true);
      testLeft.appendChild(leftTbody.cloneNode(true));
  
      const testContainer = currentContainer ? currentContainer.cloneNode(true) : document.createElement('div');
      testContainer.appendChild(testLeft);
  
      measurer.innerHTML = '';
      measurer.appendChild(testContainer);
  
      if (overflows(maxHeight)) {
        leftTbody.removeChild(leftTbody.lastChild);
        for (let j = i; j < rows.length; j++) {
          rightTbody.appendChild(rows[j].cloneNode(true));
        }
        break;
      }
    }
  
    if (leftTbody.children.length > 0) left.appendChild(leftTbody);
    if (rightTbody.children.length > 0) right.appendChild(rightTbody);
  
    return {
      left: leftTbody.children.length > 0 ? left : null,
      right: rightTbody.children.length > 0 ? right : null
    };
  }
  
  function splitSimpleBlock(blockEl, maxHeight = CONFIG.MAX_PAGE_HEIGHT, currentContainer = null) {
    const left = blockEl.cloneNode(false);
    const right = blockEl.cloneNode(false);
  
    for (const child of Array.from(blockEl.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const [lt, rt] = splitTextToFit(left, child, maxHeight);
        if (lt) left.appendChild(lt);
        if (rt) right.appendChild(rt);
        continue;
      }
  
      const childClone = child.cloneNode(true);
      left.appendChild(childClone);
  
      measurer.innerHTML = '';
      measurer.appendChild(left.cloneNode(true));
      if (overflows(maxHeight)) {
        left.removeChild(left.lastChild);
  
        if (child.tagName === 'UL' || child.tagName === 'OL') {
          const res = splitListInContext(child, left, maxHeight);
          if (res.left) left.appendChild(res.left);
          if (res.right) right.appendChild(res.right);
        } else if (child.tagName === 'DL') {
          const res = splitDefinitionList(child, maxHeight, left);
          if (res.left) left.appendChild(res.left);
          if (res.right) right.appendChild(res.right);
        } else if (child.tagName === 'TABLE') {
          const res = splitTable(child, maxHeight, left);
          if (res.left) left.appendChild(res.left);
          if (res.right) right.appendChild(res.right);
        } else {
          const res = splitSimpleBlock(child, maxHeight, left);
          if (res.left) left.appendChild(res.left);
          if (res.right) right.appendChild(res.right);
        }
        break;
      }
    }
  
    return { left: left.childNodes.length > 0 ? left : null, right: right.childNodes.length > 0 ? right : null };
  }
  
  // ================= FORCE SPLIT =================
  
  function forceSplit(container, maxHeight = CONFIG.MAX_PAGE_HEIGHT) {
    console.log("🚨 ForceSplit activé");
  
    const left = document.createElement('div');
    const right = document.createElement('div');
    const children = Array.from(container.childNodes);
  
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      left.appendChild(child.cloneNode(true));
  
      measurer.innerHTML = '';
      measurer.appendChild(left.cloneNode(true));
  
      if (overflows(maxHeight)) {
        left.removeChild(left.lastChild);
  
        if (child.nodeType === Node.TEXT_NODE || child.tagName === 'P' || child.tagName === 'PRE') {
          const [lt, rt] = splitTextToFit(left, child, maxHeight);
          if (lt) left.appendChild(lt);
          if (rt) right.appendChild(rt);
        } else {
          right.appendChild(child.cloneNode(true));
        }
  
        for (let j = i + 1; j < children.length; j++) {
          right.appendChild(children[j].cloneNode(true));
        }
        break;
      }
    }
  
    return {
      left: left.innerHTML.trim() ? left : null,
      right: right.innerHTML.trim() ? right : null
    };
  }
  
  // ================= CHUNKS =================
  
  function splitHtmlIntoChunks(html, maxHeight = CONFIG.MAX_PAGE_HEIGHT) {
    initMeasurer();
    const wrap = document.createElement('div');
    wrap.innerHTML = html || '';
    const nodes = Array.from(wrap.childNodes);
  
    let chunks = [];
    let col = document.createElement('div');
  
    const validatePage = (html, pageNum) => {
      measurer.innerHTML = '';
      const div = document.createElement('div');
      div.innerHTML = html;
      measurer.appendChild(div);
      const h = measuredHeightWithMargins(measurer);
      return h <= maxHeight;
    };
  
    const pushCol = () => {
      if (col.innerHTML.trim()) {
        if (!validatePage(col.innerHTML, chunks.length)) {
          const result = forceSplit(col, maxHeight);
          if (result.left) chunks.push(result.left.innerHTML);
          if (result.right) chunks.push(result.right.innerHTML);
        } else {
          chunks.push(col.innerHTML);
        }
      }
      col = document.createElement('div');
    };
  
    for (const node of nodes) {
      const clone = node.cloneNode(true);
  
      if (tryAppend(col, clone, maxHeight)) continue;
  
      if (col.childNodes.length) {
        pushCol();
        if (tryAppend(col, clone, maxHeight)) continue;
  
        let remaining = clone;
        while (remaining) {
          const result = forceSplit(remaining, maxHeight);
          if (result.left) {
            col.appendChild(result.left);
            pushCol();
          }
          remaining = result.right;
        }
        continue;
      }
      col.appendChild(clone);
    }
  
    pushCol();
    return chunks;
  }
  
  function createPages(html) {
    const chunks = splitHtmlIntoChunks(html);
    return chunks.map((chunk, i) => `
      <div class="page" data-page="${i + 1}">
        <div class="column-content">${chunk}</div>
      </div>
    `).join('');
  }
  
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { splitHtmlIntoChunks, createPages, CONFIG };
  }
  