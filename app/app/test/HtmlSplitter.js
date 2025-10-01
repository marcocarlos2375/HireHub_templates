/**
 * HtmlSplitter - Classe pour diviser du contenu HTML en pages
 * 
 * Usage:
 * const splitter = new HtmlSplitter({
 *   maxHeight: 827,
 *   pageWidth: 595,
 *   padding: 20
 * });
 * 
 * const pages = splitter.split(htmlContent);
 */

class HtmlSplitter {
  constructor(options = {}) {
    this.config = {
      maxHeight: options.maxHeight || 820, // 827px - 7px de marge de sécurité
      pageWidth: options.pageWidth || 595,
      padding: options.padding || 20,
      safetyBuffer: options.safetyBuffer || 1,
      minUsagePercent: options.minUsagePercent || 0.96,
      maxUsagePercent: options.maxUsagePercent || 1.01
    };
    
    this.measurer = null;
    this.heightCache = new Map();
    
    this._initMeasurer();
  }
  
  /**
   * Initialise l'élément de mesure caché
   */
  _initMeasurer() {
    if (!this.measurer) {
      this.measurer = document.createElement('div');
      this.measurer.style.position = 'absolute';
      this.measurer.style.visibility = 'hidden';
      this.measurer.style.pointerEvents = 'none';
      this.measurer.style.left = '-9999px';
      this.measurer.style.top = '-9999px';
      this.measurer.style.width = this.config.pageWidth + 'px';
      this.measurer.style.padding = this.config.padding + 'px';
      document.body.appendChild(this.measurer);
    }
    return this.measurer;
  }
  
  /**
   * Mesure la hauteur d'un élément avec ses marges
   */
  _measuredHeightWithMargins(element) {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    const marginTop = parseFloat(style.marginTop) || 0;
    const marginBottom = parseFloat(style.marginBottom) || 0;
    return rect.height + marginTop + marginBottom;
  }
  
  /**
   * Mesure un candidat avec cache
   */
  _measureCandidate(container, content) {
    const cacheKey = `${container.tagName}_${content.innerHTML?.substring(0, 50)}`;
    
    if (this.heightCache.has(cacheKey)) {
      return this.heightCache.get(cacheKey);
    }
    
    const testContainer = container.cloneNode(false);
    testContainer.appendChild(content.cloneNode(true));
    
    this.measurer.innerHTML = '';
    this.measurer.appendChild(testContainer);
    
    const height = this._measuredHeightWithMargins(this.measurer);
    this.heightCache.set(cacheKey, height);
    
    return height;
  }
  
  /**
   * Vérifie si un élément dépasse la hauteur max
   */
  _overflows(maxHeight) {
    return this._measuredHeightWithMargins(this.measurer) > maxHeight;
  }
  
  /**
   * Essaie d'ajouter un élément à une colonne
   */
  _tryAppend(col, clone, maxHeight) {
    col.appendChild(clone);
    
    this.measurer.innerHTML = '';
    this.measurer.appendChild(col.cloneNode(true));
    
    if (this._overflows(maxHeight)) {
      col.removeChild(col.lastChild);
      return false;
    }
    
    return true;
  }
  
  /**
   * Divise une liste (UL/OL) en contexte
   */
  _splitListInContext(listEl, contextContainer, maxHeight) {
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
  
      this.measurer.innerHTML = '';
      this.measurer.appendChild(testContainer);
  
      if (this._overflows(maxHeight)) {
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
  
  /**
   * Divise une table
   */
  _splitTable(tableEl, maxHeight, currentContainer = null) {
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
    if (!tbody) {
      return { left: tableEl.cloneNode(true), right: null };
    }
    
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i].cloneNode(true);
      leftTbody.appendChild(row);
      
      const testLeft = left.cloneNode(true);
      testLeft.appendChild(leftTbody.cloneNode(true));
      
      const testContainer = currentContainer ? currentContainer.cloneNode(true) : document.createElement('div');
      testContainer.appendChild(testLeft);
      
      this.measurer.innerHTML = '';
      this.measurer.appendChild(testContainer);
      
      if (this._overflows(maxHeight)) {
        leftTbody.removeChild(leftTbody.lastChild);
        
        for (let j = i; j < rows.length; j++) {
          rightTbody.appendChild(rows[j].cloneNode(true));
        }
        break;
      }
    }
    
    if (leftTbody.children.length > 0) {
      left.appendChild(leftTbody);
    }
    if (rightTbody.children.length > 0) {
      right.appendChild(rightTbody);
    }
    
    return {
      left: leftTbody.children.length > 0 ? left : null,
      right: rightTbody.children.length > 0 ? right : null
    };
  }
  
  /**
   * Divise une liste de définitions (DL)
   */
  _splitDefinitionList(dlEl, maxHeight, currentContainer = null) {
    const left = dlEl.cloneNode(false);
    const right = dlEl.cloneNode(false);
    
    const items = Array.from(dlEl.children);
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i].cloneNode(true);
      left.appendChild(item);
      
      const testContainer = currentContainer ? currentContainer.cloneNode(true) : document.createElement('div');
      testContainer.appendChild(left.cloneNode(true));
      
      this.measurer.innerHTML = '';
      this.measurer.appendChild(testContainer);
      
