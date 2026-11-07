/* ══════════════════════════════════════════════════════════════════════════
   FINANCES DAILY - RUEDA DE GASTOS & CAJA DE AHORROS
   Obsidian Extension by Nelxson2099
   ══════════════════════════════════════════════════════════════════════════ */

'use strict';

const obsidian = require('obsidian');

const VIEW_TYPE_FINANCES_DAILY = 'finances-daily-wheel-view';

// ─── i18n LOCALIZATION ENGINE (EN / ES) ───
const USER_LOCALE = (typeof window !== 'undefined' && (
  (window.moment && typeof window.moment.locale === 'function' && window.moment.locale()) ||
  (navigator && navigator.language) ||
  'en'
)).toLowerCase();
const IS_ES = USER_LOCALE.startsWith('es');

const I18N = {
  en: {
    pluginTitle: 'Finances Daily - 8-Dimension Expense Wheel & Savings Vault',
    openCommand: 'Open Finances Daily Dashboard',
    catSalud: 'Health',
    catSaludDesc: 'Physical care, medicine, nutrition',
    catOcio: 'Leisure',
    catOcioDesc: 'Gaming, entertainment, shows, outings',
    catDesarrollo: 'Personal Growth',
    catDesarrolloDesc: 'Mindset, courses, books, workout',
    catProfesion: 'Profession',
    catProfesionDesc: 'Work equipment, tools, software',
    catAmor: 'Love',
    catAmorDesc: 'Partner, romantic dates, gifts',
    catAmigos: 'Friends',
    catAmigosDesc: 'Gatherings, meetups, drinks, social',
    catFamilia: 'Family',
    catFamiliaDesc: 'Household, groceries, family support',
    catFinanzas: 'Finances',
    catFinanzasDesc: 'Savings, investments, funds, assets',
    subtitleWheel: '8-Dimension Life Expense Wheel & Savings Vault',
    filterToday: 'Today',
    filterWeek: 'This Week',
    filterMonth: 'This Month',
    filterAll: 'All',
    totalSpent: 'Total Spent',
    recordsCount: 'Transactions',
    topCategory: 'Top Category',
    budgetMonthly: 'Monthly Budget',
    budgetUsed: 'Budget Used',
    addExpenseBtn: '+ New Expense',
    addSavingsBtn: '+ Deposit to Savings',
    withdrawSavingsBtn: '- Withdraw Savings',
    newWishBtn: '+ Add to Wishlist',
    historyTitle: 'Transaction History',
    wishlistTitle: 'Wishlist & Goals',
    savingsVaultTitle: 'Savings Vault',
    balanceLabel: 'Current Balance',
    goalLabel: 'Savings Goal',
    saveBtn: 'Save',
    cancelBtn: 'Cancel',
    deleteBtn: 'Delete'
  },
  es: {
    pluginTitle: 'Finances Daily - Rueda de Gastos de 8 Dimensiones & Caja de Ahorros',
    openCommand: 'Abrir Dashboard de Rueda de Gastos & Finanzas',
    catSalud: 'Salud',
    catSaludDesc: 'Cuidado físico, medicina, nutrición',
    catOcio: 'Ocio',
    catOcioDesc: 'Diversión, videojuegos, series, salidas',
    catDesarrollo: 'Desarrollo Personal',
    catDesarrolloDesc: 'Crecimiento mental, cursos, libros, gym',
    catProfesion: 'Profesión',
    catProfesionDesc: 'Herramientas laborales, equipos, software',
    catAmor: 'Amor',
    catAmorDesc: 'Pareja, citas románticas, detalles',
    catAmigos: 'Amigos',
    catAmigosDesc: 'Salidas, reuniones, tragos, compartir',
    catFamilia: 'Familia',
    catFamiliaDesc: 'Hogar, compras para la casa, apoyo familiar',
    catFinanzas: 'Finanzas',
    catFinanzasDesc: 'Ahorro, inversiones, fondos, activos',
    subtitleWheel: 'Rueda de Gastos de 8 Dimensiones de Vida & Caja de Ahorros',
    filterToday: 'Hoy',
    filterWeek: 'Esta Semana',
    filterMonth: 'Este Mes',
    filterAll: 'Todo',
    totalSpent: 'Gasto Total',
    recordsCount: 'Movimientos',
    topCategory: 'Top Categoría',
    budgetMonthly: 'Presupuesto Mensual',
    budgetUsed: 'Presupuesto Utilizado',
    addExpenseBtn: '+ Nuevo Gasto',
    addSavingsBtn: '+ Depositar Ahorro',
    withdrawSavingsBtn: '- Retirar Ahorro',
    newWishBtn: '+ Agregar a Lista de Deseos',
    historyTitle: 'Historial de Gastos',
    wishlistTitle: 'Lista de Deseos & Metas',
    savingsVaultTitle: 'Caja de Ahorros',
    balanceLabel: 'Balance Actual',
    goalLabel: 'Meta de Ahorro',
    saveBtn: 'Guardar',
    cancelBtn: 'Cancelar',
    deleteBtn: 'Eliminar'
  }
};

function t(key, fallback = '') {
  return (IS_ES ? I18N.es[key] : I18N.en[key]) || I18N.en[key] || fallback || key;
}

const CATEGORIES = [
  { id: 'salud', get name() { return t('catSalud'); }, icon: '🩺', color: '#10B981', headerTag: '### - SALUD', get desc() { return t('catSaludDesc'); } },
  { id: 'ocio', get name() { return t('catOcio'); }, icon: '🎮', color: '#8B5CF6', headerTag: '### - OCIO', get desc() { return t('catOcioDesc'); } },
  { id: 'desarrollo', get name() { return t('catDesarrollo'); }, icon: '🧠', color: '#3B82F6', headerTag: '### - DESARROLLO PERSONAL / FUERA DE CONFORT', get desc() { return t('catDesarrolloDesc'); } },
  { id: 'profesion', get name() { return t('catProfesion'); }, icon: '💼', color: '#6366F1', headerTag: '### - PROFESION', get desc() { return t('catProfesionDesc'); } },
  { id: 'amor', get name() { return t('catAmor'); }, icon: '❤️', color: '#EC4899', headerTag: '### - AMOR', get desc() { return t('catAmorDesc'); } },
  { id: 'amigos', get name() { return t('catAmigos'); }, icon: '👥', color: '#F59E0B', headerTag: '### - AMIGOS', get desc() { return t('catAmigosDesc'); } },
  { id: 'familia', get name() { return t('catFamilia'); }, icon: '🏡', color: '#EF4444', headerTag: '### - FAMILIA', get desc() { return t('catFamiliaDesc'); } },
  { id: 'finanzas', get name() { return t('catFinanzas'); }, icon: '💰', color: '#14B8A6', headerTag: '### - FINANZAS', get desc() { return t('catFinanzasDesc'); } }
];

