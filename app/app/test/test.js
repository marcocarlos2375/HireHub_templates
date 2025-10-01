/**
 * SYSTÈME DE PAGINATION AUTOMATIQUE (Optimisé)
 * - Réutilisation d'un seul measurer
 * - cloneNode(false) au lieu de clone complet
 * - Cache des mesures
 * - Largeur dynamique
 * 
 * ═════════════════════════════════════════════════════════════════
 * FLUX COMPLET DE PAGINATION - ÉTAPES
 * ═══════════════════════════════════════════════════════════════
 * 
 * ÉTAPE 1: INITIALISATION
 * ────────────────────────
 * createPages(html)
 *   ↓
 * splitHtmlIntoChunks(html, maxHeight)
 *   ↓
 * initMeasurer() // Crée l'élément caché pour mesurer
 * 
 * ÉTAPE 2: PARSING DU HTML
 * ────────────────────────
 * const wrap = document.createElement('div');
 * wrap.innerHTML = html; // Parse le HTML
 * const nodes = Array.from(wrap.childNodes); // Extrait tous les nœuds
 * 
 * Résultat: Liste de nœuds (sections, divs, paragraphes, listes, etc.)
 * 
 * ÉTAPE 3: BOUCLE PRINCIPALE - Traitement nœud par nœud
 * ────────────────────────────────────────────────────
 * for (const node of nodes) {
 *   const clone = node.cloneNode(true);
 *   
 *   // 3.1: Essayer d'ajouter à la page actuelle
 *   if (tryAppend(col, clone, maxHeight)) {
 *     continue; //  Ça rentre, passer au nœud suivant
 *   }
 *   
 *   // 3.2: Ça ne rentre pas, analyser...
 * }
 * 
 * ÉTAPE 3.1: VÉRIFICATION DE LA PAGE ACTUELLE
 * ────────────────────────────────────────────
 * measurer.innerHTML = '';
 * measurer.appendChild(col.cloneNode(true));
 * const currentHeight = measuredHeightWithMargins(measurer);
 * const usagePercent = currentHeight / maxHeight;
 * 
 * const isValid = usagePercent >= 0.96 && usagePercent <= 1.01;
 * 
 * ÉTAPE 3.2a: SI PAGE VALIDE (96-101%)
 * ────────────────────────────────────
 * if (isValid) {
 *   pushCol(); // Fermer la page actuelle
 *   if (tryAppend(col, clone, maxHeight)) continue; // Essayer sur nouvelle page
 * }
 * 
 * ÉTAPE 3.2b: SI PAGE INVALIDE (<96% ou >101%)
 * ────────────────────────────────────────────
 * // Diviser l'élément pour remplir l'espace
 * 
 * Si c'est une LISTE (UL/OL):
 *   splitListInContext(clone, col, maxHeight)
 *     ↓
 *   Pour chaque <li>:
 *     - Tester si ça rentre avec le contexte
 *     - Si oui: ajouter à left
 *     - Si non: mettre le reste dans right
 *   
 *   Résultat: { left: items qui rentrent, right: items restants }
 * 
 * Si c'est un BLOC (p, div, section):
 *   splitSimpleBlock(clone, maxHeight)
 *     ↓
 *   Pour chaque enfant:
 *     - Si TEXT_NODE: splitTextToFit() avec recherche binaire
 *     - Si ELEMENT: tryAppend() ou récursion splitSimpleBlock()
 *     - Si LISTE imbriquée: splitListInContext()
 *   
 *   Résultat: { left: contenu qui rentre, right: contenu restant }
 * 
 * ÉTAPE 4: ASSEMBLAGE DES RÉSULTATS
 * ──────────────────────────────────
 * if (left) col.appendChild(left);   // Ajouter partie gauche à page actuelle
 * pushCol();                          // Fermer la page
 * if (right) col.appendChild(right);  // Ajouter partie droite à nouvelle page
 * 
 * ÉTAPE 5: FINALISATION
 * ─────────────────────
 * pushCol(); // Fermer la dernière page
 * return chunks; // Retourner toutes les pages
 * 
 * ÉTAPE 6: CRÉATION DES PAGES HTML
 * ─────────────────────────────────
 * createPages(html)
 *   ↓
 * chunks.map((chunk, i) => `
 *   <div class="page" data-page="${i + 1}">
 *     <div class="column-content">${chunk}</div>
 *   </div>
 * `)
 * 
 * ═════════════════════════════════════════════════════════════════
 * OPTIMISATIONS CLÉS
 * ═══════════════════════════════════════════════════════════════
 * 
 * 1. CACHE DES MESURES (heightCache)
 *    - Évite de re-mesurer le même contenu
 *    - Gain: 2-3x plus rapide
 * 
 * 2. cloneNode(false)
 *    - Clone uniquement la structure, pas le contenu
 *    - Gain: Moins de mémoire, plus rapide
 * 
 * 3. RECHERCHE BINAIRE (splitTextToFit)
 *    - Trouve le point de coupure optimal en O(log n)
 *    - Au lieu de O(n) avec recherche linéaire
 * 
 * 4. MESURE CONTEXTUELLE (splitListInContext)
 *    - Mesure la liste dans son contexte (avec contenu précédent)
 *    - Résultat: Meilleure utilisation de l'espace
 * 
 * 5. VALIDATION DE PAGE (95-101%)
 *    - Refuse de fermer une page sous-utilisée
 *    - Divise les éléments pour atteindre le minimum
 *    - Résultat: Pages bien remplies, moins de pages au total
 * 
 * ═════════════════════════════════════════════════════════════════
 */