      if (this._overflows(maxHeight)) {
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
  
  /**
   * Divise un bloc simple (DIV, P, etc.)
   */
  _splitSimpleBlock(blockEl, maxHeight, currentContainer = null) {
    const left = blockEl.cloneNode(false);
    const right = blockEl.cloneNode(false);
    const children = Array.from(blockEl.childNodes);
    
    const availableHeight = maxHeight - (currentContainer ? this._measureCandidate(document.createElement('div'), currentContainer) : 0);
    
    for (const child of children) {
      const childClone = child.cloneNode(true);
      left.appendChild(childClone);
      
      const testLeft = left.cloneNode(true);
      const testContainer = currentContainer ? currentContainer.cloneNode(true) : document.createElement('div');
      testContainer.appendChild(testLeft);
      
      this.measurer.innerHTML = '';
      this.measurer.appendChild(testContainer);
      
      if (this._overflows(availableHeight)) {
        left.removeChild(left.lastChild);
        
        for (let i = children.indexOf(child); i < children.length; i++) {
          right.appendChild(children[i].cloneNode(true));
        }
        break;
      }
    }
    
    return { left, right: null };
  }
  
  /**
   * Divise le HTML en chunks (pages)
   * @param {string} html - Le contenu HTML à diviser
   * @param {Object} options - Options de split
   * @param {number} options.maxHeight - Hauteur maximale par page (optionnel)
   * @param {number} options.width - Largeur personnalisée (optionnel)
   * @param {number} options.padding - Padding personnalisé (optionnel)
   * @param {string} options.containerStyle - Style CSS pour le conteneur (optionnel)
   * @returns {Array<string>} - Tableau de chunks HTML
   */
  split(html, options = {}) {
    // Support de l'ancien format: split(html, maxHeight)
    if (typeof options === 'number') {
      options = { maxHeight: options };
    }
    
    const maxHeight = options.maxHeight || this.config.maxHeight;
    const customWidth = options.width;
    const customPadding = options.padding;
    const containerStyle = options.containerStyle;
    
    // Sauvegarder les valeurs originales
    const originalMeasurerWidth = this.measurer.style.width;
    const originalMeasurerPadding = this.measurer.style.padding;
    
    // Appliquer les dimensions personnalisées si fournies
    if (customWidth) {
      this.measurer.style.width = customWidth + 'px';
    }
    if (customPadding !== undefined) {
      this.measurer.style.padding = customPadding + 'px';
    }
    
    const wrap = document.createElement('div');
    wrap.innerHTML = html || '';
    const nodes = Array.from(wrap.childNodes);
  
    let chunks = [];
    let col = document.createElement('div');
  
    const pushCol = () => {
      if (col.innerHTML.trim()) {
        // Appliquer le style du conteneur si fourni
        if (containerStyle) {
          const wrappedContent = `<div style="${containerStyle}">${col.innerHTML}</div>`;
          chunks.push(wrappedContent);
        } else {
          chunks.push(col.innerHTML);
        }
      }
      col = document.createElement('div');
      if (containerStyle) {
        col.setAttribute('style', containerStyle);
      }
    };
  
    for (const node of nodes) {
      const clone = node.cloneNode(true);
  
      if (this._tryAppend(col, clone, maxHeight)) continue;
  
      if (col.childNodes.length) {
        this.measurer.innerHTML = '';
        this.measurer.appendChild(col.cloneNode(true));
        const currentHeight = this._measuredHeightWithMargins(this.measurer);
        const usagePercent = currentHeight / maxHeight;
        const isValid = usagePercent >= this.config.minUsagePercent && usagePercent <= this.config.maxUsagePercent;
  
        if (isValid) {
          pushCol();
          col.appendChild(clone);
          continue;
        }
      }
  
      if (node.nodeType !== Node.ELEMENT_NODE) {
        pushCol();
        col.appendChild(clone);
        continue;
      }
  
      let remaining = node;
      let attempts = 0;
      const maxAttempts = 10;
  
      while (remaining && attempts < maxAttempts) {
        attempts++;
        
        let splitResult;
        
        if (remaining.tagName === 'UL' || remaining.tagName === 'OL') {
          splitResult = this._splitListInContext(remaining, col, maxHeight);
        } else if (remaining.tagName === 'TABLE') {
          splitResult = this._splitTable(remaining, maxHeight, col);
        } else if (remaining.tagName === 'DL') {
          splitResult = this._splitDefinitionList(remaining, maxHeight, col);
        } else {
          splitResult = this._splitSimpleBlock(remaining, maxHeight, col);
        }
        
        if (splitResult.left) {
          col.appendChild(splitResult.left);
        }
        
        pushCol();
        
        if (splitResult.right) {
          if (this._tryAppend(col, splitResult.right, maxHeight)) {
            remaining = null;
          } else {
            remaining = splitResult.right;
          }
        } else {
          remaining = null;
        }
      }
      
      if (attempts >= maxAttempts) {
        console.warn('⚠️ Max attempts reached for element:', node.tagName);
      }
    }
  
    pushCol();
    
    // Restaurer les valeurs originales du measurer
    this.measurer.style.width = originalMeasurerWidth;
    this.measurer.style.padding = originalMeasurerPadding;
    
    return chunks;
  }
  
  /**
   * Crée des pages HTML complètes
   * @param {string} html - Le contenu HTML à paginer
   * @param {Object} options - Options de rendu
   * @returns {string} - HTML complet avec les pages
   */
  createPages(html, options = {}) {
    const chunks = this.split(html);
    const pageClass = options.pageClass || 'page';
    const contentClass = options.contentClass || 'column-content';
    
    return chunks.map((chunk, i) => `
      <div class="${pageClass}" data-page="${i + 1}">
        <div class="${contentClass}">${chunk}</div>
      </div>
    `).join('');
  }
  
  /**
   * Nettoie les ressources
   */
  destroy() {
    if (this.measurer && this.measurer.parentNode) {
      document.body.removeChild(this.measurer);
    }
    this.measurer = null;
    this.heightCache.clear();
  }
}

// Export pour utilisation en module ou navigateur
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HtmlSplitter;
}
if (typeof window !== 'undefined') {
  window.HtmlSplitter = HtmlSplitter;
}
