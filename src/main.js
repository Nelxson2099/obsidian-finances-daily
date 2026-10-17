/* ══════════════════════════════════════════════════════════════════════════
   FINANCES DAILY - RUEDA DE GASTOS
   Obsidian Extension by Nelxson2099
   ══════════════════════════════════════════════════════════════════════════ */

'use strict';

const obsidian = require('obsidian');

const VIEW_TYPE_FINANCES_DAILY = 'finances-daily-wheel-view';

const CATEGORIES = [
  { id: 'salud', name: 'Salud', icon: '🩺', color: '#10B981', headerTag: '### - SALUD', desc: 'Cuidado físico, medicina, nutrición' },
  { id: 'ocio', name: 'Ocio', icon: '🎮', color: '#8B5CF6', headerTag: '### - OCIO', desc: 'Diversión, videojuegos, series, salidas' },
  { id: 'desarrollo', name: 'Desarrollo Personal', icon: '🧠', color: '#3B82F6', headerTag: '### - DESARROLLO PERSONAL / FUERA DE CONFORT', desc: 'Crecimiento mental, cursos, libros, gym' },
  { id: 'profesion', name: 'Profesión', icon: '💼', color: '#6366F1', headerTag: '### - PROFESION', desc: 'Herramientas laborales, equipos, software' },
  { id: 'amor', name: 'Amor', icon: '❤️', color: '#EC4899', headerTag: '### - AMOR', desc: 'Pareja, citas románticas, detalles' },
  { id: 'amigos', name: 'Amigos', icon: '👥', color: '#F59E0B', headerTag: '### - AMIGOS', desc: 'Salidas, reuniones, tragos, compartir' },
  { id: 'familia', name: 'Familia', icon: '🏡', color: '#EF4444', headerTag: '### - FAMILIA', desc: 'Hogar, compras para la casa, apoyo familiar' },
  { id: 'finanzas', name: 'Finanzas', icon: '💰', color: '#14B8A6', headerTag: '### - FINANZAS', desc: 'Ahorro, inversiones, fondos, activos' }
];

const DEFAULT_SETTINGS = {
  currency: '$',
  monthlyBudget: 0,
  syncWithNote: true,
  syncNotePath: 'DIARIO DE RUEDA.md',
  transactions: []
};

// ─── PLUGIN CLASS ──────────────────────────────────────────────────────────
class FinancesDailyPlugin extends obsidian.Plugin {
  async onload() {
    await this.loadSettings();

    // Register View
    this.registerView(
      VIEW_TYPE_FINANCES_DAILY,
      (leaf) => new FinancesDailyView(leaf, this)
    );

    // Ribbon Icon (Wallet / Pie Chart)
    this.addRibbonIcon('pie-chart', 'Finances Daily - Rueda de Gastos', () => {
      this.activateView();
    });

    // Commands
    this.addCommand({
      id: 'open-wheel',
      name: 'Abrir Rueda de Gastos',
      callback: () => {
        this.activateView();
      }
    });

    this.addCommand({
      id: 'quick-add-expense',
      name: 'Registrar Gasto Rápido',
      callback: () => {
        new QuickExpenseModal(this.app, this).open();
      }
    });

    // Settings Tab
    this.addSettingTab(new FinancesDailySettingTab(this.app, this));

    console.log('Finances Daily - Rueda de Gastos plugin cargado con éxito');
  }

  onunload() {
    console.log('Finances Daily descargado');
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    if (!Array.isArray(this.settings.transactions)) {
      this.settings.transactions = [];
    }
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async activateView() {
    const { workspace } = this.app;
    let leaf = null;
    const leaves = workspace.getLeavesOfType(VIEW_TYPE_FINANCES_DAILY);

    if (leaves.length > 0) {
      leaf = leaves[0];
    } else {
      leaf = workspace.getLeaf(true);
      await leaf.setViewState({ type: VIEW_TYPE_FINANCES_DAILY, active: true });
    }

    workspace.revealLeaf(leaf);
  }

  async addExpense({ amount, concept, categoryId, date, time }) {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      new obsidian.Notice('❌ Por favor ingresa un monto válido mayor a 0');
      return false;
    }
    if (!concept || !concept.trim()) {
      new obsidian.Notice('❌ Por favor ingresa el concepto del gasto');
      return false;
    }

    const cat = CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0];
    const now = new Date();
    const finalDate = date || now.toISOString().split('T')[0];
    const finalTime = time || now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newTx = {
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      amount: parsedAmount,
      concept: concept.trim(),
      categoryId: cat.id,
      categoryName: cat.name,
      categoryIcon: cat.icon,
      categoryColor: cat.color,
      date: finalDate,
      time: finalTime,
      timestamp: Date.now()
    };

