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
    // Buffer dynamique basé sur la hauteur de ligne (demi-ligne de sécurité)
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
  
    // Validation d'une page avant de la pousser
    const validatePage = (html, pageNum) => {
      measurer.innerHTML = '';
      const div = document.createElement('div');
      div.innerHTML = html;
      measurer.appendChild(div);
      const h = measuredHeightWithMargins(measurer);
      
      if (h > maxHeight) {
        console.warn(`⚠️ Page ${pageNum + 1} trop grande (${h.toFixed(1)}px > ${maxHeight}px) - dépasse de ${(h - maxHeight).toFixed(1)}px`);
        return false;
      }
      return true;
    };
    
    // Force split - filet de sécurité ultime pour pages trop grandes
    const forceSplit = (container, maxH) => {
      console.log("🚨 ForceSplit activé - découpage brutal de la page");

      const left = document.createElement('div');
      const right = document.createElement('div');
      const children = Array.from(container.childNodes);

      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        left.appendChild(child.cloneNode(true));

        measurer.innerHTML = '';
        measurer.appendChild(left.cloneNode(true));

        if (overflows(maxH)) {
          // Retirer le dernier ajouté
          left.removeChild(left.lastChild);
          
          // Fallback: si c'est un texte ou paragraphe géant, essayer de le couper
          if (child.nodeType === Node.TEXT_NODE || 
              child.tagName === 'P' || 
              child.tagName === 'PRE' ||
              child.tagName === 'BLOCKQUOTE') {
            console.log(`  ✂️ Tentative de split texte/paragraphe pour <${child.tagName || 'TEXT'}>`);
            
            try {
              const [lt, rt] = splitTextToFit(left, child, maxH);
              if (lt) {
                left.appendChild(lt);
                console.log(`    ✅ Partie gauche ajoutée`);
              }
              if (rt) {
                right.appendChild(rt);
                console.log(`    ➡️ Partie droite ajoutée`);
                // Ajouter tous les enfants suivants
                for (let j = i + 1; j < children.length; j++) {
                  right.appendChild(children[j].cloneNode(true));
                }
              }
              break;
            } catch (e) {
              console.warn(`    ⚠️ Échec du split texte, basculement complet`, e);
              // Si ça échoue, basculer tout le bloc
              right.appendChild(child.cloneNode(true));
              for (let j = i + 1; j < children.length; j++) {
                right.appendChild(children[j].cloneNode(true));
              }
              break;
            }
          } else {
            // Bloc non divisible (image, table, etc.) - basculer tout
            console.log(`  📦 Bloc <${child.tagName}> non divisible - basculement complet`);
            for (let j = i; j < children.length; j++) {
              right.appendChild(children[j].cloneNode(true));
            }
            break;
          }
        }
      }

      return {
        left: left.innerHTML.trim() ? left : null,
        right: right.innerHTML.trim() ? right : null
      };
    };
    
    const pushCol = () => {
      if (col.innerHTML.trim()) {
        // Validation avant de pousser
        if (!validatePage(col.innerHTML, chunks.length)) {
          console.error(`❌ Page ${chunks.length + 1} invalide - correction avec forceSplit`);
          const result = forceSplit(col, maxHeight);
          if (result.left) {
            chunks.push(result.left.innerHTML);
            console.log(`  ✅ Left poussé: ${result.left.innerHTML.length} caractères`);
          }
          if (result.right) {
            chunks.push(result.right.innerHTML);
            console.log(`  ➡️ Right poussé: ${result.right.innerHTML.length} caractères`);
          }
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
    
    // Détecteur d'overflow - vérifier chaque chunk
    console.log('\n🔍 === DÉTECTION D\'OVERFLOW ===');
    let hasOverflow = false;
    chunks.forEach((chunk, i) => {
      measurer.innerHTML = '';
      const testDiv = document.createElement('div');
      testDiv.innerHTML = chunk;
      measurer.appendChild(testDiv);
      
      const height = measuredHeightWithMargins(measurer);
      const overflow = height > maxHeight;
      
      if (overflow) {
        hasOverflow = true;
        console.error(`❌ Page ${i + 1}: OVERFLOW détecté! ${height.toFixed(1)}px > ${maxHeight}px (dépasse de ${(height - maxHeight).toFixed(1)}px)`);
      } else {
        const usage = (height / maxHeight * 100).toFixed(1);
        console.log(`✅ Page ${i + 1}: ${height.toFixed(1)}px (${usage}%)`);
      }
    });
    
    if (hasOverflow) {
      console.error('\n⚠️ ATTENTION: Des pages dépassent la limite!');
    } else {
      console.log('\n✅ Toutes les pages respectent la limite de ' + maxHeight + 'px');
    }
    
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