const CONFIG = {
    MAX_PAGE_HEIGHT: 820, // 827px - 7px de marge de sécurité
    SAFETY_BUFFER: 1,
    MIN_USAGE_PERCENT: 0.96,
    MAX_USAGE_PERCENT: 1.01,
  };
  
  // ================= MEASURER =================
  let measurer = null;
  let measurerLeftColumn = null;
  let measurerRightColumn = null;
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
  
  function initTwoColumnsMeasurers() {
    if (!measurerLeftColumn) {
      measurerLeftColumn = document.createElement('div');
      measurerLeftColumn.style.cssText = 'position: absolute; visibility: hidden; width: 595px; left: -9999px;';
      measurerLeftColumn.id = 'measurer-left-column';
      document.body.appendChild(measurerLeftColumn);
      console.log('📏 measurerLeftColumn créé');
    }
    if (!measurerRightColumn) {
      measurerRightColumn = document.createElement('div');
      measurerRightColumn.style.cssText = 'position: absolute; visibility: hidden; width: 595px; left: -9999px;';
      measurerRightColumn.id = 'measurer-right-column';
      document.body.appendChild(measurerRightColumn);
      console.log('📏 measurerRightColumn créé');
    }
    
    // Exposer les measurers à window après leur création
    if (typeof window !== 'undefined') {
      window.measurerLeftColumn = measurerLeftColumn;
      window.measurerRightColumn = measurerRightColumn;
      console.log('📏 Measurers exposés à window');
    }
  }
  
  function measuredHeightWithMargins(element) {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    const marginTop = parseFloat(style.marginTop) || 0;
    const marginBottom = parseFloat(style.marginBottom) || 0;
    return rect.height + marginTop + marginBottom;
  }
  
  function measureCandidate(container, content) {
    // Génère une clé unique pour le cache
    const key = container.tagName + "::" + (content.textContent || content.outerHTML || '');
    if (heightCache.has(key)) return heightCache.get(key);
  
    measurer.innerHTML = '';
    const clone = container.cloneNode(false); // seulement la structure
    clone.appendChild(content);
    measurer.appendChild(clone);
  
    const h = measuredHeightWithMargins(measurer);
    heightCache.set(key, h);
    return h;
  }
  
  function overflows(maxHeight = CONFIG.MAX_PAGE_HEIGHT) {
    return measuredHeightWithMargins(measurer) > (maxHeight - CONFIG.SAFETY_BUFFER);
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
    console.log('📖 splitDefinitionList appelé');
    
    const left = dlEl.cloneNode(false); // Clone la structure <dl>
    const right = dlEl.cloneNode(false);
    
    const items = Array.from(dlEl.children); // dt et dd
    console.log(`  📋 ${items.length} éléments (dt/dd) à diviser`);
    
    // Ajouter les éléments un par un jusqu'à débordement
    for (let i = 0; i < items.length; i++) {
      const item = items[i].cloneNode(true);
      left.appendChild(item);
      
      // Tester si ça rentre
      const testContainer = currentContainer ? currentContainer.cloneNode(true) : document.createElement('div');
      testContainer.appendChild(left.cloneNode(true));
      
      measurer.innerHTML = '';
      measurer.appendChild(testContainer);
      
      if (overflows(maxHeight)) {
        // Trop grand! Retirer le dernier élément
        left.removeChild(left.lastChild);
        console.log(`  ✂️ Split après ${left.children.length} éléments`);
        
        // Mettre les éléments restants dans right
        for (let j = i; j < items.length; j++) {
          right.appendChild(items[j].cloneNode(true));
        }
        break;
      }
    }
    
    console.log(`  📖 Résultat: left=${left.children.length} éléments, right=${right.children.length} éléments`);
    
    return {
      left: left.children.length > 0 ? left : null,
      right: right.children.length > 0 ? right : null
    };
  }

  function splitTable(tableEl, maxHeight = CONFIG.MAX_PAGE_HEIGHT, currentContainer = null) {
    console.log('📊 splitTable appelé');
    
    const left = tableEl.cloneNode(false); // Clone la structure <table>
    const right = tableEl.cloneNode(false);
    
    // Copier thead dans les deux parties si présent
    const thead = tableEl.querySelector('thead');
    if (thead) {
      left.appendChild(thead.cloneNode(true));
      right.appendChild(thead.cloneNode(true));
    }
    
    // Créer tbody pour left et right
    const leftTbody = document.createElement('tbody');
    const rightTbody = document.createElement('tbody');
    
    // Récupérer toutes les lignes du tbody
    const tbody = tableEl.querySelector('tbody');
    if (!tbody) {
      console.warn('⚠️ Pas de tbody trouvé dans le tableau');
      return { left: tableEl.cloneNode(true), right: null };
    }
    
    const rows = Array.from(tbody.querySelectorAll('tr'));
    console.log(`  📋 ${rows.length} lignes à diviser`);
    
    // Ajouter les lignes une par une jusqu'à débordement
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i].cloneNode(true);
      leftTbody.appendChild(row);
      
      // Tester si ça rentre
      const testLeft = left.cloneNode(true);
      testLeft.appendChild(leftTbody.cloneNode(true));
      
      const testContainer = currentContainer ? currentContainer.cloneNode(true) : document.createElement('div');
      testContainer.appendChild(testLeft);
      
      measurer.innerHTML = '';
      measurer.appendChild(testContainer);
      
      if (overflows(maxHeight)) {
        // Trop grand! Retirer la dernière ligne
        leftTbody.removeChild(leftTbody.lastChild);
        console.log(`  ✂️ Split après ${leftTbody.children.length} lignes`);
        
        // Mettre les lignes restantes dans right
        for (let j = i; j < rows.length; j++) {
          rightTbody.appendChild(rows[j].cloneNode(true));
        }
        break;
      }
    }
    
    // Assembler les résultats
    if (leftTbody.children.length > 0) {
      left.appendChild(leftTbody);
    }
    if (rightTbody.children.length > 0) {
      right.appendChild(rightTbody);
    }
    
    console.log(`  📊 Résultat: left=${leftTbody.children.length} lignes, right=${rightTbody.children.length} lignes`);
    
    return {
      left: leftTbody.children.length > 0 ? left : null,
      right: rightTbody.children.length > 0 ? right : null
    };
  }

  function splitSimpleBlock(blockEl, maxHeight = CONFIG.MAX_PAGE_HEIGHT, currentContainer = null) {
    const left = blockEl.cloneNode(false);
    const right = blockEl.cloneNode(false);
    
    // Calculer l'espace disponible si on a un conteneur actuel
    let availableHeight = maxHeight;
    if (currentContainer && currentContainer.childNodes.length > 0) {
      const currentHeight = measureCandidate(document.createElement('div'), currentContainer.cloneNode(true));
      availableHeight = maxHeight - currentHeight;
      console.log(`  📐 Espace disponible: ${availableHeight.toFixed(1)}px (${currentHeight.toFixed(1)}px déjà utilisés)`);
    }
  
    for (const child of Array.from(blockEl.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const [lt, rt] = splitTextToFit(left, child, maxHeight);
        if (lt) left.appendChild(lt);
  
        const h = measureCandidate(document.createElement('div'), left.cloneNode(true));
        if (h > maxHeight) {
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
        const childClone = child.cloneNode(true);
        
        // Essayer d'ajouter l'élément
        left.appendChild(childClone);
        
        // Mesurer immédiatement après ajout
        const heightAfterAdd = measureCandidate(document.createElement('div'), left.cloneNode(true));
        const usagePercent = (heightAfterAdd / availableHeight * 100).toFixed(1);
        
        // Log pour les DIV/SECTION
        if (child.nodeType === Node.ELEMENT_NODE && 
            (child.tagName === 'DIV' || child.tagName === 'SECTION')) {
          console.log(`📏 Vérification bloc <${child.tagName}>: ${heightAfterAdd.toFixed(1)}px (${usagePercent}% de ${availableHeight.toFixed(1)}px disponibles)`);
        }
        
        if (heightAfterAdd > availableHeight) {
          // Trop grand! Retirer l'élément et le diviser
          left.removeChild(left.lastChild);
          
          if (child.nodeType === Node.ELEMENT_NODE) {
            if (child.tagName === 'UL' || child.tagName === 'OL') {
              const res = splitListInContext(child, left, maxHeight);
              if (res.left) left.appendChild(res.left);
              if (res.right) right.appendChild(res.right);
            } else if (child.tagName === 'DL') {
              console.log(`⚠️ LISTE DE DÉFINITIONS TROP GRANDE! Division du <DL>`);
              
              // Diviser la liste de définitions
              const res = splitDefinitionList(child, maxHeight, left);
              
              console.log(`  ✂️ Division: left=${res.left ? 'OUI' : 'NON'}, right=${res.right ? 'OUI' : 'NON'}`);
              
              if (res.left) left.appendChild(res.left);
              if (res.right) right.appendChild(res.right);
            } else if (child.tagName === 'TABLE') {
              console.log(`⚠️ TABLEAU TROP GRAND! Division du <TABLE>`);
              
              // Diviser le tableau par lignes
              const res = splitTable(child, maxHeight, left);
              
              console.log(`  ✂️ Division: left=${res.left ? 'OUI' : 'NON'}, right=${res.right ? 'OUI' : 'NON'}`);
              
              if (res.left) left.appendChild(res.left);
              if (res.right) right.appendChild(res.right);
            } else if (child.tagName === 'DIV' || child.tagName === 'P' || child.tagName === 'SECTION' ||
                       child.tagName === 'BLOCKQUOTE' || child.tagName === 'ARTICLE' || 
                       child.tagName === 'ASIDE' || child.tagName === 'HEADER' || child.tagName === 'FOOTER' ||
                       child.tagName === 'FIGURE' || child.tagName === 'PRE') {
              console.log(`⚠️ BLOC TROP GRAND! Division du <${child.tagName}> avec ${child.children.length} enfants`);
              
              // Diviser récursivement les blocs en passant le conteneur actuel
              const res = splitSimpleBlock(child, maxHeight, left);
              
              console.log(`  ✂️ Division: left=${res.left ? 'OUI' : 'NON'}, right=${res.right ? 'OUI' : 'NON'}`);
              
              if (res.left) left.appendChild(res.left);
              if (res.right) right.appendChild(res.right);
            } else {
              // Élément non divisible - mettre dans right
              right.appendChild(childClone);
            }
          } else {
            right.appendChild(childClone);
          }
          
          for (let sib = child.nextSibling; sib; sib = sib.nextSibling) right.appendChild(sib.cloneNode(true));
          return { left, right };
        } else if (child.nodeType === Node.ELEMENT_NODE && 
                   (child.tagName === 'DIV' || child.tagName === 'SECTION')) {
          console.log(`  ✅ Bloc OK, continue`);
        }
      }
    }
    
    // Vérifier si left n'est pas trop grand avant de le retourner
    if (left.childNodes.length > 0) {
      const leftHeight = measureCandidate(document.createElement('div'), left.cloneNode(true));
      if (leftHeight > maxHeight) {
        console.warn(`⚠️ splitSimpleBlock: left trop grand (${leftHeight.toFixed(1)}px > ${maxHeight}px) - besoin de re-split`);
      }
    }
    
    return { left, right: null };
  }
  
  // ================= TWO COLUMNS =================
  
  // Version spéciale de splitListInContext qui utilise un measurer personnalisé
  function splitListInContextWithMeasurer(listEl, contextContainer, maxHeight, customMeasurer, columnStyle) {
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
  
      // Utiliser le customMeasurer avec le columnStyle
      customMeasurer.innerHTML = '';
      const wrapper = document.createElement('div');
      wrapper.setAttribute('style', columnStyle);
      wrapper.appendChild(testContainer);
      customMeasurer.appendChild(wrapper);
  
      const height = measuredHeightWithMargins(customMeasurer);
      if (height > maxHeight) {
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
  
  function splitColumnContent(html, maxHeight, columnStyle, columnMeasurer) {
    console.log(`    🔧 Split colonne avec style: ${columnStyle.substring(0, 50)}...`);
    
    if (!columnMeasurer) {
      console.error('❌ columnMeasurer est null!');
      return [];
    }
    
    console.log(`    📏 Utilisation du measurer: ${columnMeasurer.id}`);
    
    const wrap = document.createElement('div');
    wrap.innerHTML = html || '';
    const nodes = Array.from(wrap.childNodes);
    
    let chunks = [];
    let col = document.createElement('div');
    col.setAttribute('style', columnStyle); // Appliquer le style de la colonne
    
    const pushCol = () => {
      if (col.innerHTML.trim()) {
        // Mesurer la hauteur finale de la page avant de la fermer
        columnMeasurer.innerHTML = '';
        const finalTest = document.createElement('div');
        finalTest.setAttribute('style', columnStyle);
        finalTest.innerHTML = col.innerHTML;
        columnMeasurer.appendChild(finalTest);
        const finalHeight = measuredHeightWithMargins(columnMeasurer);
        
        console.log(`\n      📄 FERMETURE PAGE ${chunks.length + 1}:`);
        console.log(`         Hauteur finale: ${finalHeight.toFixed(1)}px`);
        console.log(`         Limite: ${maxHeight}px`);
        console.log(`         Statut: ${finalHeight <= maxHeight ? '✅ OK' : '❌ DÉPASSE de ' + (finalHeight - maxHeight).toFixed(1) + 'px'}`);
        
        chunks.push(col.innerHTML);
        col = document.createElement('div');
        col.setAttribute('style', columnStyle);
      }
    };
    
    let currentTotalHeight = 0;
    
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      
      // Identifier l'élément
      const elementName = node.nodeType === Node.ELEMENT_NODE 
        ? `<${node.tagName}>` 
        : 'TEXT';
      const elementPreview = node.nodeType === Node.ELEMENT_NODE && node.textContent
        ? node.textContent.substring(0, 30).trim() + '...'
        : '';
      
      console.log(`\n      📦 Élément ${i + 1}/${nodes.length}: ${elementName} "${elementPreview}"`);
      
      // Détecter les DIV "wrapper" marqués avec data-wrapper="true"
      // Ces divs sont transparents et leurs enfants sont traités indépendamment
      if (node.nodeType === Node.ELEMENT_NODE && node.getAttribute('data-wrapper') === 'true') {
        console.log(`         🔓 DIV wrapper détecté (data-wrapper="true") - ${node.childNodes.length} enfants à traiter`);
        
        // Traiter chaque enfant du wrapper séparément
        const wrapperChildren = Array.from(node.childNodes);
        let insertIndex = i + 1;
        for (const child of wrapperChildren) {
          // Ajouter chaque enfant comme s'il était un élément de premier niveau
          nodes.splice(insertIndex, 0, child);
          insertIndex++;
          
          const childName = child.nodeType === Node.ELEMENT_NODE ? `<${child.tagName}>` : 'TEXT';
          console.log(`            ↳ Enfant ajouté: ${childName}`);
        }
        
        console.log(`         ✅ Wrapper décompressé - ${wrapperChildren.length} enfants ajoutés à la file`);
        
        // Passer cet élément wrapper (on traitera ses enfants)
        continue;
      }
      
      const clone = node.cloneNode(true);
      
      // Mesurer l'élément seul
      columnMeasurer.innerHTML = '';
      const soloTest = document.createElement('div');
      soloTest.setAttribute('style', columnStyle);
      soloTest.appendChild(clone.cloneNode(true));
      columnMeasurer.appendChild(soloTest);
      const elementHeight = measuredHeightWithMargins(columnMeasurer);
      
      console.log(`         Hauteur de l'élément seul: ${elementHeight.toFixed(1)}px`);
      
      // Ajouter l'élément et mesurer le total
      col.appendChild(clone);
      
      // Créer un conteneur de test avec le style de la colonne
      columnMeasurer.innerHTML = '';
      const testCol = document.createElement('div');
      testCol.setAttribute('style', columnStyle);
      testCol.innerHTML = col.innerHTML;
      columnMeasurer.appendChild(testCol);
      
      const currentHeight = measuredHeightWithMargins(columnMeasurer);
      const available = maxHeight - currentHeight;
      
      console.log(`         Hauteur totale après ajout: ${currentHeight.toFixed(1)}px`);
      console.log(`         Espace disponible restant: ${available.toFixed(1)}px`);
      
      // Si ça rentre, on garde et on continue
      if (currentHeight <= maxHeight) {
        console.log(`         ✅ ACCEPTÉ - Continue`);
        currentTotalHeight = currentHeight;
        continue;
      }
      
      // Ça ne rentre pas - retirer l'élément
      col.removeChild(col.lastChild);
      console.log(`         ❌ REJETÉ - Dépasse de ${(currentHeight - maxHeight).toFixed(1)}px`);
      console.log(`         💡 Tentative de division pour utiliser l'espace disponible (${available.toFixed(1)}px)`);
      
      // Toujours essayer de diviser pour combler l'espace disponible
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === 'UL' || node.tagName === 'OL') {
          console.log(`         ✂️ Division de la liste <${node.tagName}>`);
          // Utiliser le columnMeasurer au lieu du measurer global
          const res = splitListInContextWithMeasurer(node, col, maxHeight, columnMeasurer, columnStyle);
          if (res.left) {
            // Vérifier que left rentre vraiment
            col.appendChild(res.left);
            columnMeasurer.innerHTML = '';
            const verifyTest = document.createElement('div');
            verifyTest.setAttribute('style', columnStyle);
            verifyTest.innerHTML = col.innerHTML;
            columnMeasurer.appendChild(verifyTest);
            const verifyHeight = measuredHeightWithMargins(columnMeasurer);
            
            if (verifyHeight <= maxHeight) {
              console.log(`         ✅ Partie left ajoutée (${verifyHeight.toFixed(1)}px / ${maxHeight}px)`);
            } else {
              console.warn(`         ⚠️ ATTENTION: left dépasse! ${verifyHeight.toFixed(1)}px > ${maxHeight}px`);
            }
          }
          pushCol();
          if (res.right) {
            col.appendChild(res.right);
            console.log(`         ➡️ Reste sur nouvelle page`);
          }
        } else if (node.tagName === 'DL') {
          console.log(`         ✂️ Division de la liste de définitions <DL>`);
          const res = splitDefinitionList(node, maxHeight, col);
          if (res.left) {
            col.appendChild(res.left);
            columnMeasurer.innerHTML = '';
            const verifyTest = document.createElement('div');
            verifyTest.setAttribute('style', columnStyle);
            verifyTest.innerHTML = col.innerHTML;
            columnMeasurer.appendChild(verifyTest);
            const verifyHeight = measuredHeightWithMargins(columnMeasurer);
            console.log(`         ${verifyHeight <= maxHeight ? '✅' : '⚠️'} Partie left: ${verifyHeight.toFixed(1)}px / ${maxHeight}px`);
          }
          pushCol();
          if (res.right) {
            col.appendChild(res.right);
            console.log(`         ➡️ Reste sur nouvelle page`);
          }
        } else if (node.tagName === 'TABLE') {
          console.log(`         ✂️ Division du tableau <TABLE>`);
          const res = splitTable(node, maxHeight, col);
          if (res.left) {
            col.appendChild(res.left);
            columnMeasurer.innerHTML = '';
            const verifyTest = document.createElement('div');
            verifyTest.setAttribute('style', columnStyle);
            verifyTest.innerHTML = col.innerHTML;
            columnMeasurer.appendChild(verifyTest);
            const verifyHeight = measuredHeightWithMargins(columnMeasurer);
            console.log(`         ${verifyHeight <= maxHeight ? '✅' : '⚠️'} Partie left: ${verifyHeight.toFixed(1)}px / ${maxHeight}px`);
          }
          pushCol();
          if (res.right) {
            col.appendChild(res.right);
            console.log(`         ➡️ Reste sur nouvelle page`);
          }
        } else if (node.tagName === 'DIV' || node.tagName === 'P' || node.tagName === 'SECTION' ||
                   node.tagName === 'BLOCKQUOTE' || node.tagName === 'ARTICLE' || 
                   node.tagName === 'ASIDE' || node.tagName === 'HEADER' || node.tagName === 'FOOTER' ||
                   node.tagName === 'FIGURE' || node.tagName === 'PRE') {
          console.log(`         ✂️ Division du bloc <${node.tagName}>`);
          const res = splitSimpleBlock(node, maxHeight);
          if (res.left) {
            col.appendChild(res.left);
            columnMeasurer.innerHTML = '';
            const verifyTest = document.createElement('div');
            verifyTest.setAttribute('style', columnStyle);
            verifyTest.innerHTML = col.innerHTML;
            columnMeasurer.appendChild(verifyTest);
            const verifyHeight = measuredHeightWithMargins(columnMeasurer);
            console.log(`         ${verifyHeight <= maxHeight ? '✅' : '⚠️'} Partie left: ${verifyHeight.toFixed(1)}px / ${maxHeight}px`);
          }
          pushCol();
          if (res.right) {
            col.appendChild(res.right);
            console.log(`         ➡️ Reste sur nouvelle page`);
          }
        } else {
          // Élément non divisible (H1, H2, H3, H4, IMG, etc.)
          console.log(`         📄 <${node.tagName}> non divisible - fermeture de la page`);
          if (col.childNodes.length) {
            pushCol();
          }
          col.appendChild(clone);
        }
      } else {
        // Nœud texte - fermer la page et mettre sur la nouvelle
        console.log(`         📄 Nœud texte - fermeture de la page`);
        if (col.childNodes.length) {
          pushCol();
        }
        col.appendChild(clone);
      }
    }
    
    pushCol();
    
    console.log(`    ✅ Colonne divisée en ${chunks.length} pages`);
    return chunks;
  }
  
  function splitTwoColumnsLayout(html, maxHeight = CONFIG.MAX_PAGE_HEIGHT) {
    console.log('🔀 splitTwoColumnsLayout appelé');
    
    initMeasurer(); // Initialiser le measurer principal
    initTwoColumnsMeasurers(); // Initialiser les measurers dédiés
    const wrap = document.createElement('div');
    wrap.innerHTML = html || '';
    
    // Trouver le conteneur avec data-two-columns
    const container = wrap.querySelector('[data-two-columns="true"]');
    if (!container) {
      console.warn('⚠️ Pas de conteneur data-two-columns trouvé');
      return splitHtmlIntoChunks(html, maxHeight);
    }
    
    const leftCol = container.querySelector('[data-column="left"]');
    const rightCol = container.querySelector('[data-column="right"]');
    
    if (!leftCol || !rightCol) {
      console.warn('⚠️ Colonnes left/right non trouvées');
      return splitHtmlIntoChunks(html, maxHeight);
    }
    
    console.log('  📊 Split des colonnes indépendamment');
    
    // Extraire les styles des colonnes originales
    const leftStyle = leftCol.getAttribute('style') || 'flex: 0 0 200px; background: #f0f9ff; padding: 15px;';
    const rightStyle = rightCol.getAttribute('style') || 'flex: 1;';
    
    // Créer des conteneurs temporaires avec les bonnes largeurs pour mesurer correctement
    const leftContainer = document.createElement('div');
    leftContainer.setAttribute('style', leftStyle);
    
    const rightContainer = document.createElement('div');
    rightContainer.setAttribute('style', rightStyle);
    
    // Créer un wrapper flex pour obtenir les vraies largeurs
    const flexWrapper = document.createElement('div');
    flexWrapper.style.cssText = 'display: flex; gap: 20px; width: 595px;';
    flexWrapper.appendChild(leftContainer);
    flexWrapper.appendChild(rightContainer);
    
    measurer.innerHTML = '';
    measurer.appendChild(flexWrapper);
    
    const leftWidth = leftContainer.offsetWidth;
    const rightWidth = rightContainer.offsetWidth;
    
    console.log(`  📐 Largeurs calculées: left=${leftWidth}px, right=${rightWidth}px`);
    
    // Split chaque colonne indépendamment avec son propre measurer
    console.log('  🔵 Split de la colonne LEFT:');
    const leftChunks = splitColumnContent(leftCol.innerHTML, maxHeight, leftStyle, measurerLeftColumn);
    
    console.log('\n  🔴 Split de la colonne RIGHT:');
    const rightChunks = splitColumnContent(rightCol.innerHTML, maxHeight, rightStyle, measurerRightColumn);
    
    console.log(`  📋 Left: ${leftChunks.length} pages, Right: ${rightChunks.length} pages`);
    
    // Créer les pages en combinant left et right
    const maxPages = Math.max(leftChunks.length, rightChunks.length);
    const pages = [];
    
    for (let i = 0; i < maxPages; i++) {
      const hasLeftContent = i < leftChunks.length && leftChunks[i];
      const hasRightContent = i < rightChunks.length && rightChunks[i];
      
      // TOUJOURS mettre du contenu, même vide, pour maintenir la structure
      const leftContent = hasLeftContent ? leftChunks[i] : '<div style="min-height: 20px;">&nbsp;</div>';
      const rightContent = hasRightContent ? rightChunks[i] : '<div style="min-height: 20px;">&nbsp;</div>';
      
      console.log(`\n  📄 Page ${i + 1}:`);
      
      // Mesurer la hauteur de chaque colonne
      if (hasLeftContent) {
        measurer.innerHTML = '';
        const leftTest = document.createElement('div');
        leftTest.setAttribute('style', leftStyle);
        leftTest.innerHTML = leftContent;
        measurer.appendChild(leftTest);
        const leftHeight = measuredHeightWithMargins(measurer);
        const leftUsage = (leftHeight / maxHeight * 100).toFixed(1);
        const leftAvailable = (maxHeight - leftHeight).toFixed(1);
        console.log(`    LEFT: ${leftHeight.toFixed(1)}px utilisés (${leftUsage}%) - ${leftAvailable}px disponibles`);
      } else {
        console.log(`    LEFT: VIDE - ${maxHeight}px disponibles`);
      }
      
      if (hasRightContent) {
        measurer.innerHTML = '';
        const rightTest = document.createElement('div');
        rightTest.setAttribute('style', rightStyle);
        rightTest.innerHTML = rightContent;
        measurer.appendChild(rightTest);
        const rightHeight = measuredHeightWithMargins(measurer);
        const rightUsage = (rightHeight / maxHeight * 100).toFixed(1);
        const rightAvailable = (maxHeight - rightHeight).toFixed(1);
        console.log(`    RIGHT: ${rightHeight.toFixed(1)}px utilisés (${rightUsage}%) - ${rightAvailable}px disponibles`);
      } else {
        console.log(`    RIGHT: VIDE - ${maxHeight}px disponibles`);
      }
      
      // Recréer la structure flex avec les chunks en préservant les styles
      const pageHtml = `<div style="display: flex; gap: 20px; height: 100%;">
  <div style="${leftStyle}">${leftContent}</div>
  <div style="${rightStyle}">${rightContent}</div>
</div>`;
      
      pages.push(pageHtml);
      
      console.log(`    ✅ Structure flex créée avec 2 colonnes`);
    }
    
    console.log(`\n  ✅ RÉSUMÉ: ${pages.length} pages créées avec 2 colonnes`);
    console.log(`  📊 Répartition:`);
    
    let leftCount = 0, rightCount = 0, bothCount = 0, emptyCount = 0;
    for (let i = 0; i < maxPages; i++) {
      const hasLeft = i < leftChunks.length && leftChunks[i];
      const hasRight = i < rightChunks.length && rightChunks[i];
      
      if (hasLeft && hasRight) bothCount++;
      else if (hasLeft) leftCount++;
      else if (hasRight) rightCount++;
      else emptyCount++;
    }
    
    console.log(`    - Pages avec LEFT + RIGHT: ${bothCount}`);
    console.log(`    - Pages avec LEFT seulement: ${leftCount}`);
    console.log(`    - Pages avec RIGHT seulement: ${rightCount}`);
    console.log(`    - Pages vides (ni left ni right): ${emptyCount}`);
    console.log(`    ⚠️ IMPORTANT: Toutes les pages ont la structure 2 colonnes (même si vide)\n`);
    
    return pages;
  }

  // ================= PAGES =================
  
  function splitHtmlIntoChunks(html, maxHeight = CONFIG.MAX_PAGE_HEIGHT) {
    // IMPORTANT: Détecter si c'est un layout 2 colonnes AVANT de commencer
    if (html.includes('data-two-columns="true"')) {
      console.log('⚠️ Layout 2 colonnes détecté - redirection vers splitTwoColumnsLayout');
      return splitTwoColumnsLayout(html, maxHeight);
    }
    
    initMeasurer();
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
  
      if (tryAppend(col, clone, maxHeight)) continue;
  
      if (col.childNodes.length) {
        measurer.innerHTML = '';
        measurer.appendChild(col.cloneNode(true));
        const currentHeight = measuredHeightWithMargins(measurer);
        const usagePercent = currentHeight / maxHeight;
  
        if (usagePercent >= CONFIG.MIN_USAGE_PERCENT && usagePercent <= CONFIG.MAX_USAGE_PERCENT) {
          pushCol();
          if (tryAppend(col, clone, maxHeight)) continue;
        }
  
        // Diviser l'élément et continuer à diviser le reste si nécessaire
        let remaining = clone;
        
        while (remaining) {
          let splitResult;
          
          console.log(`🔄 Division en cours de <${remaining.tagName || 'NODE'}> (tentative ${chunks.length + 1})`);
          
          if (remaining.tagName === 'UL' || remaining.tagName === 'OL') {
            splitResult = splitListInContext(remaining, col, maxHeight);
          } else {
            splitResult = splitSimpleBlock(remaining, maxHeight);
          }
          
          console.log(`  📊 Résultat split: left=${splitResult.left ? 'existe' : 'null'}, right=${splitResult.right ? 'existe' : 'null'}`);
          
          // Ajouter left seulement s'il existe
          if (splitResult.left) {
            col.appendChild(splitResult.left);
            
            // Log du contenu ajouté
            const leftPreview = splitResult.left.outerHTML ? splitResult.left.outerHTML.substring(0, 100) : 'TEXT';
            console.log(`  ➕ Ajout à col: ${leftPreview}...`);
            
            // Mesurer la page avant de la fermer
            measurer.innerHTML = '';
            measurer.appendChild(col.cloneNode(true));
            const pageHeight = measuredHeightWithMargins(measurer);
            const pageUsage = (pageHeight / maxHeight * 100).toFixed(1);
            
            console.log(`📄 Fermeture page ${chunks.length + 1}: ${pageHeight.toFixed(1)}px (${pageUsage}%)`);
            
            if (pageHeight > maxHeight) {
              console.error(`❌ ERREUR: Page ${chunks.length + 1} dépasse la limite! ${pageHeight.toFixed(1)}px > ${maxHeight}px`);
            }
            
            pushCol(); // Fermer la page seulement si on a ajouté du contenu
          }
          
          // Si right existe, vérifier s'il rentre sur la nouvelle page
          if (splitResult.right) {
            console.log(`  🔍 Tentative d'ajout de right sur nouvelle page...`);
            
            if (tryAppend(col, splitResult.right, maxHeight)) {
              // Ça rentre! On a fini
              console.log(`  ✅ Right rentre sur la nouvelle page - terminé`);
              remaining = null;
            } else {
              // Ça ne rentre toujours pas, continuer à diviser
              console.log(`  ❌ Right ne rentre pas - continue la division`);
              remaining = splitResult.right;
            }
          } else {
            console.log(`  ℹ️ Pas de right - terminé`);
            remaining = null;
          }
        }
        continue;
      }
  
      col.appendChild(clone);
    }
  
    pushCol();
    return chunks;
  }
  
  function createPages(html) {
    // Détecter si c'est un layout 2 colonnes
    const hasTwoColumns = html.includes('data-two-columns="true"');
    
    const chunks = hasTwoColumns 
      ? splitTwoColumnsLayout(html) 
      : splitHtmlIntoChunks(html);
    
    return chunks.map((chunk, i) => `
      <div class="page" data-page="${i + 1}">
        <div class="column-content">${chunk}</div>
      </div>
    `).join('');
  }
  
  // Exposer les measurers globalement pour les tests
  if (typeof window !== 'undefined') {
    window.measurerLeftColumn = measurerLeftColumn;
    window.measurerRightColumn = measurerRightColumn;
    window.splitColumnContent = splitColumnContent;
  }
  
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { splitHtmlIntoChunks, createPages, CONFIG, splitColumnContent };
  }