    this.settings.transactions.unshift(newTx);
    await this.saveSettings();

    // Auto-sync with Markdown note (e.g. DIARIO DE RUEDA.md)
    if (this.settings.syncWithNote && this.settings.syncNotePath) {
      await this.syncToMarkdownNote(newTx, cat);
    }

    new obsidian.Notice(`✅ Gasto guardado en ${cat.icon} ${cat.name}: ${this.settings.currency}${parsedAmount.toFixed(2)}`);
    return true;
  }

  async deleteExpense(id) {
    this.settings.transactions = this.settings.transactions.filter(t => t.id !== id);
    await this.saveSettings();
    new obsidian.Notice('🗑️ Gasto eliminado correctamente');
  }

  async syncToMarkdownNote(tx, cat) {
    try {
      const file = this.app.vault.getAbstractFileByPath(this.settings.syncNotePath);
      if (!file) {
        console.warn('Nota de sincronización no encontrada:', this.settings.syncNotePath);
        return;
      }

      const content = await this.app.vault.read(file);
      const entryLine = `${tx.date} ${tx.time} Gasto: ${this.settings.currency}${tx.amount.toFixed(2)} - ${tx.concept}`;

      // Find section header e.g. "### - SALUD"
      const targetHeader = cat.headerTag;
      let newContent = content;

      if (content.includes(targetHeader)) {
        const headerIdx = content.indexOf(targetHeader);
        const endOfLineIdx = content.indexOf('\n', headerIdx);
        if (endOfLineIdx !== -1) {
          newContent = content.slice(0, endOfLineIdx + 1) + entryLine + '\n' + content.slice(endOfLineIdx + 1);
        } else {
          newContent = content + '\n' + entryLine;
        }
      } else {
        // Append section at the end
        newContent = content.trim() + `\n\n${targetHeader}\n${entryLine}\n`;
      }

      await this.app.vault.modify(file, newContent);
      console.log('Sincronizado con éxito en', this.settings.syncNotePath);
    } catch (err) {
      console.error('Error sincronizando con nota de Obsidian:', err);
    }
  }
}