const DEFAULT_SETTINGS = {
  currency: '$',
  monthlyBudget: 0,
  syncWithNote: true,
  syncNotePath: 'DIARIO DE RUEDA.md',
  transactions: [],
  wishlist: [],
  wishlistSort: 'desc', // 'desc' (más caro) | 'asc' (más barato) | 'recent' | 'category'
  wishlistFilter: 'pending', // 'pending' | 'bought'
  savingsBalance: 0,
  savingsGoal: 0,
  savingsHistory: []
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
      name: 'Abrir Rueda de Gastos & Finanzas',
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

    this.addCommand({
      id: 'quick-add-wishlist',
      name: 'Agregar Deseo a Wishlist (8 Cuadrantes)',
      callback: () => {
        new QuickWishlistModal(this.app, this).open();
      }
    });

    this.addCommand({
      id: 'manage-savings',
      name: 'Gestionar Caja de Ahorros',
      callback: () => {
        new SavingsDepositModal(this.app, this).open();
      }
    });

    // Settings Tab
    this.addSettingTab(new FinancesDailySettingTab(this.app, this));

    console.log('Finances Daily - Rueda de Gastos & Caja de Ahorros cargado con éxito');
  }

  onunload() {
    console.log('Finances Daily descargado');
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    if (!Array.isArray(this.settings.transactions)) {
      this.settings.transactions = [];
    }
    if (!Array.isArray(this.settings.wishlist)) {
      this.settings.wishlist = [];
    }
    if (!Array.isArray(this.settings.savingsHistory)) {
      this.settings.savingsHistory = [];
    }
    if (typeof this.settings.savingsBalance !== 'number') {
      this.settings.savingsBalance = 0;
    }
    if (typeof this.settings.savingsGoal !== 'number') {
      this.settings.savingsGoal = 0;
    }
    if (!this.settings.wishlistSort) {
      this.settings.wishlistSort = 'desc';
    }
    if (!this.settings.wishlistFilter || this.settings.wishlistFilter === 'all') {
      this.settings.wishlistFilter = 'pending';
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

  // ─── GASTOS METHODS ───────────────────────────────────────────────────────
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

    // Auto-sync with Markdown note
    if (this.settings.syncWithNote && this.settings.syncNotePath) {
      await this.syncToMarkdownNote(newTx, cat);
    }

    new obsidian.Notice(`✅ Gasto guardado en ${cat.icon} ${cat.name}: ${this.settings.currency}${parsedAmount.toFixed(2)}`);
    return true;
  }

  async deleteExpense(id) {
    // If it was linked to a wishlist item, uncheck that item
    const linkedWish = (this.settings.wishlist || []).find(w => w.txId === id);
    if (linkedWish) {
      linkedWish.bought = false;
      linkedWish.boughtDate = null;
      linkedWish.txId = null;
    }

    this.settings.transactions = this.settings.transactions.filter(t => t.id !== id);
    await this.saveSettings();
    new obsidian.Notice('🗑️ Gasto eliminado correctamente');
  }

  // ─── WISHLIST METHODS (VINCULADA A LOS 8 CUADRANTES) ──────────────────────
  async addWishlistItem({ amount, concept, categoryId }) {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      new obsidian.Notice('❌ Por favor ingresa un precio o monto estimado válido');
      return false;
    }
    if (!concept || !concept.trim()) {
      new obsidian.Notice('❌ Por favor escribe qué te quieres comprar');
      return false;
    }

    const cat = CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0];
    const now = new Date();

    const newItem = {
      id: 'wish_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      concept: concept.trim(),
      amount: parsedAmount,
      categoryId: cat.id,
      categoryName: cat.name,
      categoryIcon: cat.icon,
      categoryColor: cat.color,
      bought: false,
      boughtDate: null,
      txId: null,
      createdAt: Date.now(),
      createdDate: now.toISOString().split('T')[0]
    };

    this.settings.wishlist.unshift(newItem);
    await this.saveSettings();

    new obsidian.Notice(`🎯 "${newItem.concept}" agregado a la Wishlist en ${cat.icon} ${cat.name}`);
    return newItem;
  }

  async toggleWishlistItem(id) {
    const item = (this.settings.wishlist || []).find(w => w.id === id);
    if (!item) return;

    const cat = CATEGORIES.find(c => c.id === item.categoryId) || CATEGORIES[0];
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (!item.bought) {
      // MARCAR COMO COMPRADO -> ENTRA ACTIVAMENTE EN LA RUEDA DE GASTOS
      const txId = 'tx_wish_' + item.id;
      const newTx = {
        id: txId,
        amount: Number(item.amount),
        concept: item.concept,
        categoryId: cat.id,
        categoryName: cat.name,
        categoryIcon: cat.icon,
        categoryColor: cat.color,
        date: todayStr,
        time: timeStr,
        timestamp: Date.now(),
        isFromWishlist: true,
        wishlistId: item.id
      };

      // Add to transactions list
      this.settings.transactions.unshift(newTx);

      item.bought = true;
      item.boughtDate = todayStr;
      item.txId = txId;

      await this.saveSettings();

      // Sync to note if active
      if (this.settings.syncWithNote && this.settings.syncNotePath) {
        await this.syncToMarkdownNote(newTx, cat);
      }

      new obsidian.Notice(`✅ "${item.concept}" comprado: ¡Pasó a la cola de gastos general en ${cat.icon} ${cat.name}!`);
    } else {
      // DESMARCAR -> SE RETIRA DE LA RUEDA DE GASTOS
      this.settings.transactions = this.settings.transactions.filter(
        t => t.id !== item.txId && t.wishlistId !== item.id
      );

      item.bought = false;
      item.boughtDate = null;
      item.txId = null;

      await this.saveSettings();
      new obsidian.Notice(`↩️ "${item.concept}" devuelto a la lista de compras pendientes`);
    }
  }

  async deleteWishlistItem(id) {
    const item = (this.settings.wishlist || []).find(w => w.id === id);
    if (item && item.bought) {
      // Also remove from transactions
      this.settings.transactions = this.settings.transactions.filter(
        t => t.id !== item.txId && t.wishlistId !== item.id
      );
    }
    this.settings.wishlist = (this.settings.wishlist || []).filter(w => w.id !== id);
    await this.saveSettings();
    new obsidian.Notice('🗑️ Artículo eliminado de la Wishlist');
  }

  // ─── CAJA DE AHORROS METHODS ─────────────────────────────────────────────
  async depositSavings({ amount, note, recordAsExpense }) {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      new obsidian.Notice('❌ Ingresa un monto válido mayor a 0');
      return false;
    }

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    this.settings.savingsBalance = (Number(this.settings.savingsBalance) || 0) + parsedAmount;

    const entry = {
      id: 'sav_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      type: 'deposit',
      amount: parsedAmount,
      note: (note || '').trim() || 'Aporte a Caja de Ahorros',
      date: todayStr,
      time: timeStr,
      timestamp: Date.now()
    };

    this.settings.savingsHistory.unshift(entry);

    // Opcional: registrar también como gasto en el cuadrante Finanzas de la Rueda
    if (recordAsExpense) {
      const catFin = CATEGORIES.find(c => c.id === 'finanzas') || CATEGORIES[7];
      const tx = {
        id: 'tx_sav_' + entry.id,
        amount: parsedAmount,
        concept: `[Ahorro] ${entry.note}`,
        categoryId: catFin.id,
        categoryName: catFin.name,
        categoryIcon: catFin.icon,
        categoryColor: catFin.color,
        date: todayStr,
        time: timeStr,
        timestamp: Date.now()
      };
      this.settings.transactions.unshift(tx);
      if (this.settings.syncWithNote && this.settings.syncNotePath) {
        await this.syncToMarkdownNote(tx, catFin);
      }
    }

    await this.saveSettings();
    new obsidian.Notice(`🏦 Ingresados ${this.settings.currency}${parsedAmount.toFixed(2)} a tu Caja de Ahorros`);
    return true;
  }

  async withdrawSavings({ amount, note }) {
    const parsedAmount = parseFloat(amount);
    const currentBal = Number(this.settings.savingsBalance) || 0;

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      new obsidian.Notice('❌ Ingresa un monto válido mayor a 0');
      return false;
    }
    if (parsedAmount > currentBal) {
      new obsidian.Notice(`❌ Fondos insuficientes en la Caja de Ahorros (Saldo: ${this.settings.currency}${currentBal.toFixed(2)})`);
      return false;
    }

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    this.settings.savingsBalance = currentBal - parsedAmount;

    const entry = {
      id: 'sav_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      type: 'withdraw',
      amount: parsedAmount,
      note: (note || '').trim() || 'Retiro de Caja de Ahorros',
      date: todayStr,
      time: timeStr,
      timestamp: Date.now()
    };

    this.settings.savingsHistory.unshift(entry);
    await this.saveSettings();

    new obsidian.Notice(`📤 Retirados ${this.settings.currency}${parsedAmount.toFixed(2)} de tu Caja de Ahorros`);
    return true;
  }

  async setSavingsGoal(goalAmount) {
    this.settings.savingsGoal = Math.max(0, parseFloat(goalAmount) || 0);
    await this.saveSettings();
    new obsidian.Notice(`🎯 Meta de Ahorro fijada en ${this.settings.currency}${this.settings.savingsGoal.toFixed(2)}`);
  }

  async deleteSavingsHistoryEntry(id) {
    this.settings.savingsHistory = (this.settings.savingsHistory || []).filter(e => e.id !== id);
    await this.saveSettings();
    new obsidian.Notice('🗑️ Registro de ahorro eliminado');
  }

  // ─── IMPORTADOR INTELIGENTE DESDE NOTAS ───────────────────────────────────
  async importWishlistFromNote() {
    const targetNote = 'GOZ-C/ZETTELGOZC/NOTAS IMPERMANENTES/38 FINANCES DAILY EXCEL.md';
    const file = this.app.vault.getAbstractFileByPath(targetNote);
    if (!file) {
      new obsidian.Notice(`⚠️ No se encontró la nota: ${targetNote}`);
      return;
    }

    try {
      const content = await this.app.vault.read(file);
      const lines = content.split('\n');

      let importedCount = 0;
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('- [ ]') && !trimmed.startsWith('- [x]')) continue;

        const raw = trimmed.replace(/^-\s*\[[ x]\]\s*/, '').trim();

        // Omitir líneas de fechas de pago o quincenas
        if (/^\d{1,2}\s+(sep|oct|nov|dec|dic|jan|ene|feb|mar|abr|may|jun|jul|ago)/i.test(raw) ||
            /^(lunes|martes|miercoles|miércoles|jueves|viernes|sabado|sábado|domingo)/i.test(raw) ||
            /^pago\s+\d/i.test(raw)) {
          continue;
        }

        let amount = 0;
        let concept = raw;
        const p1 = raw.match(/(\d+(?:\.\d+)?)\s*\$/);
        const p2 = raw.match(/\$\s*(\d+(?:\.\d+)?)/);

        if (p1) {
          amount = parseFloat(p1[1]);
          concept = raw.replace(p1[0], '').trim();
        } else if (p2) {
          amount = parseFloat(p2[1]);
          concept = raw.replace(p2[0], '').trim();
        }

        if (amount <= 0 || !concept) continue;

        // Limpiar guiones o símbolos residuales
        concept = concept.replace(/^[-–—:\s´]+|[-–—:\s´]+$/g, '').trim();

        // Detección de cuadrante inteligente
        let catId = 'desarrollo';
        const lower = concept.toLowerCase();
        if (lower.includes('prote') || lower.includes('medicina') || lower.includes('salud') ||
            lower.includes('bracket') || lower.includes('irrigador') || lower.includes('casco')) {
          catId = 'salud';
        } else if (lower.includes('mouse') || lower.includes('teclado') || lower.includes('monitor') ||
                   lower.includes('pc') || lower.includes('redmipad') || lower.includes('hdmi') ||
                   lower.includes('vga') || lower.includes('silla') || lower.includes('microfono') ||
                   lower.includes('ups') || lower.includes('cable') || lower.includes('dominio')) {
          catId = 'profesion';
        } else if (lower.includes('luz') || lower.includes('baño') || lower.includes('reloj') ||
                   lower.includes('casa') || lower.includes('pintura') || lower.includes('ventilador') ||
                   lower.includes('condominio') || lower.includes('aseo')) {
          catId = 'familia';
        } else if (lower.includes('collar') || lower.includes('gamepad') || lower.includes('juego') ||
                   lower.includes('ps5') || lower.includes('sorteo') || lower.includes('capturadora')) {
          catId = 'ocio';
        } else if (lower.includes('perfume') || lower.includes('camisa') || lower.includes('tatuaje') ||
                   lower.includes('short') || lower.includes('pasaporte') || lower.includes('licencia') ||
                   lower.includes('powerbank') || lower.includes('bateria') || lower.includes('iphone')) {
          catId = 'desarrollo';
        } else if (lower.includes('amigo') || lower.includes('trago') || lower.includes('salida')) {
          catId = 'amigos';
        } else if (lower.includes('ahorro') || lower.includes('inversion') || lower.includes('cashea')) {
          catId = 'finanzas';
        }

        const exists = (this.settings.wishlist || []).some(
          w => w.concept.toLowerCase() === concept.toLowerCase()
        );

        if (!exists) {
          const cat = CATEGORIES.find(c => c.id === catId) || CATEGORIES[0];
          const wishItem = {
            id: 'wish_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            concept: concept,
            amount: amount,
            categoryId: cat.id,
            categoryName: cat.name,
            categoryIcon: cat.icon,
            categoryColor: cat.color,
            bought: false,
            boughtDate: null,
            txId: null,
            createdAt: Date.now() - (importedCount * 1000),
            createdDate: new Date().toISOString().split('T')[0]
          };
          this.settings.wishlist.push(wishItem);
          importedCount++;
        }
      }

      await this.saveSettings();
      new obsidian.Notice(`🎉 Se importaron ${importedCount} deseos desde "38 FINANCES DAILY EXCEL"`);
    } catch (err) {
      console.error('Error al importar wishlist desde nota:', err);
      new obsidian.Notice('❌ Ocurrió un error leyendo la nota');
    }
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
    this.selectedWishCat = CATEGORIES[0].id;
    this.wishlistSort = this.plugin.settings.wishlistSort || 'desc';
    this.wishlistFilter = (this.plugin.settings.wishlistFilter && this.plugin.settings.wishlistFilter !== 'all') ? this.plugin.settings.wishlistFilter : 'pending';
    this.showSavingsHistory = false;
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

    // 2. Quick Capture Box (Gastos Diarios)
    this.renderQuickCapture(wrapper);

    // 3. Balance KPI Summary (Ahora incluye la Caja de Ahorros)
    const filteredTxs = this.getFilteredTransactions();
    this.renderKPIs(wrapper, filteredTxs);

    // 4. Bóveda / Caja de Ahorros Dedicada
    this.renderSavingsVault(wrapper);

    // 5. Wheel & Quadrants Layout
    const layout = wrapper.createDiv({ cls: 'fd-wheel-layout' });
    this.renderWheel(layout, filteredTxs);
    this.renderQuadrants(layout, filteredTxs);

    // 6. Nueva Sección: Wishlist / Compras Planificadas (Vinculada a 8 Cuadrantes con Orden y Check)
    this.renderWishlist(wrapper);

    // 7. Transaction History / Ledger
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
    subtitle.setText(t('subtitleWheel'));

    // Filter Tabs
    const actions = header.createDiv({ cls: 'fd-header-actions' });
    const tabs = actions.createDiv({ cls: 'fd-filter-tabs' });

    const filterOptions = [
      { key: 'hoy', label: t('filterToday') },
      { key: 'semana', label: t('filterWeek') },
      { key: 'mes', label: t('filterMonth') },
      { key: 'todo', label: t('filterAll') }
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

    // Totals by Category
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

    // Card 2: CAJA DE AHORROS (NUEVO KPI DESTACADO)
    const savingsBal = Number(this.plugin.settings.savingsBalance) || 0;
    const savingsGoal = Number(this.plugin.settings.savingsGoal) || 0;
    const c2 = kpiGrid.createDiv({ cls: 'fd-kpi-card fd-kpi-savings' });
    c2.createDiv({ cls: 'fd-kpi-label', text: 'Caja de Ahorros' });
    const c2Val = c2.createDiv({ cls: 'fd-kpi-value fd-savings-val', text: `${this.plugin.settings.currency} ${savingsBal.toFixed(2)}` });
    c2Val.style.color = '#10B981';
    const goalBadge = savingsGoal > 0
      ? `🎯 ${Math.round((savingsBal / savingsGoal) * 100)}% de meta (${this.plugin.settings.currency}${savingsGoal.toFixed(0)})`
      : '🏦 Fondo disponible';
    c2.createDiv({ cls: 'fd-kpi-badge', text: goalBadge });
    c2.style.cursor = 'pointer';
    c2.onclick = () => {
      const svCard = document.querySelector('.fd-savings-card');
      if (svCard) svCard.scrollIntoView({ behavior: 'smooth' });
    };

    // Card 3: Promedio por Gasto
    const avg = count > 0 ? (total / count) : 0;
    const c3 = kpiGrid.createDiv({ cls: 'fd-kpi-card' });
    c3.createDiv({ cls: 'fd-kpi-label', text: 'Ticket Promedio' });
    c3.createDiv({ cls: 'fd-kpi-value', text: `${this.plugin.settings.currency} ${avg.toFixed(2)}` });
    c3.createDiv({ cls: 'fd-kpi-badge', text: '📊 Por movimiento' });

    // Card 4: Área Dominante
    const c4 = kpiGrid.createDiv({ cls: 'fd-kpi-card' });
    c4.createDiv({ cls: 'fd-kpi-label', text: 'Mayor Inversión' });
    const topLabel = total > 0 ? `${topCat.icon} ${topCat.name}` : 'Sin gastos';
    c4.createDiv({ cls: 'fd-kpi-value', text: topLabel });
    const pct = total > 0 ? ((maxSpent / total) * 100).toFixed(1) + '%' : '0%';
    c4.createDiv({ cls: 'fd-kpi-badge', text: `Representa el ${pct} del total` });

    // Card 5: Balance de Rueda
    const activeCats = Object.values(totalsByCat).filter(v => v > 0).length;
    const balancePct = Math.round((activeCats / 8) * 100);
    const c5 = kpiGrid.createDiv({ cls: 'fd-kpi-card' });
    c5.createDiv({ cls: 'fd-kpi-label', text: 'Balance de Rueda' });
    c5.createDiv({ cls: 'fd-kpi-value', text: `${activeCats} / 8 Áreas` });
    c5.createDiv({ cls: 'fd-kpi-badge', text: `🎯 ${balancePct}% de equilibrio activo` });
  }

  // ─── CAJA DE AHORROS (SAVINGS VAULT) ──────────────────────────────────────
  renderSavingsVault(parent) {
    const card = parent.createDiv({ cls: 'fd-savings-card' });

    const topRow = card.createDiv({ cls: 'fd-savings-top' });

    // Identidad
    const identity = topRow.createDiv({ cls: 'fd-savings-identity' });
    const iconBox = identity.createDiv({ cls: 'fd-savings-icon' });
    iconBox.setText('🏦');

    const textWrap = identity.createDiv();
    const title = textWrap.createEl('h3', { cls: 'fd-savings-title', text: 'Caja de Ahorros & Bóveda de Fondos' });
    const subtitle = textWrap.createEl('p', { cls: 'fd-savings-subtitle', text: 'Reserva acumulada para liquidez, emergencias y compras mayores' });

    // Balance visual gigante
    const balanceDisplay = topRow.createDiv({ cls: 'fd-savings-balance-box' });
    balanceDisplay.createDiv({ cls: 'fd-savings-balance-label', text: 'TOTAL AHORRADO' });
    balanceDisplay.createDiv({
      cls: 'fd-savings-balance-val',
      text: `${this.plugin.settings.currency} ${(Number(this.plugin.settings.savingsBalance) || 0).toFixed(2)}`
    });

    // Barra de acciones
    const actionsRow = card.createDiv({ cls: 'fd-savings-actions' });

    const depositBtn = actionsRow.createEl('button', {
      cls: 'fd-savings-btn deposit',
      text: '➕ Ingresar Ahorro'
    });
    depositBtn.onclick = () => {
      new SavingsDepositModal(this.app, this.plugin, () => this.render()).open();
    };

    const withdrawBtn = actionsRow.createEl('button', {
      cls: 'fd-savings-btn withdraw',
      text: '📤 Retirar Ahorro'
    });
    withdrawBtn.onclick = () => {
      new SavingsWithdrawModal(this.app, this.plugin, () => this.render()).open();
    };

    const goalBtn = actionsRow.createEl('button', {
      cls: 'fd-savings-btn goal',
      text: '🎯 Meta de Ahorro'
    });
    goalBtn.onclick = () => {
      new SavingsGoalModal(this.app, this.plugin, () => this.render()).open();
    };

    const histCount = (this.plugin.settings.savingsHistory || []).length;
    const historyBtn = actionsRow.createEl('button', {
      cls: `fd-savings-btn history ${this.showSavingsHistory ? 'active' : ''}`,
      text: `📜 Movimientos (${histCount})`
    });
    historyBtn.onclick = () => {
      this.showSavingsHistory = !this.showSavingsHistory;
      this.render();
    };

    // Barra de progreso de meta si está configurada
    const currentBal = Number(this.plugin.settings.savingsBalance) || 0;
    const goal = Number(this.plugin.settings.savingsGoal) || 0;

    if (goal > 0) {
      const goalBox = card.createDiv({ cls: 'fd-savings-goal-box' });
      const goalHeader = goalBox.createDiv({ cls: 'fd-savings-goal-header' });
      const pct = Math.min(100, Math.round((currentBal / goal) * 100));

      goalHeader.createSpan({ text: `🎯 Meta Objetivo: ${this.plugin.settings.currency}${goal.toFixed(2)}` });
      goalHeader.createSpan({ cls: 'fd-goal-pct', text: `${pct}% alcanzado (${this.plugin.settings.currency}${currentBal.toFixed(2)} de ${this.plugin.settings.currency}${goal.toFixed(2)})` });

      const barBg = goalBox.createDiv({ cls: 'fd-progress-bar-bg fd-goal-bar-bg' });
      const barFill = barBg.createDiv({ cls: 'fd-progress-bar-fill fd-goal-bar-fill' });
      barFill.style.width = `${pct}%`;
    }

    // Historial desplegable
    if (this.showSavingsHistory) {
      const historyBox = card.createDiv({ cls: 'fd-savings-history-box' });
      const histList = this.plugin.settings.savingsHistory || [];

      if (histList.length === 0) {
        historyBox.createDiv({ cls: 'fd-empty-state', text: 'No hay movimientos registrados en la caja de ahorros aún.' });
      } else {
        histList.slice(0, 15).forEach(entry => {
          const item = historyBox.createDiv({ cls: 'fd-savings-hist-item' });
          const left = item.createDiv({ cls: 'fd-hist-left' });
          const isDep = entry.type === 'deposit';

          const typeBadge = left.createSpan({
            cls: `fd-hist-type ${isDep ? 'dep' : 'with'}`,
            text: isDep ? '📥 Depósito' : '📤 Retiro'
          });
          const noteEl = left.createSpan({ cls: 'fd-hist-note', text: entry.note || (isDep ? 'Aporte' : 'Retiro') });
          left.createSpan({ cls: 'fd-hist-date', text: `${entry.date || ''} • ${entry.time || ''}` });

          const right = item.createDiv({ cls: 'fd-hist-right' });
          right.createSpan({
            cls: `fd-hist-amount ${isDep ? 'dep' : 'with'}`,
            text: `${isDep ? '+' : '-'}${this.plugin.settings.currency}${Number(entry.amount).toFixed(2)}`
          });

          const del = right.createEl('button', {
            cls: 'fd-delete-btn',
            attr: { title: 'Eliminar este movimiento' }
          });
          del.setText('×');
          del.onclick = async () => {
            if (confirm('¿Eliminar este registro del historial?')) {
              await this.plugin.deleteSavingsHistoryEntry(entry.id);
              this.render();
            }
          };
        });
      }
    }
  }

  // ─── QUICK CAPTURE GASTOS ────────────────────────────────────────────────
  renderQuickCapture(parent) {
    const box = parent.createDiv({ cls: 'fd-capture-box' });

    const title = box.createDiv({ cls: 'fd-capture-title' });
    title.setText('⚡ Registro Rápido de Gasto');

    // Category Selector
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

  // ─── SVG WHEEL ───────────────────────────────────────────────────────────
  renderWheel(parent, txs) {
    const card = parent.createDiv({ cls: 'fd-wheel-card' });

    const totals = {};
    CATEGORIES.forEach(c => totals[c.id] = 0);
    txs.forEach(t => {
      totals[t.categoryId] = (totals[t.categoryId] || 0) + Number(t.amount);
    });

    const grandTotal = txs.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const maxVal = Math.max(...Object.values(totals), 1);

    const size = 380;
    const cx = size / 2;
    const cy = size / 2;
    const rInner = 60;
    const rBaseOuter = 120;
    const maxExtra = 35;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
    svg.setAttribute('class', 'fd-svg-wheel');

    const sliceAngle = 45;
    const gap = 2.5;

    CATEGORIES.forEach((c, idx) => {
      const startDeg = -90 + (idx * sliceAngle) + (gap / 2);
      const endDeg = -90 + ((idx + 1) * sliceAngle) - (gap / 2);

      const catSpent = totals[c.id] || 0;
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

      path.onclick = () => {
        this.selectedCatFilter = this.selectedCatFilter === c.id ? null : c.id;
        this.render();
      };

      const catPct = grandTotal > 0 ? ((catSpent / grandTotal) * 100).toFixed(1) : '0';
      const titleEl = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      titleEl.textContent = `${c.icon} ${c.name}: ${this.plugin.settings.currency}${catSpent.toFixed(2)} (${catPct}%)`;
      path.appendChild(titleEl);

      svg.appendChild(path);

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

  // ─── QUADRANTS ───────────────────────────────────────────────────────────
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

      const pBg = card.createDiv({ cls: 'fd-progress-bar-bg' });
      const pFill = pBg.createDiv({ cls: 'fd-progress-bar-fill' });
      pFill.style.background = c.color;
      pFill.style.width = `${Math.min(100, Math.max(0, pct))}%`;

      const footer = card.createDiv({ cls: 'fd-quad-footer' });
      footer.createSpan({ text: `${count} gasto(s)` });
      footer.createSpan({ text: `${pct}% del total` });
    });
  }

  // ─── NUEVA SECCIÓN: WISHLIST & COMPRAS PLANIFICADAS (8 CUADRANTES) ────────
  renderWishlist(parent) {
    const box = parent.createDiv({ cls: 'fd-wishlist-box' });

    // 1. Header
    const header = box.createDiv({ cls: 'fd-wishlist-header' });
    const titleGroup = header.createDiv({ cls: 'fd-wishlist-title-group' });
    const title = titleGroup.createEl('h3', { cls: 'fd-wishlist-title' });
    title.setText('🎯 Compras Planificadas & Wishlist (8 Cuadrantes)');
    const subtitle = titleGroup.createEl('p', { cls: 'fd-wishlist-subtitle' });
    subtitle.setText('Lista de deseos vinculada a tus 8 áreas. Al marcar un artículo como comprado, suma de inmediato a la Rueda de Gastos.');

    // Stats Bar
    const wishlist = this.plugin.settings.wishlist || [];
    const pendingItems = wishlist.filter(w => !w.bought);
    const boughtItems = wishlist.filter(w => w.bought);
    const pendingTotal = pendingItems.reduce((acc, w) => acc + (Number(w.amount) || 0), 0);
    const boughtTotal = boughtItems.reduce((acc, w) => acc + (Number(w.amount) || 0), 0);

    const statsRow = header.createDiv({ cls: 'fd-wishlist-stats' });
    const pBadge = statsRow.createDiv({ cls: 'fd-wish-stat-pill pending' });
    pBadge.createSpan({ text: '⏳ Por Comprar: ' });
    pBadge.createEl('strong', { text: `${this.plugin.settings.currency}${pendingTotal.toFixed(2)} (${pendingItems.length})` });

    const bBadge = statsRow.createDiv({ cls: 'fd-wish-stat-pill bought' });
    bBadge.createSpan({ text: '✅ En Rueda: ' });
    bBadge.createEl('strong', { text: `${this.plugin.settings.currency}${boughtTotal.toFixed(2)} (${boughtItems.length})` });

    // 2. Formulario Rápido de Wishlist
    const formBox = box.createDiv({ cls: 'fd-wishlist-form-box' });
    formBox.createDiv({ cls: 'fd-form-label', text: '✨ Agregar nuevo deseo o compra planeada:' });

    // Category Selector
    const catSelector = formBox.createDiv({ cls: 'fd-category-selector' });
    CATEGORIES.forEach(c => {
      const isSelected = this.selectedWishCat === c.id;
      const pill = catSelector.createEl('button', {
        cls: `fd-cat-pill ${isSelected ? 'selected' : ''}`,
        attr: { type: 'button' }
      });
      pill.style.borderColor = isSelected ? c.color : 'var(--background-modifier-border)';
      pill.style.background = isSelected ? c.color : 'var(--background-primary)';
      pill.createSpan({ text: c.icon });
      pill.createSpan({ text: c.name });

      pill.onclick = () => {
        this.selectedWishCat = c.id;
        const pills = catSelector.querySelectorAll('.fd-cat-pill');
        pills.forEach((p, idx) => {
          const catObj = CATEGORIES[idx];
          if (catObj.id === c.id) {
            p.addClass('selected');
            p.style.background = catObj.color;
            p.style.borderColor = catObj.color;
          } else {
            p.removeClass('selected');
            p.style.background = 'var(--background-primary)';
            p.style.borderColor = 'var(--background-modifier-border)';
          }
        });
      };
    });

    // Inputs Row
    const inputsRow = formBox.createDiv({ cls: 'fd-wishlist-inputs' });
    const amountInput = inputsRow.createEl('input', {
      cls: 'fd-input fd-amount-input',
      attr: {
        type: 'number',
        step: '0.01',
        min: '0.01',
        placeholder: `Precio (${this.plugin.settings.currency})`
      }
    });

    const conceptInput = inputsRow.createEl('input', {
      cls: 'fd-input',
      attr: {
        type: 'text',
        placeholder: '¿Qué te quieres comprar? (ej: Zapatos Cashea, Micrófono, Tatuaje...)'
      }
    });

    const addBtn = inputsRow.createEl('button', {
      cls: 'fd-submit-btn fd-wish-add-btn',
      text: '+ Agregar a Deseos'
    });

    const handleAddWish = async () => {
      const amt = amountInput.value;
      const conc = conceptInput.value;
      const res = await this.plugin.addWishlistItem({
        amount: amt,
        concept: conc,
        categoryId: this.selectedWishCat
      });
      if (res) {
        amountInput.value = '';
        conceptInput.value = '';
        this.render();
      }
    };

    addBtn.onclick = handleAddWish;
    conceptInput.onkeydown = (e) => { if (e.key === 'Enter') handleAddWish(); };
    amountInput.onkeydown = (e) => { if (e.key === 'Enter') conceptInput.focus(); };

    // 3. Toolbar: Ordenamiento & Filtros
    const toolbar = box.createDiv({ cls: 'fd-wishlist-toolbar' });

    // Ordenamiento
    const sortGroup = toolbar.createDiv({ cls: 'fd-toolbar-group' });
    sortGroup.createSpan({ cls: 'fd-toolbar-label', text: 'Ordenar por:' });

    const currentSort = this.wishlistSort || this.plugin.settings.wishlistSort || 'desc';
    const sortOptions = [
      { key: 'desc', label: '🔽 Más Caro a Más Barato' },
      { key: 'asc', label: '🔼 Más Barato a Más Caro' },
      { key: 'recent', label: '🕒 Más Reciente' },
      { key: 'category', label: '🏷️ Por Cuadrante' }
    ];

    sortOptions.forEach(opt => {
      const isAct = currentSort === opt.key;
      const sBtn = sortGroup.createEl('button', {
        cls: `fd-sort-btn ${isAct ? 'active' : ''}`,
        text: opt.label
      });
      sBtn.onclick = async () => {
        this.wishlistSort = opt.key;
        this.plugin.settings.wishlistSort = opt.key;
        await this.plugin.saveSettings();
        this.render();
      };
    });

    // Filtros de Estado
    const filterGroup = toolbar.createDiv({ cls: 'fd-toolbar-group' });
    filterGroup.createSpan({ cls: 'fd-toolbar-label', text: 'Ver:' });

    let currentF = this.wishlistFilter || this.plugin.settings.wishlistFilter || 'pending';
    if (currentF === 'all') currentF = 'pending';

    const filterTabs = [
      { key: 'pending', label: `⏳ Por Comprar (${pendingItems.length})` },
      { key: 'bought', label: `✅ Comprados (${boughtItems.length})` }
    ];

    filterTabs.forEach(f => {
      const isAct = currentF === f.key;
      const fBtn = filterGroup.createEl('button', {
        cls: `fd-filter-chip ${isAct ? 'active' : ''}`,
        text: f.label
      });
      fBtn.onclick = async () => {
        this.wishlistFilter = f.key;
        this.plugin.settings.wishlistFilter = f.key;
        await this.plugin.saveSettings();
        this.render();
      };
    });



    // 4. Lista de Items
    const itemsContainer = box.createDiv({ cls: 'fd-wishlist-items' });
    this.renderWishlistItems(itemsContainer);
  }

  renderWishlistItems(container) {
    container.empty();

    let list = [...(this.plugin.settings.wishlist || [])];

    // Aplicar Filtro de Estado (por defecto siempre 'pending' para compras pendientes)
    let f = this.wishlistFilter || this.plugin.settings.wishlistFilter || 'pending';
    if (f === 'all') f = 'pending';

    if (f === 'pending') {
      list = list.filter(w => !w.bought);
    } else if (f === 'bought') {
      list = list.filter(w => w.bought);
    }

    // Aplicar Ordenamiento
    const sortMode = this.wishlistSort || this.plugin.settings.wishlistSort || 'desc';
    if (sortMode === 'desc') {
      list.sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0));
    } else if (sortMode === 'asc') {
      list.sort((a, b) => (Number(a.amount) || 0) - (Number(b.amount) || 0));
    } else if (sortMode === 'recent') {
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    } else if (sortMode === 'category') {
      list.sort((a, b) => (a.categoryName || '').localeCompare(b.categoryName || ''));
    }

    if (list.length === 0) {
      const empty = container.createDiv({ cls: 'fd-empty-state' });
      if (f === 'pending') {
        empty.setText('🎉 ¡No tienes compras pendientes en tu lista de deseos! Agrega una arriba.');
      } else {
        empty.setText('Aún no has pasado compras a la cola de gastos general desde tu lista de deseos.');
      }
      return;
    }

    list.forEach(item => {
      const cat = CATEGORIES.find(c => c.id === item.categoryId) || CATEGORIES[0];
      const isBought = !!item.bought;

      const row = container.createDiv({
        cls: `fd-wish-item ${isBought ? 'bought' : 'pending'}`
      });

      // Lado Izquierdo
      const left = row.createDiv({ cls: 'fd-wish-left' });

      if (!isBought) {
        // En "Por Comprar": Checkbox para comprar -> pasa inmediatamente a la cola de gastos general
        const chkWrap = left.createDiv({ cls: 'fd-chk-wrapper' });
        const chk = chkWrap.createEl('input', {
          cls: 'fd-wish-checkbox',
          attr: {
            type: 'checkbox',
            title: 'Marcar como comprado: pasa inmediatamente a la cola de gastos general'
          }
        });
        chk.checked = false;

        chk.onchange = async () => {
          await this.plugin.toggleWishlistItem(item.id);
          this.render(); // El item sale de esta lista, pasa a la cola de gastos y suma al acumulado
        };
      } else {
        // En "Comprados": Icono de comprobación
        const iconWrap = left.createDiv({ cls: 'fd-chk-wrapper' });
        iconWrap.createSpan({ text: '✅', attr: { style: 'font-size: 14px; user-select: none;' } });
      }

      // Badge de Cuadrante
      const badge = left.createDiv({ cls: 'fd-wish-cat-badge' });
      badge.style.background = cat.color + '22';
      badge.style.color = cat.color;
      badge.style.border = `1px solid ${cat.color}55`;
      badge.setText(`${cat.icon} ${cat.name}`);

      // Concepto y Meta
      const textWrap = left.createDiv({ cls: 'fd-wish-text-wrap' });
      const conceptEl = textWrap.createDiv({
        cls: `fd-wish-concept ${isBought ? 'concept-bought' : ''}`,
        text: item.concept
      });

      const metaEl = textWrap.createDiv({ cls: 'fd-wish-meta' });
      if (isBought) {
        metaEl.createSpan({ cls: 'fd-status-badge in-wheel', text: `✓ Comprado el ${item.boughtDate || 'Recientemente'} (En Cola de Gastos)` });
      } else {
        metaEl.createSpan({ cls: 'fd-status-badge pending', text: '⏳ Por Comprar / Deseo Activo' });
      }

      // Lado Derecho: Precio, Devolver (si está comprado) y Eliminar
      const right = row.createDiv({ cls: 'fd-wish-right' });
      const amtEl = right.createDiv({
        cls: `fd-wish-amount ${isBought ? 'amt-bought' : ''}`,
        text: `${this.plugin.settings.currency}${Number(item.amount).toFixed(2)}`
      });

      if (isBought) {
        const restoreBtn = right.createEl('button', {
          cls: 'fd-restore-btn',
          attr: { title: 'Desmarcar y devolver a la lista de compras pendientes' }
        });
        restoreBtn.setText('↩️ Devolver');
        restoreBtn.onclick = async () => {
          await this.plugin.toggleWishlistItem(item.id);
          this.render();
        };
      }

      const delBtn = right.createEl('button', {
        cls: 'fd-delete-btn',
        attr: { title: 'Eliminar este artículo' }
      });
      delBtn.setText('🗑️');
      delBtn.onclick = async () => {
        if (confirm(`¿Eliminar "${item.concept}" de tu lista de deseos?`)) {
          await this.plugin.deleteWishlistItem(item.id);
          this.render();
        }
      };
    });
  }

  // ─── LEDGER (HISTORIAL DE GASTOS) ────────────────────────────────────────
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
      const conceptText = textWrap.createDiv({ cls: 'fd-item-concept' });
      conceptText.setText(item.concept);

      const isWish = item.isFromWishlist;
      const dateText = textWrap.createDiv({ cls: 'fd-item-date' });
      dateText.setText(`${item.date} • ${item.time}${isWish ? ' (🎯 Desde Wishlist)' : ''}`);

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