// ─── MAIN ITEMVIEW (INTERACTIVE WHEEL DASHBOARD) ──────────────────────────
class FinancesDailyView extends obsidian.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.currentFilter = 'mes'; // 'hoy' | 'semana' | 'mes' | 'todo'
    this.selectedCatFilter = null; // categoryId filter
    this.searchQuery = '';
    this.selectedFormCat = CATEGORIES[0].id;
  }

  getViewType() {
    return VIEW_TYPE_FINANCES_DAILY;
  }

  getDisplayText() {
    return 'Finances Daily - Rueda de Gastos';
  }

  getIcon() {
    return 'pie-chart';
  }

  async onOpen() {
    this.render();
  }

  render() {
    const container = this.containerEl.children[1];
    container.empty();
    container.addClass('finances-daily-view');

    const wrapper = container.createDiv({ cls: 'fd-container' });

    // 1. Header & Filter Tabs
    this.renderHeader(wrapper);

    // 2. Quick Capture Box
    this.renderQuickCapture(wrapper);

    // 3. Balance KPI Summary
    const filteredTxs = this.getFilteredTransactions();
    this.renderKPIs(wrapper, filteredTxs);

    // 4. Wheel & Quadrants Layout
    const layout = wrapper.createDiv({ cls: 'fd-wheel-layout' });
    this.renderWheel(layout, filteredTxs);
    this.renderQuadrants(layout, filteredTxs);

    // 5. Transaction History / Ledger
    this.renderLedger(wrapper, filteredTxs);
  }

  renderHeader(parent) {
    const header = parent.createDiv({ cls: 'fd-header' });

    const titleBlock = header.createDiv({ cls: 'fd-title-block' });
    const iconBadge = titleBlock.createDiv({ cls: 'fd-icon-badge' });
    iconBadge.setText('🎡');

    const textWrap = titleBlock.createDiv();
    const title = textWrap.createEl('h2', { cls: 'fd-title' });
    title.setText('Finances Daily');

    const subtitle = textWrap.createEl('p', { cls: 'fd-subtitle' });
    subtitle.setText('Rueda de Gastos de 8 Dimensiones de Vida');

    // Filter Tabs
    const actions = header.createDiv({ cls: 'fd-header-actions' });
    const tabs = actions.createDiv({ cls: 'fd-filter-tabs' });

    const filterOptions = [
      { key: 'hoy', label: 'Hoy' },
      { key: 'semana', label: 'Esta Semana' },
      { key: 'mes', label: 'Este Mes' },
      { key: 'todo', label: 'Todo' }
    ];

    filterOptions.forEach(opt => {
      const btn = tabs.createEl('button', {
        cls: `fd-tab-btn ${this.currentFilter === opt.key ? 'active' : ''}`,
        text: opt.label
      });
      btn.onclick = () => {
        this.currentFilter = opt.key;
        this.render();
      };
    });
  }

  renderKPIs(parent, txs) {
    const kpiGrid = parent.createDiv({ cls: 'fd-kpi-grid' });

    const total = txs.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const count = txs.length;

    // Top Category
    const totalsByCat = {};
    CATEGORIES.forEach(c => totalsByCat[c.id] = 0);
    txs.forEach(t => {
      totalsByCat[t.categoryId] = (totalsByCat[t.categoryId] || 0) + Number(t.amount);
    });

    let topCatId = null;
    let maxSpent = -1;
    for (const catId in totalsByCat) {
      if (totalsByCat[catId] > maxSpent) {
        maxSpent = totalsByCat[catId];
        topCatId = catId;
      }
    }
    const topCat = CATEGORIES.find(c => c.id === topCatId) || CATEGORIES[0];

    // Card 1: Total Gastado
    const c1 = kpiGrid.createDiv({ cls: 'fd-kpi-card' });
    c1.createDiv({ cls: 'fd-kpi-label', text: 'Total Gastado' });
    c1.createDiv({ cls: 'fd-kpi-value', text: `${this.plugin.settings.currency} ${total.toFixed(2)}` });
    c1.createDiv({ cls: 'fd-kpi-badge', text: `🧾 ${count} transaccion(es)` });

    // Card 2: Promedio por Gasto
    const avg = count > 0 ? (total / count) : 0;
    const c2 = kpiGrid.createDiv({ cls: 'fd-kpi-card' });
    c2.createDiv({ cls: 'fd-kpi-label', text: 'Ticket Promedio' });
    c2.createDiv({ cls: 'fd-kpi-value', text: `${this.plugin.settings.currency} ${avg.toFixed(2)}` });
    c2.createDiv({ cls: 'fd-kpi-badge', text: '📊 Por movimiento' });

    // Card 3: Área Dominante
    const c3 = kpiGrid.createDiv({ cls: 'fd-kpi-card' });
    c3.createDiv({ cls: 'fd-kpi-label', text: 'Mayor Inversión' });
    const topLabel = total > 0 ? `${topCat.icon} ${topCat.name}` : 'Sin gastos';
    c3.createDiv({ cls: 'fd-kpi-value', text: topLabel });
    const pct = total > 0 ? ((maxSpent / total) * 100).toFixed(1) + '%' : '0%';
    c3.createDiv({ cls: 'fd-kpi-badge', text: `Representa el ${pct} del total` });

    // Card 4: Equilibrio de Vida (Balance Score)
    // Measures how evenly spread spending is across active categories
    const activeCats = Object.values(totalsByCat).filter(v => v > 0).length;
    const balancePct = Math.round((activeCats / 8) * 100);
    const c4 = kpiGrid.createDiv({ cls: 'fd-kpi-card' });
    c4.createDiv({ cls: 'fd-kpi-label', text: 'Balance de Rueda' });
    c4.createDiv({ cls: 'fd-kpi-value', text: `${activeCats} / 8 Áreas` });
    c4.createDiv({ cls: 'fd-kpi-badge', text: `🎯 ${balancePct}% de equilibrio activo` });
  }

  renderQuickCapture(parent) {
    const box = parent.createDiv({ cls: 'fd-capture-box' });

    const title = box.createDiv({ cls: 'fd-capture-title' });
    title.setText('⚡ Registro Rápido de Gasto');

    // Category Selector (8 colorful pills)
    const catSelector = box.createDiv({ cls: 'fd-category-selector' });
    CATEGORIES.forEach(c => {
      const isSelected = this.selectedFormCat === c.id;
      const pill = catSelector.createEl('button', {
        cls: `fd-cat-pill ${isSelected ? 'selected' : ''}`,
        attr: { type: 'button' }
      });
      pill.style.borderColor = isSelected ? c.color : 'var(--background-modifier-border)';
      pill.style.background = isSelected ? c.color : 'var(--background-primary)';

      const iconSpan = pill.createSpan();
      iconSpan.setText(c.icon);

      const nameSpan = pill.createSpan();
      nameSpan.setText(c.name);

      pill.onclick = () => {
        this.selectedFormCat = c.id;
        this.renderQuickCapturePills(catSelector);
      };
    });

    // Inputs Row
    const inputsRow = box.createDiv({ cls: 'fd-capture-inputs' });

    const amountInput = inputsRow.createEl('input', {
      cls: 'fd-input fd-amount-input',
      attr: {
        type: 'number',
        step: '0.01',
        min: '0.01',
        placeholder: `Monto (${this.plugin.settings.currency})`
      }
    });

    const conceptInput = inputsRow.createEl('input', {
      cls: 'fd-input',
      attr: {
        type: 'text',
        placeholder: '¿En qué invertiste? (ej: Café con amigos, Libro Python, Cena...)'
      }
    });

    const submitBtn = inputsRow.createEl('button', {
      cls: 'fd-submit-btn',
      text: 'Registrar Gasto'
    });

    const handleAdd = async () => {
      const val = amountInput.value;
      const conc = conceptInput.value;
      const ok = await this.plugin.addExpense({
        amount: val,
        concept: conc,
        categoryId: this.selectedFormCat
      });
      if (ok) {
        amountInput.value = '';
        conceptInput.value = '';
        this.render();
      }
    };

    submitBtn.onclick = handleAdd;

    conceptInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleAdd();
    });
    amountInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') conceptInput.focus();
    });
  }

  renderQuickCapturePills(selectorEl) {
    const pills = selectorEl.querySelectorAll('.fd-cat-pill');
    pills.forEach((p, idx) => {
      const c = CATEGORIES[idx];
      const isSelected = this.selectedFormCat === c.id;
      if (isSelected) {
        p.addClass('selected');
        p.style.background = c.color;
        p.style.borderColor = c.color;
      } else {
        p.removeClass('selected');
        p.style.background = 'var(--background-primary)';
        p.style.borderColor = 'var(--background-modifier-border)';
      }
    });
  }

  renderWheel(parent, txs) {
    const card = parent.createDiv({ cls: 'fd-wheel-card' });

    // Calculate totals per category
    const totals = {};
    CATEGORIES.forEach(c => totals[c.id] = 0);
    txs.forEach(t => {
      totals[t.categoryId] = (totals[t.categoryId] || 0) + Number(t.amount);
    });

    const grandTotal = txs.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const maxVal = Math.max(...Object.values(totals), 1);

    // SVG parameters
    const size = 380;
    const cx = size / 2;
    const cy = size / 2;
    const rInner = 60;
    const rBaseOuter = 120;
    const maxExtra = 35; // dynamic expansion for areas with more spend!

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
    svg.setAttribute('class', 'fd-svg-wheel');

    // 8 slices: 360 / 8 = 45 degrees each
    const sliceAngle = 45;
    const gap = 2.5; // degrees gap between slices

    CATEGORIES.forEach((c, idx) => {
      const startDeg = -90 + (idx * sliceAngle) + (gap / 2);
      const endDeg = -90 + ((idx + 1) * sliceAngle) - (gap / 2);

      const catSpent = totals[c.id] || 0;
      // Dynamic radius: categories with spending protrude elegantly!
      const protrusion = grandTotal > 0 ? (catSpent / maxVal) * maxExtra : 0;
      const rOuter = rBaseOuter + protrusion;

      const pathData = this.describeArc(cx, cy, rInner, rOuter, startDeg, endDeg);

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathData);
      path.setAttribute('fill', c.color);
      path.setAttribute('class', 'fd-slice');
      const isSelected = this.selectedCatFilter === c.id;
      path.setAttribute('opacity', this.selectedCatFilter ? (isSelected ? '1' : '0.25') : '0.88');
      path.setAttribute('stroke', isSelected ? '#FFFFFF' : 'rgba(0,0,0,0.3)');
      path.setAttribute('stroke-width', isSelected ? '2.5' : '1');

      // Click to filter by category
      path.onclick = () => {
        this.selectedCatFilter = this.selectedCatFilter === c.id ? null : c.id;
        this.render();
      };

      // Hover Tooltip Title
      const catPct = grandTotal > 0 ? ((catSpent / grandTotal) * 100).toFixed(1) : '0';
      const titleEl = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      titleEl.textContent = `${c.icon} ${c.name}: ${this.plugin.settings.currency}${catSpent.toFixed(2)} (${catPct}%)`;
      path.appendChild(titleEl);

      svg.appendChild(path);

      // Category Icon positioned at mid radius
      const midDeg = (startDeg + endDeg) / 2;
      const midRad = (midDeg * Math.PI) / 180;
      const iconDist = rInner + (rOuter - rInner) * 0.55;
      const ix = cx + iconDist * Math.cos(midRad);
      const iy = cy + iconDist * Math.sin(midRad);

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', ix);
      text.setAttribute('y', iy);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'central');
      text.setAttribute('font-size', '13');
      text.setAttribute('pointer-events', 'none');
      text.textContent = c.icon;
      svg.appendChild(text);
    });

    // Center Circle (Hub)
    const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    centerCircle.setAttribute('cx', cx);
    centerCircle.setAttribute('cy', cy);
    centerCircle.setAttribute('r', rInner - 4);
    centerCircle.setAttribute('fill', 'var(--background-primary)');
    centerCircle.setAttribute('stroke', 'var(--background-modifier-border)');
    centerCircle.setAttribute('stroke-width', '2');
    svg.appendChild(centerCircle);

    // Center Total Text
    const centerAmount = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    centerAmount.setAttribute('x', cx);
    centerAmount.setAttribute('y', cy - 5);
    centerAmount.setAttribute('text-anchor', 'middle');
    centerAmount.setAttribute('fill', 'var(--text-normal)');
    centerAmount.setAttribute('font-size', '14');
    centerAmount.setAttribute('font-weight', 'bold');
    centerAmount.setAttribute('font-family', 'var(--font-monospace)');
    centerAmount.textContent = `${this.plugin.settings.currency}${grandTotal.toFixed(0)}`;
    svg.appendChild(centerAmount);

    const centerLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    centerLabel.setAttribute('x', cx);
    centerLabel.setAttribute('y', cy + 14);
    centerLabel.setAttribute('text-anchor', 'middle');
    centerLabel.setAttribute('fill', 'var(--text-muted)');
    centerLabel.setAttribute('font-size', '9');
    centerLabel.setAttribute('text-transform', 'uppercase');
    centerLabel.setAttribute('letter-spacing', '0.05em');
    centerLabel.textContent = this.selectedCatFilter ? 'FILTRADO' : 'TOTAL';
    svg.appendChild(centerLabel);

    card.appendChild(svg);

    // Interactive Legend
    const legend = card.createDiv({ cls: 'fd-wheel-legend' });
    CATEGORIES.forEach(c => {
      const isSelected = this.selectedCatFilter === c.id;
      const item = legend.createDiv({ cls: `fd-legend-item ${isSelected ? 'active' : ''}` });
      const dot = item.createDiv({ cls: 'fd-legend-dot' });
      dot.style.background = c.color;
      item.createSpan({ text: `${c.icon} ${c.name}` });

      item.onclick = () => {
        this.selectedCatFilter = this.selectedCatFilter === c.id ? null : c.id;
        this.render();
      };
    });
  }

  describeArc(cx, cy, rIn, rOut, startAngle, endAngle) {
    const toRad = Math.PI / 180;
    const a1 = startAngle * toRad;
    const a2 = endAngle * toRad;

    const x1Out = cx + rOut * Math.cos(a1);
    const y1Out = cy + rOut * Math.sin(a1);
    const x2Out = cx + rOut * Math.cos(a2);
    const y2Out = cy + rOut * Math.sin(a2);

    const x1In = cx + rIn * Math.cos(a2);
    const y1In = cy + rIn * Math.sin(a2);
    const x2In = cx + rIn * Math.cos(a1);
    const y2In = cy + rIn * Math.sin(a1);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return [
      `M ${x1Out} ${y1Out}`,
      `A ${rOut} ${rOut} 0 ${largeArc} 1 ${x2Out} ${y2Out}`,
      `L ${x1In} ${y1In}`,
      `A ${rIn} ${rIn} 0 ${largeArc} 0 ${x2In} ${y2In}`,
      'Z'
    ].join(' ');
  }

  renderQuadrants(parent, txs) {
    const grid = parent.createDiv({ cls: 'fd-quadrant-grid' });

    const totals = {};
    CATEGORIES.forEach(c => totals[c.id] = 0);
    const counts = {};
    CATEGORIES.forEach(c => counts[c.id] = 0);

    txs.forEach(t => {
      totals[t.categoryId] = (totals[t.categoryId] || 0) + Number(t.amount);
      counts[t.categoryId] = (counts[t.categoryId] || 0) + 1;
    });

    const grandTotal = txs.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    CATEGORIES.forEach(c => {
      const spent = totals[c.id] || 0;
      const count = counts[c.id] || 0;
      const pct = grandTotal > 0 ? ((spent / grandTotal) * 100).toFixed(1) : '0';
      const isSelected = this.selectedCatFilter === c.id;

      const card = grid.createDiv({
        cls: `fd-quad-card ${isSelected ? 'active-filter' : ''}`
      });

      card.onclick = () => {
        this.selectedCatFilter = this.selectedCatFilter === c.id ? null : c.id;
        this.render();
      };

      const top = card.createDiv({ cls: 'fd-quad-top' });
      const identity = top.createDiv({ cls: 'fd-quad-identity' });

      const iconBox = identity.createDiv({ cls: 'fd-quad-icon' });
      iconBox.style.background = c.color + '22';
      iconBox.style.border = `1px solid ${c.color}44`;
      iconBox.setText(c.icon);

      const nameBox = identity.createDiv();
      nameBox.createDiv({ cls: 'fd-quad-name', text: c.name });
      nameBox.createDiv({ cls: 'fd-quad-desc', text: c.desc });

      top.createDiv({ cls: 'fd-quad-amount', text: `${this.plugin.settings.currency}${spent.toFixed(2)}` });

      // Progress Bar
      const pBg = card.createDiv({ cls: 'fd-progress-bar-bg' });
      const pFill = pBg.createDiv({ cls: 'fd-progress-bar-fill' });
      pFill.style.background = c.color;
      pFill.style.width = `${Math.min(100, Math.max(0, pct))}%`;

      // Footer
      const footer = card.createDiv({ cls: 'fd-quad-footer' });
      footer.createSpan({ text: `${count} gasto(s)` });
      footer.createSpan({ text: `${pct}% del total` });
    });
  }

  renderLedger(parent, txs) {
    const box = parent.createDiv({ cls: 'fd-ledger-box' });

    const header = box.createDiv({ cls: 'fd-ledger-header' });
    const title = header.createDiv({ cls: 'fd-ledger-title' });
    const filterCatObj = CATEGORIES.find(c => c.id === this.selectedCatFilter);
    title.setText(filterCatObj ? `📜 Movimientos: ${filterCatObj.icon} ${filterCatObj.name}` : '📜 Historial de Gastos');

    const searchInput = header.createEl('input', {
      cls: 'fd-search-input',
      attr: {
        type: 'text',
        placeholder: '🔍 Buscar gasto o concepto...'
      }
    });
    searchInput.value = this.searchQuery;
    searchInput.oninput = (e) => {
      this.searchQuery = e.target.value;
      this.renderLedgerList(listWrap, txs);
    };

    const listWrap = box.createDiv({ cls: 'fd-ledger-list' });
    this.renderLedgerList(listWrap, txs);
  }

  renderLedgerList(parent, txs) {
    parent.empty();

    let displayList = [...txs];

    if (this.selectedCatFilter) {
      displayList = displayList.filter(t => t.categoryId === this.selectedCatFilter);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      displayList = displayList.filter(t =>
        (t.concept && t.concept.toLowerCase().includes(q)) ||
        (t.categoryName && t.categoryName.toLowerCase().includes(q)) ||
        String(t.amount).includes(q)
      );
    }

    if (displayList.length === 0) {
      const empty = parent.createDiv({ cls: 'fd-empty-state' });
      empty.setText('No hay gastos registrados para este filtro. ¡Agrega uno arriba!');
      return;
    }

    displayList.forEach(item => {
      const cat = CATEGORIES.find(c => c.id === item.categoryId) || CATEGORIES[0];
      const row = parent.createDiv({ cls: 'fd-ledger-item' });

      const left = row.createDiv({ cls: 'fd-item-left' });
      const badge = left.createDiv({ cls: 'fd-item-badge' });
      badge.style.background = cat.color + '22';
      badge.style.color = cat.color;
      badge.style.border = `1px solid ${cat.color}44`;
      badge.setText(`${cat.icon} ${cat.name}`);

      const textWrap = left.createDiv();
      textWrap.createDiv({ cls: 'fd-item-concept', text: item.concept });
      textWrap.createDiv({ cls: 'fd-item-date', text: `${item.date} • ${item.time}` });

      const right = row.createDiv({ cls: 'fd-item-right' });
      right.createDiv({ cls: 'fd-item-amount', text: `-${this.plugin.settings.currency}${Number(item.amount).toFixed(2)}` });

      const delBtn = right.createEl('button', {
        cls: 'fd-delete-btn',
        attr: { title: 'Eliminar este gasto' }
      });
      delBtn.setText('🗑️');
      delBtn.onclick = async () => {
        if (confirm(`¿Eliminar el gasto "${item.concept}" por ${this.plugin.settings.currency}${item.amount}?`)) {
          await this.plugin.deleteExpense(item.id);
          this.render();
        }
      };
    });
  }

  getFilteredTransactions() {
    const list = this.plugin.settings.transactions || [];
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    if (this.currentFilter === 'hoy') {
      return list.filter(t => t.date === todayStr);
    }

    if (this.currentFilter === 'semana') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return list.filter(t => new Date(t.date) >= sevenDaysAgo);
    }

    if (this.currentFilter === 'mes') {
      const currentYearMonth = todayStr.substring(0, 7);
      return list.filter(t => (t.date || '').startsWith(currentYearMonth));
    }

    return list;
  }
}

// ─── QUICK ADD MODAL ────────────────────────────────────────────────────────
class QuickExpenseModal extends obsidian.Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
    this.selectedCat = CATEGORIES[0].id;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('fd-modal');

    const title = contentEl.createEl('h3', { cls: 'fd-modal-header' });
    title.setText('🎡 Registrar Gasto - Finances Daily');

    // Category Selector
    const catSelector = contentEl.createDiv({ cls: 'fd-category-selector' });
    CATEGORIES.forEach(c => {
      const isSelected = this.selectedCat === c.id;
      const pill = catSelector.createEl('button', {
        cls: `fd-cat-pill ${isSelected ? 'selected' : ''}`,
        attr: { type: 'button' }
      });
      pill.style.borderColor = isSelected ? c.color : 'var(--background-modifier-border)';
      pill.style.background = isSelected ? c.color : 'var(--background-primary)';
      pill.setText(`${c.icon} ${c.name}`);

      pill.onclick = () => {
        this.selectedCat = c.id;
        const all = catSelector.querySelectorAll('.fd-cat-pill');
        all.forEach((p, idx) => {
          const match = CATEGORIES[idx];
          if (match.id === c.id) {
            p.addClass('selected');
            p.style.background = match.color;
            p.style.borderColor = match.color;
          } else {
            p.removeClass('selected');
            p.style.background = 'var(--background-primary)';
            p.style.borderColor = 'var(--background-modifier-border)';
          }
        });
      };
    });

    // Inputs
    const amountInput = contentEl.createEl('input', {
      cls: 'fd-input fd-amount-input',
      attr: {
        type: 'number',
        step: '0.01',
        min: '0.01',
        placeholder: `Monto (${this.plugin.settings.currency})`,
        style: 'width: 100%; margin-top: 8px;'
      }
    });

    const conceptInput = contentEl.createEl('input', {
      cls: 'fd-input',
      attr: {
        type: 'text',
        placeholder: 'Concepto (ej: Almuerzo, Uber, Curso)',
        style: 'width: 100%; margin-top: 8px;'
      }
    });

    const submitBtn = contentEl.createEl('button', {
      cls: 'fd-submit-btn',
      text: 'Guardar en Rueda de Gastos',
      attr: { style: 'width: 100%; margin-top: 12px; padding: 12px;' }
    });

    const doSubmit = async () => {
      const ok = await this.plugin.addExpense({
        amount: amountInput.value,
        concept: conceptInput.value,
        categoryId: this.selectedCat
      });
      if (ok) {
        this.close();
      }
    };

    submitBtn.onclick = doSubmit;
    conceptInput.onkeydown = (e) => { if (e.key === 'Enter') doSubmit(); };
    amountInput.onkeydown = (e) => { if (e.key === 'Enter') conceptInput.focus(); };

    setTimeout(() => amountInput.focus(), 50);
  }

  onClose() {
    this.contentEl.empty();
  }
}