// ─── MODALES ───────────────────────────────────────────────────────────────

// 1. Quick Expense Modal
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

// 2. Quick Wishlist Modal
class QuickWishlistModal extends obsidian.Modal {
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
    title.setText('🎯 Agregar Deseo a la Wishlist (8 Cuadrantes)');

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

    const amountInput = contentEl.createEl('input', {
      cls: 'fd-input fd-amount-input',
      attr: {
        type: 'number',
        step: '0.01',
        min: '0.01',
        placeholder: `Precio Estimado (${this.plugin.settings.currency})`,
        style: 'width: 100%; margin-top: 8px;'
      }
    });

    const conceptInput = contentEl.createEl('input', {
      cls: 'fd-input',
      attr: {
        type: 'text',
        placeholder: '¿Qué te quieres comprar? (ej: Zapatos Cashea, Monitor...)',
        style: 'width: 100%; margin-top: 8px;'
      }
    });

    const submitBtn = contentEl.createEl('button', {
      cls: 'fd-submit-btn',
      text: 'Guardar en Wishlist',
      attr: { style: 'width: 100%; margin-top: 12px; padding: 12px;' }
    });

    const doSubmit = async () => {
      const res = await this.plugin.addWishlistItem({
        amount: amountInput.value,
        concept: conceptInput.value,
        categoryId: this.selectedCat
      });
      if (res) {
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

// 3. Savings Deposit Modal
class SavingsDepositModal extends obsidian.Modal {
  constructor(app, plugin, onDone) {
    super(app);
    this.plugin = plugin;
    this.onDone = onDone;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('fd-modal');

    contentEl.createEl('h3', { text: '🏦 Ingresar Ahorro a la Bóveda', cls: 'fd-modal-header' });

    const currentBal = Number(this.plugin.settings.savingsBalance) || 0;
    contentEl.createDiv({
      text: `Saldo actual ahorrado: ${this.plugin.settings.currency}${currentBal.toFixed(2)}`,
      attr: { style: 'font-size: 13px; color: #10B981; font-weight: 600;' }
    });

    const amountInput = contentEl.createEl('input', {
      cls: 'fd-input fd-amount-input',
      attr: {
        type: 'number',
        step: '0.01',
        min: '0.01',
        placeholder: `Monto a ingresar (${this.plugin.settings.currency})`,
        style: 'width: 100%; margin-top: 10px;'
      }
    });

    const noteInput = contentEl.createEl('input', {
      cls: 'fd-input',
      attr: {
        type: 'text',
        placeholder: 'Concepto o procedencia (ej: Sobrante quincena, Venta, Aporte)',
        style: 'width: 100%; margin-top: 10px;'
      }
    });

    const toggleRow = contentEl.createDiv({
      attr: { style: 'display: flex; align-items: center; gap: 8px; margin-top: 12px;' }
    });
    const check = toggleRow.createEl('input', {
      attr: { type: 'checkbox', id: 'fd-sav-as-expense' }
    });
    toggleRow.createEl('label', {
      text: 'Registrar también como gasto en el cuadrante Finanzas de la Rueda',
      attr: { for: 'fd-sav-as-expense', style: 'font-size: 12px; color: var(--text-muted); cursor: pointer;' }
    });

    const submitBtn = contentEl.createEl('button', {
      cls: 'fd-submit-btn',
      text: 'Confirmar Ingreso',
      attr: { style: 'width: 100%; margin-top: 16px; padding: 12px;' }
    });

    const handleSubmit = async () => {
      const ok = await this.plugin.depositSavings({
        amount: amountInput.value,
        note: noteInput.value,
        recordAsExpense: check.checked
      });
      if (ok) {
        this.close();
        if (this.onDone) this.onDone();
      }
    };

    submitBtn.onclick = handleSubmit;
    amountInput.onkeydown = (e) => { if (e.key === 'Enter') noteInput.focus(); };
    noteInput.onkeydown = (e) => { if (e.key === 'Enter') handleSubmit(); };
    setTimeout(() => amountInput.focus(), 50);
  }

  onClose() {
    this.contentEl.empty();
  }
}

// 4. Savings Withdraw Modal
class SavingsWithdrawModal extends obsidian.Modal {
  constructor(app, plugin, onDone) {
    super(app);
    this.plugin = plugin;
    this.onDone = onDone;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('fd-modal');

    contentEl.createEl('h3', { text: '📤 Retirar de la Caja de Ahorros', cls: 'fd-modal-header' });

    const currentBal = Number(this.plugin.settings.savingsBalance) || 0;
    contentEl.createDiv({
      text: `Saldo disponible para retiro: ${this.plugin.settings.currency}${currentBal.toFixed(2)}`,
      attr: { style: 'font-size: 13px; color: var(--text-muted);' }
    });

    const amountInput = contentEl.createEl('input', {
      cls: 'fd-input fd-amount-input',
      attr: {
        type: 'number',
        step: '0.01',
        min: '0.01',
        max: String(currentBal),
        placeholder: `Monto a retirar (${this.plugin.settings.currency})`,
        style: 'width: 100%; margin-top: 10px;'
      }
    });

    const noteInput = contentEl.createEl('input', {
      cls: 'fd-input',
      attr: {
        type: 'text',
        placeholder: 'Motivo del retiro (ej: Compra urgente, etc.)',
        style: 'width: 100%; margin-top: 10px;'
      }
    });

    const submitBtn = contentEl.createEl('button', {
      cls: 'fd-submit-btn fd-withdraw-btn',
      text: 'Confirmar Retiro',
      attr: { style: 'width: 100%; margin-top: 16px; padding: 12px; background: linear-gradient(135deg, #EF4444, #DC2626);' }
    });

    const handleSubmit = async () => {
      const ok = await this.plugin.withdrawSavings({
        amount: amountInput.value,
        note: noteInput.value
      });
      if (ok) {
        this.close();
        if (this.onDone) this.onDone();
      }
    };

    submitBtn.onclick = handleSubmit;
    amountInput.onkeydown = (e) => { if (e.key === 'Enter') noteInput.focus(); };
    noteInput.onkeydown = (e) => { if (e.key === 'Enter') handleSubmit(); };
    setTimeout(() => amountInput.focus(), 50);
  }

  onClose() {
    this.contentEl.empty();
  }
}

// 5. Savings Goal Modal
class SavingsGoalModal extends obsidian.Modal {
  constructor(app, plugin, onDone) {
    super(app);
    this.plugin = plugin;
    this.onDone = onDone;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('fd-modal');

    contentEl.createEl('h3', { text: '🎯 Meta de la Caja de Ahorros', cls: 'fd-modal-header' });

    contentEl.createDiv({
      text: 'Define cuánto deseas acumular como fondo de reserva o meta personal.',
      attr: { style: 'font-size: 13px; color: var(--text-muted); margin-bottom: 8px;' }
    });

    const goalInput = contentEl.createEl('input', {
      cls: 'fd-input fd-amount-input',
      attr: {
        type: 'number',
        step: '1',
        min: '0',
        placeholder: `Meta de Ahorro (${this.plugin.settings.currency})`,
        value: this.plugin.settings.savingsGoal > 0 ? this.plugin.settings.savingsGoal : '',
        style: 'width: 100%;'
      }
    });

    const submitBtn = contentEl.createEl('button', {
      cls: 'fd-submit-btn',
      text: 'Guardar Meta',
      attr: { style: 'width: 100%; margin-top: 16px; padding: 12px;' }
    });

    const handleSubmit = async () => {
      await this.plugin.setSavingsGoal(goalInput.value);
      this.close();
      if (this.onDone) this.onDone();
    };

    submitBtn.onclick = handleSubmit;
    goalInput.onkeydown = (e) => { if (e.key === 'Enter') handleSubmit(); };
    setTimeout(() => goalInput.focus(), 50);
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
      .setName('Meta de la Caja de Ahorros')
      .setDesc('Fondo objetivo que deseas acumular en tu caja de ahorros.')
      .addText(text => text
        .setPlaceholder('500')
        .setValue(String(this.plugin.settings.savingsGoal || ''))
        .onChange(async (val) => {
          this.plugin.settings.savingsGoal = Math.max(0, parseFloat(val) || 0);
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
    containerEl.createEl('h3', { text: 'Gestión y Exportación de Datos' });

    new obsidian.Setting(containerEl)
      .setName('Exportar Datos Completos a CSV')
      .setDesc('Descarga gastos, deseos y movimientos de caja de ahorro en un archivo CSV.')
      .addButton(btn => btn
        .setButtonText('Exportar CSV')
        .onClick(() => {
          const txs = this.plugin.settings.transactions || [];
          const wishes = this.plugin.settings.wishlist || [];
          const headers = ['Tipo', 'ID', 'Fecha', 'Hora', 'Categoria', 'Concepto', 'Monto', 'Estado'];
          const rows = [
            ...txs.map(t => ['GASTO', t.id, t.date, t.time, t.categoryName, `"${t.concept}"`, t.amount, 'PAGADO']),
            ...wishes.map(w => ['DESEO', w.id, w.createdDate, '', w.categoryName, `"${w.concept}"`, w.amount, w.bought ? 'COMPRADO_EN_RUEDA' : 'PENDIENTE'])
          ];
          const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `finances_daily_full_${new Date().toISOString().split('T')[0]}.csv`;
          a.click();
          URL.revokeObjectURL(url);
          new obsidian.Notice('✅ Archivo CSV exportado');
        }));

    new obsidian.Setting(containerEl)
      .setName('Reiniciar Historial de Gastos')
      .setDesc('⚠️ Borra únicamente los gastos registrados en la Rueda.')
      .addButton(btn => btn
        .setButtonText('Borrar Gastos')
        .setWarning()
        .onClick(async () => {
          if (confirm('¿Estás seguro de que deseas eliminar TODOS los gastos registrados en la Rueda? Esta acción no se puede deshacer.')) {
            this.plugin.settings.transactions = [];
            // Uncheck any wishlist items
            (this.plugin.settings.wishlist || []).forEach(w => {
              w.bought = false;
              w.boughtDate = null;
              w.txId = null;
            });
            await this.plugin.saveSettings();
            new obsidian.Notice('Historial reiniciado correctamente');
          }
        }));
  }
}

module.exports = FinancesDailyPlugin;
module.exports.default = FinancesDailyPlugin;