// ─── SETTINGS TAB ──────────────────────────────────────────────────────────
class FinancesDailySettingTab extends obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'Configuración de Finances Daily' });

    new obsidian.Setting(containerEl)
      .setName('Símbolo de Moneda')
      .setDesc('El símbolo monetario a mostrar (ej: $, €, Bs, USDT, MXN).')
      .addText(text => text
        .setPlaceholder('$')
        .setValue(this.plugin.settings.currency)
        .onChange(async (val) => {
          this.plugin.settings.currency = val.trim() || '$';
          await this.plugin.saveSettings();
        }));

    new obsidian.Setting(containerEl)
      .setName('Sincronizar automáticamente con Nota Markdown')
      .setDesc('Si está activo, cada gasto registrado se añadirá automáticamente a tu nota de diario en el área de vida correspondiente.')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.syncWithNote)
        .onChange(async (val) => {
          this.plugin.settings.syncWithNote = val;
          await this.plugin.saveSettings();
        }));

    new obsidian.Setting(containerEl)
      .setName('Ruta de la Nota para Sincronización')
      .setDesc('Nombre o ruta del archivo en el Vault (por defecto: DIARIO DE RUEDA.md).')
      .addText(text => text
        .setPlaceholder('DIARIO DE RUEDA.md')
        .setValue(this.plugin.settings.syncNotePath)
        .onChange(async (val) => {
          this.plugin.settings.syncNotePath = val.trim() || 'DIARIO DE RUEDA.md';
          await this.plugin.saveSettings();
        }));

    // Data Export & Reset
    containerEl.createEl('h3', { text: 'Gestión de Datos' });

    new obsidian.Setting(containerEl)
      .setName('Exportar Gastos a CSV')
      .setDesc('Descarga todos los gastos en un archivo .csv compatible con Excel o Google Sheets.')
      .addButton(btn => btn
        .setButtonText('Exportar CSV')
        .onClick(() => {
          const txs = this.plugin.settings.transactions || [];
          if (txs.length === 0) {
            new obsidian.Notice('No hay gastos para exportar');
            return;
          }
          const headers = ['ID', 'Fecha', 'Hora', 'Categoria', 'Concepto', 'Monto'];
          const rows = txs.map(t => [t.id, t.date, t.time, t.categoryName, `"${t.concept}"`, t.amount]);
          const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `finances_daily_${new Date().toISOString().split('T')[0]}.csv`;
          a.click();
          URL.revokeObjectURL(url);
          new obsidian.Notice('✅ Archivo CSV exportado');
        }));

    new obsidian.Setting(containerEl)
      .setName('Reiniciar Historial de Gastos')
      .setDesc('⚠️ Borra todos los registros guardados en la extensión.')
      .addButton(btn => btn
        .setButtonText('Borrar Todo')
        .setWarning()
        .onClick(async () => {
          if (confirm('¿Estás seguro de que deseas eliminar TODOS los gastos registrados en la Rueda? Esta acción no se puede deshacer.')) {
            this.plugin.settings.transactions = [];
            await this.plugin.saveSettings();
            new obsidian.Notice('Historial reiniciado correctamente');
          }
        }));
  }
}

module.exports = FinancesDailyPlugin;

module.exports.default = FinancesDailyPlugin;
