/* ══════════════════════════════════════════════════════════════════════════
   FINANCES DAILY - RUEDA DE GASTOS & CAJA DE AHORROS
   Obsidian Extension by Nelxson2099
   ══════════════════════════════════════════════════════════════════════════ */

'use strict';

const obsidian = require('obsidian');

const VIEW_TYPE_FINANCES_DAILY = 'finances-daily-wheel-view';

// ─── i18n LOCALIZATION ENGINE (EN / ES) ────────────────────────────────────
const USER_LOCALE = (typeof window !== 'undefined' && (
  (window.moment && typeof window.moment.locale === 'function' && window.moment.locale()) ||
  (navigator && navigator.language) ||
  'en'
)).toLowerCase();
const IS_ES = USER_LOCALE.startsWith('es');

const I18N = {
  en: {
    pluginTitle: 'Finances Daily - 8-Dimension Expense Wheel & Savings Vault',
    ribbonTooltip: 'Finances Daily - Expense Wheel',
    viewTitle: 'Finances Daily - Expense Wheel',
    cmdOpenWheel: 'Open Expense Wheel & Finances',
    cmdQuickExpense: 'Quick Add Expense',
    cmdQuickWishlist: 'Add Planned Purchase to Wishlist (8 Quadrants)',
    cmdManageSavings: 'Manage Savings Vault',
    logLoaded: 'Finances Daily loaded successfully',
    logUnloaded: 'Finances Daily unloaded',
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
    totalSpentLabel: 'Total Spent',
    txCountSuffix: 'transaction(s)',
    savingsVaultKpiLabel: 'Savings Vault',
    savingsGoalProgress: '{pct}% of goal ({cur}{goal})',
    savingsAvailableBadge: 'Available reserve',
    topInvestmentLabel: 'Top Investment',
    noExpensesLabel: 'No expenses',
    topInvestmentPct: 'Accounts for {pct} of total',
    currentIncomeLabel: 'Current Income',
    monthlyFixedLabel: 'Monthly Fixed Expenses',
    editIncomeTitle: 'Edit current income',
    editFixedTitle: 'Edit monthly fixed expenses',
    clickToSetIncome: 'Click to set income',
    clickToSetFixed: 'Click to set or break down fixed costs',
    freeAfterFixed: 'Free after fixed',
    exactBalance: 'Break-even after fixed',
    deficitAfterFixed: 'Deficit vs fixed',
    netMonthAfterAll: 'Month net (after expenses): {val}',
    pctOfIncome: 'of your income',
    setIncomeForPct: 'Set income to see %',
    fixedBreakdownBtn: 'Breakdown',
    fixedBreakdownCount: 'Breakdown ({count})',
    fixedDrawerTitle: 'Monthly Fixed Expenses Breakdown',
    fixedDrawerSubtitle: 'Add recurring bills or subscriptions; their sum updates your KPI automatically.',
    fixedDrawerTotalLabel: 'Monthly total:',
    fixedConceptPlaceholder: 'Fixed expense (e.g., Rent, Internet, Gym, Electricity...)',
    fixedAmountPlaceholder: 'Amount ({cur})',
    fixedAddBtn: '+ Add Fixed',
    fixedEmptyHint: 'No itemized fixed expenses yet. Add your recurring bills above to auto-calculate the total.',
    fixedAutoLinkedHint: 'Managed by {count} itemized entry(ies)',
    closeLabel: 'Close',
    savingsCardTitle: 'Savings Vault & Reserve Fund',
    savingsCardSubtitle: 'Accumulated reserve for liquidity, emergencies, and major purchases',
    savingsTotalLabel: 'TOTAL SAVED',
    depositBtn: 'Deposit Savings',
    withdrawBtn: 'Withdraw Savings',
    goalBtn: 'Savings Goal',
    movementsBtn: 'Movements ({count})',
    goalTargetLabel: 'Target Goal: {cur}{goal}',
    goalAchievedLabel: '{pct}% achieved ({cur}{bal} of {cur}{goal})',
    savingsHistoryEmpty: 'No movements recorded in the savings vault yet.',
    depositBadge: 'Deposit',
    withdrawBadge: 'Withdrawal',
    defaultDepositNote: 'Savings deposit',
    defaultWithdrawNote: 'Savings withdrawal',
    deleteMovementTitle: 'Delete this movement',
    confirmDeleteSavingsTitle: 'Delete savings movement?',
    confirmDeleteSavingsBody: 'Delete "{note}" ({cur}{amount}) from history? Your Savings Vault balance will be adjusted automatically.',
    tabQuickExpense: 'Quick Expense',
    tabPlannedPurchase: 'Planned Purchase',
    pillModeFullTitle: 'Show quadrants with name and emoji (e.g., Health)',
    pillModeEmojiTitle: 'Show emojis only (compact mode)',
    amountPlaceholder: 'Amount ({cur})',
    pricePlaceholder: 'Price ({cur})',
    expenseConceptPlaceholder: 'What did you spend on? (e.g., Coffee, Python book, Dinner...)',
    wishConceptPlaceholder: 'What do you want to buy? (e.g., Sneakers, Microphone, Monitor...)',
    registerExpenseBtn: 'Record Expense',
    addWishBtn: '+ Add to Wishlist',
    wheelFilteredLabel: 'FILTERED',
    wheelTotalLabel: 'TOTAL',
    quadSpentCount: '{count} expense(s)',
    quadPctOfTotal: '{pct}% of total',
    wishlistHeaderTitle: 'Planned Purchases & Wishlist (8 Quadrants)',
    wishlistHeaderSubtitle: 'Wish list linked to your 8 life areas. Checking off an item moves it straight into the Expense Wheel.',
    wishPendingStat: 'To Buy:',
    wishInWheelStat: 'In Wheel:',
    sortByLabel: 'Sort by:',
    sortDesc: 'Highest Price',
    sortAsc: 'Lowest Price',
    sortRecent: 'Most Recent',
    sortCategory: 'By Quadrant',
    wishlistSearchPlaceholder: 'Search wish or purchase...',
    clearSearchTitle: 'Clear search',
    viewFilterLabel: 'View:',
    viewPendingTab: 'To Buy ({count})',
    viewBoughtTab: 'Purchased ({count})',
    wishEmptySearch: 'No planned purchases matching "{query}".',
    wishEmptyPending: 'No pending purchases in your wishlist! Add one above.',
    wishEmptyBought: 'You have not moved any planned purchases into the wheel yet.',
    chkBuyTitle: 'Mark as purchased: moves straight to the Expense Wheel',
    wishStatusBought: 'Purchased on {date} (In Expense Wheel)',
    wishStatusBoughtSavings: 'Purchased on {date} (Via Savings)',
    wishStatusPending: 'To Buy / Planned',
    affordMarginBadge: 'Fits free margin',
    affordSavingsBadge: 'Fits Savings',
    useSavingsBtn: 'Use Savings',
    useSavingsTitle: 'Buy using your Savings Vault balance and record it in the Wheel',
    confirmUseSavingsTitle: 'Buy with Savings Vault?',
    confirmUseSavingsBody: 'Buy "{concept}" for {cur}{amount} using your Savings Vault? It will be deducted from savings and added to the Expense Wheel.',
    returnWishBtn: 'Return',
    returnWishTitle: 'Unmark and return to pending purchases',
    editItemTitle: 'Edit item',
    deleteWishTitle: 'Delete this item',
    confirmDeleteWishTitle: 'Delete planned purchase?',
    confirmDeleteWishBody: 'Delete "{concept}" ({cur}{amount}) from your wishlist?',
    ledgerTitleDefault: 'Expense History',
    ledgerTitleFiltered: 'Movements: {icon} {name}',
    ledgerSearchPlaceholder: 'Search expense or concept...',
    ledgerEmpty: 'No expenses recorded for this filter. Add one above!',
    ledgerFromWishlist: 'From Wishlist',
    ledgerPaidSavings: 'Paid with Savings',
    deleteExpenseTitle: 'Delete this expense',
    confirmDeleteExpenseTitle: 'Delete expense?',
    confirmDeleteExpenseBody: 'Delete "{concept}" for {cur}{amount}? This cannot be undone.',
    confirmDeleteFixedTitle: 'Delete fixed expense?',
    confirmDeleteFixedBody: 'Remove "{concept}" ({cur}{amount}) from your monthly fixed expenses breakdown?',
    modalQuickExpenseTitle: 'Record Expense - Finances Daily',
    modalQuickExpenseConcept: 'Concept (e.g., Lunch, Uber, Course)',
    modalQuickExpenseSubmit: 'Save to Expense Wheel',
    modalQuickWishTitle: 'Add Planned Purchase (8 Quadrants)',
    modalQuickWishPrice: 'Estimated Price ({cur})',
    modalQuickWishConcept: 'What do you want to buy? (e.g., Monitor, Sneakers...)',
    modalQuickWishSubmit: 'Save to Wishlist',
    modalDepositTitle: 'Deposit to Savings Vault',
    modalDepositBalance: 'Current saved balance: {cur}{bal}',
    modalDepositAmount: 'Amount to deposit ({cur})',
    modalDepositNote: 'Concept or source (e.g., Salary surplus, Sale, Contribution)',
    modalDepositAsExpense: 'Also record as an expense in the Finances quadrant',
    modalDepositSubmit: 'Confirm Deposit',
    modalWithdrawTitle: 'Withdraw from Savings Vault',
    modalWithdrawBalance: 'Available to withdraw: {cur}{bal}',
    modalWithdrawAmount: 'Amount to withdraw ({cur})',
    modalWithdrawNote: 'Withdrawal reason (e.g., Urgent purchase, etc.)',
    modalWithdrawSubmit: 'Confirm Withdrawal',
    modalGoalTitle: 'Savings Vault Goal',
    modalGoalDesc: 'Define how much you want to accumulate as your reserve fund or personal goal.',
    modalGoalPlaceholder: 'Savings Goal ({cur})',
    modalGoalSubmit: 'Save Goal',
    modalEditExpenseTitle: 'Edit Expense',
    modalEditWishTitle: 'Edit Planned Purchase',
    modalEditFixedTitle: 'Edit Fixed Expense',
    modalEditConceptPlaceholder: 'Concept or title',
    saveBtn: 'Save',
    saveChangesBtn: 'Save Changes',
    cancelBtn: 'Cancel',
    confirmBtn: 'Confirm',
    deleteBtn: 'Delete',
    settingsTitle: 'Finances Daily Settings',
    settingsCurrencyName: 'Currency Symbol',
    settingsCurrencyDesc: 'Currency symbol to display (e.g., $, €, Bs, USDT, MXN).',
    settingsGoalName: 'Savings Vault Goal',
    settingsGoalDesc: 'Target reserve fund you want to accumulate in your savings vault.',
    settingsIncomeName: 'Current Income',
    settingsIncomeDesc: 'Current income used to calculate free margin against monthly fixed expenses.',
    settingsFixedName: 'Monthly Fixed Expenses',
    settingsFixedDesc: 'Recurring monthly fixed obligations linked to your current income.',
    settingsSyncName: 'Auto-sync with Markdown Note',
    settingsSyncDesc: 'When enabled, each recorded expense is appended to your journal note under the matching life area.',
    settingsSyncPathName: 'Sync Note Path',
    settingsSyncPathDesc: 'Filename or vault path (default: DIARIO DE RUEDA.md).',
    settingsDataHeader: 'Data Management & Export',
    settingsExportName: 'Export Full Data to CSV',
    settingsExportDesc: 'Download expenses, wishlist items, and savings vault movements as a CSV file.',
    settingsExportBtn: 'Export CSV',
    settingsResetName: 'Reset Expense History',
    settingsResetDesc: 'Removes all recorded expenses from the Wheel (unchecks purchased wishlist items).',
    settingsResetBtn: 'Clear Expenses',
    confirmResetTitle: 'Reset all expenses?',
    confirmResetBody: 'Are you sure you want to delete ALL expenses recorded in the Wheel? This action cannot be undone.',
    noticeInvalidAmount: 'Please enter a valid amount greater than 0',
    noticeInvalidAmountZero: 'Please enter a valid amount greater than or equal to 0',
    noticeMissingConcept: 'Please enter a description or concept',
    noticeExpenseSaved: 'Expense saved in {icon} {name}: {cur}{amount}',
    noticeExpenseUpdated: 'Expense updated: {cur}{amount} — {concept}',
    noticeExpenseDeleted: 'Expense deleted',
    noticeWishAdded: '"{concept}" added to Wishlist in {icon} {name}',
    noticeWishUpdated: 'Wishlist item updated: {concept}',
    noticeWishBought: '"{concept}" purchased: added to the Expense Wheel in {icon} {name}',
    noticeWishBoughtSavings: '"{concept}" purchased from Savings ({cur}{amount}) and added to the Wheel',
    noticeWishReturned: '"{concept}" returned to pending purchases',
    noticeWishDeleted: 'Item deleted from Wishlist',
    noticeSavingsDeposited: 'Deposited {cur}{amount} into your Savings Vault',
    noticeSavingsWithdrawn: 'Withdrawn {cur}{amount} from your Savings Vault',
    noticeInsufficientSavings: 'Insufficient funds in Savings Vault (Balance: {cur}{bal})',
    noticeSavingsGoalSet: 'Savings Goal set to {cur}{goal}',
    noticeSavingsEntryDeleted: 'Savings movement deleted and balance adjusted',
    noticeIncomeUpdated: 'Current income: {cur}{amount}',
    noticeFixedUpdated: 'Monthly fixed expenses: {cur}{amount}',
    noticeFixedItemAdded: 'Fixed expense added: {concept} ({cur}{amount})',
    noticeFixedItemUpdated: 'Fixed expense updated: {concept}',
    noticeFixedItemDeleted: 'Fixed expense removed',
    noticeCsvExported: 'CSV file exported',
    noticeHistoryCleared: 'Expense history reset',
    savingsExpensePrefix: '[Savings] ',
    wishlistSavingsPrefix: '[Wishlist] '
  },
  es: {
    pluginTitle: 'Finances Daily - Rueda de Gastos de 8 Dimensiones & Caja de Ahorros',
    ribbonTooltip: 'Finances Daily - Rueda de Gastos',
    viewTitle: 'Finances Daily - Rueda de Gastos',
    cmdOpenWheel: 'Abrir Rueda de Gastos & Finanzas',
    cmdQuickExpense: 'Registrar Gasto Rápido',
    cmdQuickWishlist: 'Agregar Deseo a Wishlist (8 Cuadrantes)',
    cmdManageSavings: 'Gestionar Caja de Ahorros',
    logLoaded: 'Finances Daily cargado con éxito',
    logUnloaded: 'Finances Daily descargado',
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
    totalSpentLabel: 'Total Gastado',
    txCountSuffix: 'transaccion(es)',
    savingsVaultKpiLabel: 'Caja de Ahorros',
    savingsGoalProgress: '{pct}% de meta ({cur}{goal})',
    savingsAvailableBadge: 'Fondo disponible',
    topInvestmentLabel: 'Mayor Inversión',
    noExpensesLabel: 'Sin gastos',
    topInvestmentPct: 'Representa el {pct} del total',
    currentIncomeLabel: 'Ingresos Actuales',
    monthlyFixedLabel: 'Gastos Fijos Mensuales',
    editIncomeTitle: 'Editar ingresos actuales',
    editFixedTitle: 'Editar gastos fijos mensuales',
    clickToSetIncome: 'Clic para definir ingresos',
    clickToSetFixed: 'Clic para definir o desglosar fijos',
    freeAfterFixed: 'Libre tras fijos',
    exactBalance: 'Equilibrio exacto tras fijos',
    deficitAfterFixed: 'Déficit tras fijos',
    netMonthAfterAll: 'Neto del mes (tras gastos): {val}',
    pctOfIncome: 'de tus ingresos',
    setIncomeForPct: 'Define ingresos para ver %',
    fixedBreakdownBtn: 'Desglose',
    fixedBreakdownCount: 'Desglose ({count})',
    fixedDrawerTitle: 'Desglose de Gastos Fijos Mensuales',
    fixedDrawerSubtitle: 'Agrega tus pagos fijos o suscripciones recurrentes y el KPI se sumará solo.',
    fixedDrawerTotalLabel: 'Total mensual:',
    fixedConceptPlaceholder: 'Gasto fijo (ej: Alquiler, Internet, Gym, Luz...)',
    fixedAmountPlaceholder: 'Monto ({cur})',
    fixedAddBtn: '+ Agregar Fijo',
    fixedEmptyHint: 'Aún no tienes rubros fijos detallados. Agrégalos arriba para calcular el total automáticamente.',
    fixedAutoLinkedHint: 'Calculado desde {count} rubro(s) fijo(s)',
    closeLabel: 'Cerrar',
    savingsCardTitle: 'Caja de Ahorros & Bóveda de Fondos',
    savingsCardSubtitle: 'Reserva acumulada para liquidez, emergencias y compras mayores',
    savingsTotalLabel: 'TOTAL AHORRADO',
    depositBtn: 'Ingresar Ahorro',
    withdrawBtn: 'Retirar Ahorro',
    goalBtn: 'Meta de Ahorro',
    movementsBtn: 'Movimientos ({count})',
    goalTargetLabel: 'Meta Objetivo: {cur}{goal}',
    goalAchievedLabel: '{pct}% alcanzado ({cur}{bal} de {cur}{goal})',
    savingsHistoryEmpty: 'No hay movimientos registrados en la caja de ahorros aún.',
    depositBadge: 'Depósito',
    withdrawBadge: 'Retiro',
    defaultDepositNote: 'Aporte a Caja de Ahorros',
    defaultWithdrawNote: 'Retiro de Caja de Ahorros',
    deleteMovementTitle: 'Eliminar este movimiento',
    confirmDeleteSavingsTitle: '¿Eliminar movimiento de ahorro?',
    confirmDeleteSavingsBody: '¿Eliminar "{note}" ({cur}{amount}) del historial? El saldo de tu Caja de Ahorros se ajustará automáticamente.',
    tabQuickExpense: 'Registro Rápido',
    tabPlannedPurchase: 'Compra Planificada',
    pillModeFullTitle: 'Mostrar cuadrantes con nombre y emoji (ej: Salud)',
    pillModeEmojiTitle: 'Mostrar solo emojis (modo compacto)',
    amountPlaceholder: 'Monto ({cur})',
    pricePlaceholder: 'Precio ({cur})',
    expenseConceptPlaceholder: '¿En qué invertiste? (ej: Café con amigos, Libro Python, Cena...)',
    wishConceptPlaceholder: '¿Qué te quieres comprar? (ej: Zapatos Cashea, Micrófono, Tatuaje...)',
    registerExpenseBtn: 'Registrar Gasto',
    addWishBtn: '+ Agregar a Deseos',
    wheelFilteredLabel: 'FILTRADO',
    wheelTotalLabel: 'TOTAL',
    quadSpentCount: '{count} gasto(s)',
    quadPctOfTotal: '{pct}% del total',
    wishlistHeaderTitle: 'Compras Planificadas & Wishlist (8 Cuadrantes)',
    wishlistHeaderSubtitle: 'Lista de deseos vinculada a tus 8 áreas. Al marcar un artículo como comprado, suma de inmediato a la Rueda de Gastos.',
    wishPendingStat: 'Por Comprar:',
    wishInWheelStat: 'En Rueda:',
    sortByLabel: 'Ordenar por:',
    sortDesc: 'Más Caro a Más Barato',
    sortAsc: 'Más Barato a Más Caro',
    sortRecent: 'Más Reciente',
    sortCategory: 'Por Cuadrante',
    wishlistSearchPlaceholder: 'Buscar deseo o compra...',
    clearSearchTitle: 'Limpiar búsqueda',
    viewFilterLabel: 'Ver:',
    viewPendingTab: 'Por Comprar ({count})',
    viewBoughtTab: 'Comprados ({count})',
    wishEmptySearch: 'No se encontraron compras planificadas que coincidan con "{query}".',
    wishEmptyPending: '¡No tienes compras pendientes en tu lista de deseos! Agrega una arriba.',
    wishEmptyBought: 'Aún no has pasado compras a la cola de gastos general desde tu lista de deseos.',
    chkBuyTitle: 'Marcar como comprado: pasa inmediatamente a la cola de gastos general',
    wishStatusBought: 'Comprado el {date} (En Cola de Gastos)',
    wishStatusBoughtSavings: 'Comprado el {date} (Con Ahorros)',
    wishStatusPending: 'Por Comprar / Deseo Activo',
    affordMarginBadge: 'Alcanza con margen',
    affordSavingsBadge: 'Alcanza con Ahorros',
    useSavingsBtn: 'Usar Ahorros',
    useSavingsTitle: 'Comprar descontando de tu Caja de Ahorros y registrarlo en la Rueda',
    confirmUseSavingsTitle: '¿Comprar usando Caja de Ahorros?',
    confirmUseSavingsBody: '¿Comprar "{concept}" por {cur}{amount} descontándolo de tu Caja de Ahorros y sumándolo a la Rueda de Gastos?',
    returnWishBtn: 'Devolver',
    returnWishTitle: 'Desmarcar y devolver a la lista de compras pendientes',
    editItemTitle: 'Editar registro',
    deleteWishTitle: 'Eliminar este artículo',
    confirmDeleteWishTitle: '¿Eliminar compra planificada?',
    confirmDeleteWishBody: '¿Eliminar "{concept}" ({cur}{amount}) de tu lista de deseos?',
    ledgerTitleDefault: 'Historial de Gastos',
    ledgerTitleFiltered: 'Movimientos: {icon} {name}',
    ledgerSearchPlaceholder: 'Buscar gasto o concepto...',
    ledgerEmpty: 'No hay gastos registrados para este filtro. ¡Agrega uno arriba!',
    ledgerFromWishlist: 'Desde Wishlist',
    ledgerPaidSavings: 'Con Ahorros',
    deleteExpenseTitle: 'Eliminar este gasto',
    confirmDeleteExpenseTitle: '¿Eliminar gasto?',
    confirmDeleteExpenseBody: '¿Eliminar el gasto "{concept}" por {cur}{amount}? Esta acción no se puede deshacer.',
    confirmDeleteFixedTitle: '¿Eliminar gasto fijo?',
    confirmDeleteFixedBody: '¿Quitar "{concept}" ({cur}{amount}) del desglose de gastos fijos mensuales?',
    modalQuickExpenseTitle: 'Registrar Gasto - Finances Daily',
    modalQuickExpenseConcept: 'Concepto (ej: Almuerzo, Uber, Curso)',
    modalQuickExpenseSubmit: 'Guardar en Rueda de Gastos',
    modalQuickWishTitle: 'Agregar Deseo a la Wishlist (8 Cuadrantes)',
    modalQuickWishPrice: 'Precio Estimado ({cur})',
    modalQuickWishConcept: '¿Qué te quieres comprar? (ej: Monitor, Zapatos...)',
    modalQuickWishSubmit: 'Guardar en Wishlist',
    modalDepositTitle: 'Ingresar Ahorro a la Bóveda',
    modalDepositBalance: 'Saldo actual ahorrado: {cur}{bal}',
    modalDepositAmount: 'Monto a ingresar ({cur})',
    modalDepositNote: 'Concepto o procedencia (ej: Sobrante quincena, Venta, Aporte)',
    modalDepositAsExpense: 'Registrar también como gasto en el cuadrante Finanzas de la Rueda',
    modalDepositSubmit: 'Confirmar Ingreso',
    modalWithdrawTitle: 'Retirar de la Caja de Ahorros',
    modalWithdrawBalance: 'Saldo disponible para retiro: {cur}{bal}',
    modalWithdrawAmount: 'Monto a retirar ({cur})',
    modalWithdrawNote: 'Motivo del retiro (ej: Compra urgente, etc.)',
    modalWithdrawSubmit: 'Confirmar Retiro',
    modalGoalTitle: 'Meta de la Caja de Ahorros',
    modalGoalDesc: 'Define cuánto deseas acumular como fondo de reserva o meta personal.',
    modalGoalPlaceholder: 'Meta de Ahorro ({cur})',
    modalGoalSubmit: 'Guardar Meta',
    modalEditExpenseTitle: 'Editar Gasto',
    modalEditWishTitle: 'Editar Compra Planificada',
    modalEditFixedTitle: 'Editar Gasto Fijo',
    modalEditConceptPlaceholder: 'Concepto o descripción',
    saveBtn: 'Guardar',
    saveChangesBtn: 'Guardar Cambios',
    cancelBtn: 'Cancelar',
    confirmBtn: 'Confirmar',
    deleteBtn: 'Eliminar',
    settingsTitle: 'Configuración de Finances Daily',
    settingsCurrencyName: 'Símbolo de Moneda',
    settingsCurrencyDesc: 'El símbolo monetario a mostrar (ej: $, €, Bs, USDT, MXN).',
    settingsGoalName: 'Meta de la Caja de Ahorros',
    settingsGoalDesc: 'Fondo objetivo que deseas acumular en tu caja de ahorros.',
    settingsIncomeName: 'Ingresos Actuales',
    settingsIncomeDesc: 'Ingresos actuales usados para calcular el margen disponible frente a tus gastos fijos.',
    settingsFixedName: 'Gastos Fijos Mensuales',
    settingsFixedDesc: 'Obligaciones o gastos fijos mensuales vinculados a tus ingresos actuales.',
    settingsSyncName: 'Sincronizar automáticamente con Nota Markdown',
    settingsSyncDesc: 'Si está activo, cada gasto registrado se añadirá automáticamente a tu nota de diario en el área de vida correspondiente.',
    settingsSyncPathName: 'Ruta de la Nota para Sincronización',
    settingsSyncPathDesc: 'Nombre o ruta del archivo en el Vault (por defecto: DIARIO DE RUEDA.md).',
    settingsDataHeader: 'Gestión y Exportación de Datos',
    settingsExportName: 'Exportar Datos Completos a CSV',
    settingsExportDesc: 'Descarga gastos, deseos y movimientos de caja de ahorro en un archivo CSV.',
    settingsExportBtn: 'Exportar CSV',
    settingsResetName: 'Reiniciar Historial de Gastos',
    settingsResetDesc: 'Borra únicamente los gastos registrados en la Rueda (desmarca los deseos comprados).',
    settingsResetBtn: 'Borrar Gastos',
    confirmResetTitle: '¿Reiniciar historial de gastos?',
    confirmResetBody: '¿Estás seguro de que deseas eliminar TODOS los gastos registrados en la Rueda? Esta acción no se puede deshacer.',
    noticeInvalidAmount: 'Por favor ingresa un monto válido mayor a 0',
    noticeInvalidAmountZero: 'Por favor ingresa un monto válido mayor o igual a 0',
    noticeMissingConcept: 'Por favor ingresa el concepto o descripción',
    noticeExpenseSaved: 'Gasto guardado en {icon} {name}: {cur}{amount}',
    noticeExpenseUpdated: 'Gasto actualizado: {cur}{amount} — {concept}',
    noticeExpenseDeleted: 'Gasto eliminado correctamente',
    noticeWishAdded: '"{concept}" agregado a la Wishlist en {icon} {name}',
    noticeWishUpdated: 'Deseo actualizado: {concept}',
    noticeWishBought: '"{concept}" comprado: pasó a la cola de gastos general en {icon} {name}',
    noticeWishBoughtSavings: '"{concept}" comprado con Ahorros ({cur}{amount}) y añadido a la Rueda',
    noticeWishReturned: '"{concept}" devuelto a la lista de compras pendientes',
    noticeWishDeleted: 'Artículo eliminado de la Wishlist',
    noticeSavingsDeposited: 'Ingresados {cur}{amount} a tu Caja de Ahorros',
    noticeSavingsWithdrawn: 'Retirados {cur}{amount} de tu Caja de Ahorros',
    noticeInsufficientSavings: 'Fondos insuficientes en la Caja de Ahorros (Saldo: {cur}{bal})',
    noticeSavingsGoalSet: 'Meta de Ahorro fijada en {cur}{goal}',
    noticeSavingsEntryDeleted: 'Movimiento eliminado y saldo ajustado',
    noticeIncomeUpdated: 'Ingresos actuales: {cur}{amount}',
    noticeFixedUpdated: 'Gastos fijos mensuales: {cur}{amount}',
    noticeFixedItemAdded: 'Gasto fijo agregado: {concept} ({cur}{amount})',
    noticeFixedItemUpdated: 'Gasto fijo actualizado: {concept}',
    noticeFixedItemDeleted: 'Gasto fijo eliminado',
    noticeCsvExported: 'Archivo CSV exportado',
    noticeHistoryCleared: 'Historial reiniciado correctamente',
    savingsExpensePrefix: '[Ahorro] ',
    wishlistSavingsPrefix: '[Wishlist] '
  }
};

function t(key, fallback = '') {
  return (IS_ES ? I18N.es[key] : I18N.en[key]) || I18N.en[key] || fallback || key;
}

function tf(key, vars = {}) {
  return String(t(key, key)).replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? String(vars[k]) : ''));
}

function getLocalDateStr(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const SVG_NS = 'http://www.w3.org/2000/svg';

function createUiSvgIcon(kind, size = 14) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');

  const addShape = (tag, attrs) => {
    const el = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, String(v)));
    svg.appendChild(el);
  };

  if (kind === 'zap') {
    addShape('polygon', { points: '13 2 3 14 12 14 11 22 21 10 12 10 13 2' });
  } else if (kind === 'target') {
    addShape('circle', { cx: 12, cy: 12, r: 10 });
    addShape('circle', { cx: 12, cy: 12, r: 6 });
    addShape('circle', { cx: 12, cy: 12, r: 2 });
  } else if (kind === 'search') {
    addShape('circle', { cx: 11, cy: 11, r: 8 });
    addShape('path', { d: 'm21 21-4.3-4.3' });
  } else if (kind === 'pencil') {
    addShape('path', { d: 'M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z' });
    addShape('path', { d: 'm15 5 4 4' });
  } else if (kind === 'check') {
    addShape('polyline', { points: '20 6 9 17 4 12' });
  } else if (kind === 'check-circle') {
    addShape('path', { d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14' });
    addShape('polyline', { points: '22 4 12 14.01 9 11.01' });
  } else if (kind === 'x') {
    addShape('path', { d: 'M18 6 6 18' });
    addShape('path', { d: 'm6 6 12 12' });
  } else if (kind === 'trash') {
    addShape('path', { d: 'M3 6h18' });
    addShape('path', { d: 'M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' });
    addShape('path', { d: 'M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' });
  } else if (kind === 'pie') {
    addShape('path', { d: 'M21.21 15.89A10 10 0 1 1 8 2.83' });
    addShape('path', { d: 'M22 12A10 10 0 0 0 12 2v10z' });
  } else if (kind === 'vault') {
    addShape('rect', { width: 18, height: 18, x: 3, y: 3, rx: 2 });
    addShape('circle', { cx: 12, cy: 12, r: 3 });
    addShape('path', { d: 'm14.5 9.5 1-1' });
    addShape('path', { d: 'm14.5 14.5 1 1' });
    addShape('path', { d: 'm9.5 9.5-1-1' });
    addShape('path', { d: 'm9.5 14.5-1 1' });
  } else if (kind === 'plus') {
    addShape('path', { d: 'M5 12h14' });
    addShape('path', { d: 'M12 5v14' });
  } else if (kind === 'arrow-up-right') {
    addShape('path', { d: 'M7 7h10v10' });
    addShape('path', { d: 'M7 17 17 7' });
  } else if (kind === 'arrow-down-left') {
    addShape('path', { d: 'M17 7 7 17' });
    addShape('path', { d: 'M17 17H7V7' });
  } else if (kind === 'list') {
    addShape('line', { x1: 8, x2: 21, y1: 6, y2: 6 });
    addShape('line', { x1: 8, x2: 21, y1: 12, y2: 12 });
    addShape('line', { x1: 8, x2: 21, y1: 18, y2: 18 });
    addShape('line', { x1: 3, x2: 3.01, y1: 6, y2: 6 });
    addShape('line', { x1: 3, x2: 3.01, y1: 12, y2: 12 });
    addShape('line', { x1: 3, x2: 3.01, y1: 18, y2: 18 });
  } else if (kind === 'rotate-ccw') {
    addShape('path', { d: 'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8' });
    addShape('path', { d: 'M3 3v5h5' });
  } else if (kind === 'arrow-down') {
    addShape('path', { d: 'M12 5v14' });
    addShape('path', { d: 'm19 12-7 7-7-7' });
  } else if (kind === 'arrow-up') {
    addShape('path', { d: 'm5 12 7-7 7 7' });
    addShape('path', { d: 'M12 19V5' });
  } else if (kind === 'clock') {
    addShape('circle', { cx: 12, cy: 12, r: 10 });
    addShape('polyline', { points: '12 6 12 12 16 14' });
  } else if (kind === 'tag') {
    addShape('path', { d: 'M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z' });
    addShape('path', { d: 'M7 7h.01' });
  } else if (kind === 'hourglass') {
    addShape('path', { d: 'M5 22h14' });
    addShape('path', { d: 'M5 2h14' });
    addShape('path', { d: 'M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22' });
    addShape('path', { d: 'M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2' });
  } else if (kind === 'receipt') {
    addShape('path', { d: 'M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z' });
    addShape('path', { d: 'M8 7h8' });
    addShape('path', { d: 'M8 11h8' });
    addShape('path', { d: 'M8 15h4' });
  } else if (kind === 'wallet') {
    addShape('path', { d: 'M21 12V7H5a2 2 0 0 1 0-4h14v4' });
    addShape('path', { d: 'M3 5v14a2 2 0 0 0 2 2h16v-5' });
    addShape('path', { d: 'M18 12a2 2 0 0 0 0 4h4v-4Z' });
  } else if (kind === 'alert') {
    addShape('circle', { cx: 12, cy: 12, r: 10 });
    addShape('line', { x1: 12, x2: 12, y1: 8, y2: 12 });
    addShape('line', { x1: 12, x2: 12.01, y1: 16, y2: 16 });
  }
  return svg;
}

function appendIconLabel(el, iconKind, labelText, size = 13) {
  const iconWrap = el.createSpan({ cls: 'fd-btn-icon' });
  iconWrap.appendChild(createUiSvgIcon(iconKind, size));
  if (labelText) {
    el.createSpan({ text: labelText });
  }
}

function renderModalCategoryPills(container, initialCatId, onSelect) {
  const catSelector = container.createDiv({ cls: 'fd-category-selector' });
  let activeId = initialCatId || CATEGORIES[0].id;

  const paint = () => {
    const all = catSelector.querySelectorAll('.fd-cat-pill');
    all.forEach((p, idx) => {
      const match = CATEGORIES[idx];
      if (match.id === activeId) {
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

  CATEGORIES.forEach(c => {
    const isSelected = activeId === c.id;
    const pill = catSelector.createEl('button', {
      cls: `fd-cat-pill ${isSelected ? 'selected' : ''}`,
      attr: { type: 'button' }
    });
    pill.style.borderColor = isSelected ? c.color : 'var(--background-modifier-border)';
    pill.style.background = isSelected ? c.color : 'var(--background-primary)';
    pill.setText(`${c.icon} ${c.name}`);

    pill.onclick = () => {
      activeId = c.id;
      paint();
      onSelect(c.id);
    };
  });
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
  wishlistSort: 'desc', // 'desc' | 'asc' | 'recent' | 'category'
  wishlistFilter: 'pending', // 'pending' | 'bought'
  quickExpensePillMode: 'full', // 'full' | 'emoji'
  wishlistPillMode: 'full', // 'full' | 'emoji'
  savingsBalance: 0,
  savingsGoal: 0,
  savingsHistory: [],
  currentIncome: 0,
  monthlyFixedExpenses: 0,
  fixedExpensesList: []
};

// ─── PLUGIN CLASS ──────────────────────────────────────────────────────────
class FinancesDailyPlugin extends obsidian.Plugin {
  async onload() {
    await this.loadSettings();

    this.registerView(
      VIEW_TYPE_FINANCES_DAILY,
      (leaf) => new FinancesDailyView(leaf, this)
    );

    this.addRibbonIcon('pie-chart', t('ribbonTooltip'), () => {
      this.activateView();
    });

    this.addCommand({
      id: 'open-wheel',
      name: t('cmdOpenWheel'),
      callback: () => {
        this.activateView();
      }
    });

    this.addCommand({
      id: 'quick-add-expense',
      name: t('cmdQuickExpense'),
      callback: () => {
        new QuickExpenseModal(this.app, this).open();
      }
    });

    this.addCommand({
      id: 'quick-add-wishlist',
      name: t('cmdQuickWishlist'),
      callback: () => {
        new QuickWishlistModal(this.app, this).open();
      }
    });

    this.addCommand({
      id: 'manage-savings',
      name: t('cmdManageSavings'),
      callback: () => {
        new SavingsDepositModal(this.app, this, () => this.refreshOpenViews()).open();
      }
    });

    this.addSettingTab(new FinancesDailySettingTab(this.app, this));

    console.log(t('logLoaded'));
  }

  onunload() {
    console.log(t('logUnloaded'));
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
    if (!Array.isArray(this.settings.fixedExpensesList)) {
      this.settings.fixedExpensesList = [];
    }
    if (typeof this.settings.savingsBalance !== 'number' || !Number.isFinite(this.settings.savingsBalance)) {
      this.settings.savingsBalance = 0;
    }
    if (typeof this.settings.savingsGoal !== 'number' || !Number.isFinite(this.settings.savingsGoal)) {
      this.settings.savingsGoal = 0;
    }
    if (!this.settings.wishlistSort) {
      this.settings.wishlistSort = 'desc';
    }
    if (!this.settings.wishlistFilter || this.settings.wishlistFilter === 'all') {
      this.settings.wishlistFilter = 'pending';
    }
    if (!this.settings.quickExpensePillMode) {
      this.settings.quickExpensePillMode = 'full';
    }
    if (!this.settings.wishlistPillMode) {
      this.settings.wishlistPillMode = 'full';
    }
    if (typeof this.settings.currentIncome !== 'number' || !Number.isFinite(this.settings.currentIncome) || this.settings.currentIncome < 0) {
      this.settings.currentIncome = 0;
    }
    if (this.settings.fixedExpensesList.length > 0) {
      this.settings.monthlyFixedExpenses = this.computeFixedExpensesSum();
    } else if (typeof this.settings.monthlyFixedExpenses !== 'number' || !Number.isFinite(this.settings.monthlyFixedExpenses) || this.settings.monthlyFixedExpenses < 0) {
      this.settings.monthlyFixedExpenses = 0;
    }
  }

  computeFixedExpensesSum() {
    return (this.settings.fixedExpensesList || []).reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
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

  refreshOpenViews() {
    this.app.workspace.getLeavesOfType(VIEW_TYPE_FINANCES_DAILY).forEach(leaf => {
      if (leaf.view && typeof leaf.view.render === 'function') {
        leaf.view.render();
      }
    });
  }

  // ─── GASTOS METHODS ───────────────────────────────────────────────────────
  async addExpense({ amount, concept, categoryId, date, time }) {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      new obsidian.Notice(t('noticeInvalidAmount'));
      return false;
    }
    if (!concept || !concept.trim()) {
      new obsidian.Notice(t('noticeMissingConcept'));
      return false;
    }

    const cat = CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0];
    const now = new Date();
    const finalDate = date || getLocalDateStr(now);
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

    if (this.settings.syncWithNote && this.settings.syncNotePath) {
      await this.syncToMarkdownNote(newTx, cat);
    }

    new obsidian.Notice(tf('noticeExpenseSaved', {
      icon: cat.icon,
      name: cat.name,
      cur: this.settings.currency,
      amount: parsedAmount.toFixed(2)
    }));
    return true;
  }

  async editExpense(id, { amount, concept, categoryId }) {
    const tx = (this.settings.transactions || []).find(item => item.id === id);
    if (!tx) return false;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      new obsidian.Notice(t('noticeInvalidAmount'));
      return false;
    }
    if (!concept || !concept.trim()) {
      new obsidian.Notice(t('noticeMissingConcept'));
      return false;
    }

    const cat = CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0];
    tx.amount = parsedAmount;
    tx.concept = concept.trim();
    tx.categoryId = cat.id;
    tx.categoryName = cat.name;
    tx.categoryIcon = cat.icon;
    tx.categoryColor = cat.color;

    if (tx.wishlistId) {
      const linkedWish = (this.settings.wishlist || []).find(w => w.id === tx.wishlistId);
      if (linkedWish) {
        linkedWish.amount = parsedAmount;
        linkedWish.concept = tx.concept;
        linkedWish.categoryId = cat.id;
        linkedWish.categoryName = cat.name;
        linkedWish.categoryIcon = cat.icon;
        linkedWish.categoryColor = cat.color;
      }
    }

    await this.saveSettings();
    new obsidian.Notice(tf('noticeExpenseUpdated', {
      cur: this.settings.currency,
      amount: parsedAmount.toFixed(2),
      concept: tx.concept
    }));
    return true;
  }

  refundWishlistSavingsIfNeeded(item) {
    if (!item || !item.paidFromSavings) return;
    const linkedSav = item.savingsEntryId
      ? (this.settings.savingsHistory || []).find(e => e.id === item.savingsEntryId)
      : null;
    if (linkedSav) {
      this.settings.savingsBalance = (Number(this.settings.savingsBalance) || 0) + (Number(linkedSav.amount) || 0);
      this.settings.savingsHistory = (this.settings.savingsHistory || []).filter(e => e.id !== item.savingsEntryId);
    }
    item.paidFromSavings = false;
    item.savingsEntryId = null;
  }

  async deleteExpense(id) {
    const linkedWish = (this.settings.wishlist || []).find(w => w.txId === id);
    if (linkedWish) {
      this.refundWishlistSavingsIfNeeded(linkedWish);
      linkedWish.bought = false;
      linkedWish.boughtDate = null;
      linkedWish.txId = null;
    }

    this.settings.transactions = (this.settings.transactions || []).filter(tx => tx.id !== id);
    await this.saveSettings();
    new obsidian.Notice(t('noticeExpenseDeleted'));
  }

  // ─── WISHLIST METHODS (VINCULADA A LOS 8 CUADRANTES) ──────────────────────
  async addWishlistItem({ amount, concept, categoryId }) {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      new obsidian.Notice(t('noticeInvalidAmount'));
      return false;
    }
    if (!concept || !concept.trim()) {
      new obsidian.Notice(t('noticeMissingConcept'));
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
      paidFromSavings: false,
      savingsEntryId: null,
      createdAt: Date.now(),
      createdDate: getLocalDateStr(now)
    };

    this.settings.wishlist.unshift(newItem);
    await this.saveSettings();

    new obsidian.Notice(tf('noticeWishAdded', {
      concept: newItem.concept,
      icon: cat.icon,
      name: cat.name
    }));
    return newItem;
  }

  async editWishlistItem(id, { amount, concept, categoryId }) {
    const item = (this.settings.wishlist || []).find(w => w.id === id);
    if (!item) return false;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      new obsidian.Notice(t('noticeInvalidAmount'));
      return false;
    }
    if (!concept || !concept.trim()) {
      new obsidian.Notice(t('noticeMissingConcept'));
      return false;
    }

    const cat = CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0];
    item.amount = parsedAmount;
    item.concept = concept.trim();
    item.categoryId = cat.id;
    item.categoryName = cat.name;
    item.categoryIcon = cat.icon;
    item.categoryColor = cat.color;

    if (item.bought && item.txId) {
      const linkedTx = (this.settings.transactions || []).find(tx => tx.id === item.txId);
      if (linkedTx) {
        linkedTx.amount = parsedAmount;
        linkedTx.concept = item.concept;
        linkedTx.categoryId = cat.id;
        linkedTx.categoryName = cat.name;
        linkedTx.categoryIcon = cat.icon;
        linkedTx.categoryColor = cat.color;
      }
    }

    await this.saveSettings();
    new obsidian.Notice(tf('noticeWishUpdated', { concept: item.concept }));
    return true;
  }

  async toggleWishlistItem(id) {
    const item = (this.settings.wishlist || []).find(w => w.id === id);
    if (!item) return;

    const cat = CATEGORIES.find(c => c.id === item.categoryId) || CATEGORIES[0];
    const now = new Date();
    const todayStr = getLocalDateStr(now);
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (!item.bought) {
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
        paidFromSavings: false,
        wishlistId: item.id
      };

      this.settings.transactions.unshift(newTx);
      item.bought = true;
      item.boughtDate = todayStr;
      item.txId = txId;
      item.paidFromSavings = false;
      item.savingsEntryId = null;

      await this.saveSettings();

      if (this.settings.syncWithNote && this.settings.syncNotePath) {
        await this.syncToMarkdownNote(newTx, cat);
      }

      new obsidian.Notice(tf('noticeWishBought', {
        concept: item.concept,
        icon: cat.icon,
        name: cat.name
      }));
    } else {
      this.refundWishlistSavingsIfNeeded(item);
      this.settings.transactions = (this.settings.transactions || []).filter(
        tx => tx.id !== item.txId && tx.wishlistId !== item.id
      );

      item.bought = false;
      item.boughtDate = null;
      item.txId = null;

      await this.saveSettings();
      new obsidian.Notice(tf('noticeWishReturned', { concept: item.concept }));
    }
  }

  async purchaseWishlistWithSavings(id) {
    const item = (this.settings.wishlist || []).find(w => w.id === id);
    if (!item || item.bought) return false;

    const amt = Number(item.amount) || 0;
    const currentBal = Number(this.settings.savingsBalance) || 0;
    if (amt <= 0 || amt > currentBal) {
      new obsidian.Notice(tf('noticeInsufficientSavings', {
        cur: this.settings.currency,
        bal: currentBal.toFixed(2)
      }));
      return false;
    }

    const cat = CATEGORIES.find(c => c.id === item.categoryId) || CATEGORIES[0];
    const now = new Date();
    const todayStr = getLocalDateStr(now);
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    this.settings.savingsBalance = currentBal - amt;
    const savEntryId = 'sav_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    this.settings.savingsHistory.unshift({
      id: savEntryId,
      type: 'withdraw',
      amount: amt,
      note: `${t('wishlistSavingsPrefix')}${item.concept}`,
      date: todayStr,
      time: timeStr,
      timestamp: Date.now(),
      wishlistId: item.id
    });

    const txId = 'tx_wish_' + item.id;
    const newTx = {
      id: txId,
      amount: amt,
      concept: item.concept,
      categoryId: cat.id,
      categoryName: cat.name,
      categoryIcon: cat.icon,
      categoryColor: cat.color,
      date: todayStr,
      time: timeStr,
      timestamp: Date.now(),
      isFromWishlist: true,
      paidFromSavings: true,
      wishlistId: item.id
    };

    this.settings.transactions.unshift(newTx);
    item.bought = true;
    item.boughtDate = todayStr;
    item.txId = txId;
    item.paidFromSavings = true;
    item.savingsEntryId = savEntryId;

    await this.saveSettings();

    if (this.settings.syncWithNote && this.settings.syncNotePath) {
      await this.syncToMarkdownNote(newTx, cat);
    }

    new obsidian.Notice(tf('noticeWishBoughtSavings', {
      concept: item.concept,
      cur: this.settings.currency,
      amount: amt.toFixed(2)
    }));
    return true;
  }

  async deleteWishlistItem(id) {
    const item = (this.settings.wishlist || []).find(w => w.id === id);
    if (item && item.bought) {
      this.refundWishlistSavingsIfNeeded(item);
      this.settings.transactions = (this.settings.transactions || []).filter(
        tx => tx.id !== item.txId && tx.wishlistId !== item.id
      );
    }
    this.settings.wishlist = (this.settings.wishlist || []).filter(w => w.id !== id);
    await this.saveSettings();
    new obsidian.Notice(t('noticeWishDeleted'));
  }

  // ─── CAJA DE AHORROS METHODS ─────────────────────────────────────────────
  async depositSavings({ amount, note, recordAsExpense }) {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      new obsidian.Notice(t('noticeInvalidAmount'));
      return false;
    }

    const now = new Date();
    const todayStr = getLocalDateStr(now);
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    this.settings.savingsBalance = (Number(this.settings.savingsBalance) || 0) + parsedAmount;

    const entry = {
      id: 'sav_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      type: 'deposit',
      amount: parsedAmount,
      note: (note || '').trim() || t('defaultDepositNote'),
      date: todayStr,
      time: timeStr,
      timestamp: Date.now()
    };

    this.settings.savingsHistory.unshift(entry);

    if (recordAsExpense) {
      const catFin = CATEGORIES.find(c => c.id === 'finanzas') || CATEGORIES[7];
      const tx = {
        id: 'tx_sav_' + entry.id,
        amount: parsedAmount,
        concept: `${t('savingsExpensePrefix')}${entry.note}`,
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
    new obsidian.Notice(tf('noticeSavingsDeposited', {
      cur: this.settings.currency,
      amount: parsedAmount.toFixed(2)
    }));
    return true;
  }

  async withdrawSavings({ amount, note }) {
    const parsedAmount = parseFloat(amount);
    const currentBal = Number(this.settings.savingsBalance) || 0;

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      new obsidian.Notice(t('noticeInvalidAmount'));
      return false;
    }
    if (parsedAmount > currentBal) {
      new obsidian.Notice(tf('noticeInsufficientSavings', {
        cur: this.settings.currency,
        bal: currentBal.toFixed(2)
      }));
      return false;
    }

    const now = new Date();
    const todayStr = getLocalDateStr(now);
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    this.settings.savingsBalance = currentBal - parsedAmount;

    const entry = {
      id: 'sav_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      type: 'withdraw',
      amount: parsedAmount,
      note: (note || '').trim() || t('defaultWithdrawNote'),
      date: todayStr,
      time: timeStr,
      timestamp: Date.now()
    };

    this.settings.savingsHistory.unshift(entry);
    await this.saveSettings();

    new obsidian.Notice(tf('noticeSavingsWithdrawn', {
      cur: this.settings.currency,
      amount: parsedAmount.toFixed(2)
    }));
    return true;
  }

  async setSavingsGoal(goalAmount) {
    this.settings.savingsGoal = Math.max(0, parseFloat(goalAmount) || 0);
    await this.saveSettings();
    new obsidian.Notice(tf('noticeSavingsGoalSet', {
      cur: this.settings.currency,
      goal: this.settings.savingsGoal.toFixed(2)
    }));
  }

  async deleteSavingsHistoryEntry(id) {
    const entry = (this.settings.savingsHistory || []).find(e => e.id === id);
    if (!entry) return;

    const amt = Number(entry.amount) || 0;
    const currentBal = Number(this.settings.savingsBalance) || 0;
    if (entry.type === 'deposit') {
      this.settings.savingsBalance = Math.max(0, currentBal - amt);
    } else if (entry.type === 'withdraw') {
      this.settings.savingsBalance = currentBal + amt;
    }

    if (entry.wishlistId) {
      const linkedWish = (this.settings.wishlist || []).find(w => w.id === entry.wishlistId);
      if (linkedWish) {
        linkedWish.paidFromSavings = false;
        linkedWish.savingsEntryId = null;
      }
      const linkedTx = (this.settings.transactions || []).find(tx => tx.wishlistId === entry.wishlistId);
      if (linkedTx) {
        linkedTx.paidFromSavings = false;
      }
    }

    this.settings.savingsHistory = (this.settings.savingsHistory || []).filter(e => e.id !== id);
    await this.saveSettings();
    new obsidian.Notice(t('noticeSavingsEntryDeleted'));
  }

  // ─── INGRESOS & GASTOS FIJOS MENSUALES ───────────────────────────────────
  async setCurrentIncome(amount) {
    const raw = String(amount ?? '').trim();
    const parsed = raw === '' ? 0 : parseFloat(raw);
    if (!Number.isFinite(parsed) || parsed < 0) {
      new obsidian.Notice(t('noticeInvalidAmountZero'));
      return false;
    }
    this.settings.currentIncome = parsed;
    await this.saveSettings();
    new obsidian.Notice(tf('noticeIncomeUpdated', {
      cur: this.settings.currency,
      amount: parsed.toFixed(2)
    }));
    return true;
  }

  async setMonthlyFixedExpenses(amount) {
    const raw = String(amount ?? '').trim();
    const parsed = raw === '' ? 0 : parseFloat(raw);
    if (!Number.isFinite(parsed) || parsed < 0) {
      new obsidian.Notice(t('noticeInvalidAmountZero'));
      return false;
    }
    this.settings.monthlyFixedExpenses = parsed;
    await this.saveSettings();
    new obsidian.Notice(tf('noticeFixedUpdated', {
      cur: this.settings.currency,
      amount: parsed.toFixed(2)
    }));
    return true;
  }

  async addFixedExpenseItem({ concept, amount }) {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      new obsidian.Notice(t('noticeInvalidAmount'));
      return false;
    }
    if (!concept || !concept.trim()) {
      new obsidian.Notice(t('noticeMissingConcept'));
      return false;
    }

    const newItem = {
      id: 'fix_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      concept: concept.trim(),
      amount: parsedAmount
    };

    this.settings.fixedExpensesList.push(newItem);
    this.settings.monthlyFixedExpenses = this.computeFixedExpensesSum();
    await this.saveSettings();

    new obsidian.Notice(tf('noticeFixedItemAdded', {
      concept: newItem.concept,
      cur: this.settings.currency,
      amount: parsedAmount.toFixed(2)
    }));
    return true;
  }

  async editFixedExpenseItem(id, { concept, amount }) {
    const item = (this.settings.fixedExpensesList || []).find(f => f.id === id);
    if (!item) return false;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      new obsidian.Notice(t('noticeInvalidAmount'));
      return false;
    }
    if (!concept || !concept.trim()) {
      new obsidian.Notice(t('noticeMissingConcept'));
      return false;
    }

    item.concept = concept.trim();
    item.amount = parsedAmount;
    this.settings.monthlyFixedExpenses = this.computeFixedExpensesSum();
    await this.saveSettings();

    new obsidian.Notice(tf('noticeFixedItemUpdated', { concept: item.concept }));
    return true;
  }

  async deleteFixedExpenseItem(id) {
    this.settings.fixedExpensesList = (this.settings.fixedExpensesList || []).filter(f => f.id !== id);
    this.settings.monthlyFixedExpenses = this.settings.fixedExpensesList.length > 0
      ? this.computeFixedExpensesSum()
      : 0;
    await this.saveSettings();
    new obsidian.Notice(t('noticeFixedItemDeleted'));
  }

  async syncToMarkdownNote(tx, cat) {
    try {
      const file = this.app.vault.getAbstractFileByPath(this.settings.syncNotePath);
      if (!file) {
        console.warn('Sync note not found:', this.settings.syncNotePath);
        return;
      }

      const content = await this.app.vault.read(file);
      const entryLine = `${tx.date} ${tx.time} ${tx.concept} (${this.settings.currency}${tx.amount.toFixed(2)})`;

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
    } catch (err) {
      console.error('Error syncing to Obsidian note:', err);
    }
  }
}

// ─── MAIN ITEMVIEW (INTERACTIVE WHEEL DASHBOARD) ──────────────────────────
class FinancesDailyView extends obsidian.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.currentFilter = 'mes'; // 'hoy' | 'semana' | 'mes' | 'todo'
    this.selectedCatFilter = null;
    this.searchQuery = '';
    this.wishlistSearchQuery = '';
    this.selectedFormCat = CATEGORIES[0].id;
    this.selectedWishCat = CATEGORIES[0].id;
    this.captureMode = 'expense'; // 'expense' | 'wishlist'
    this.editingKpi = null; // null | 'income' | 'fixed'
    this.showFixedDrawer = false;
    this.wishlistSort = this.plugin.settings.wishlistSort || 'desc';
    this.wishlistFilter = (this.plugin.settings.wishlistFilter && this.plugin.settings.wishlistFilter !== 'all') ? this.plugin.settings.wishlistFilter : 'pending';
    this.showSavingsHistory = false;
  }

  getViewType() {
    return VIEW_TYPE_FINANCES_DAILY;
  }

  getDisplayText() {
    return t('viewTitle');
  }

  getIcon() {
    return 'pie-chart';
  }

  async onOpen() {
    this.render();
  }

  render() {
    const container = this.containerEl.children[1];
    const prevScrollTop = container.scrollTop;
    container.empty();
    container.addClass('finances-daily-view');

    const wrapper = container.createDiv({ cls: 'fd-container' });

    // 1. Header & Filter Tabs
    this.renderHeader(wrapper);

    // 2. Unified Capture Box (Registro Rápido / Compra Planificada)
    this.renderQuickCapture(wrapper);

    // 3. Balance KPI Summary + Optional Fixed Expenses Breakdown Drawer
    const filteredTxs = this.getFilteredTransactions();
    this.renderKPIs(wrapper, filteredTxs);
    if (this.showFixedDrawer) {
      this.renderFixedExpensesDrawer(wrapper);
    }

    // 4. Bóveda / Caja de Ahorros Dedicada
    this.renderSavingsVault(wrapper);

    // 5. Wheel & Quadrants Layout
    const layout = wrapper.createDiv({ cls: 'fd-wheel-layout' });
    this.renderWheel(layout, filteredTxs);
    this.renderQuadrants(layout, filteredTxs);

    // 6. Compras Planificadas & Wishlist Acumuladas (8 Cuadrantes)
    this.renderWishlist(wrapper);

    // 7. Transaction History / Ledger
    this.renderLedger(wrapper, filteredTxs);

    container.scrollTop = prevScrollTop;
  }

  renderHeader(parent) {
    const header = parent.createDiv({ cls: 'fd-header' });

    const titleBlock = header.createDiv({ cls: 'fd-title-block' });
    const iconBadge = titleBlock.createDiv({ cls: 'fd-icon-badge' });
    iconBadge.appendChild(createUiSvgIcon('pie', 20));

    const textWrap = titleBlock.createDiv();
    const title = textWrap.createEl('h2', { cls: 'fd-title' });
    title.setText('Finances Daily');

    const subtitle = textWrap.createEl('p', { cls: 'fd-subtitle' });
    subtitle.setText(t('subtitleWheel'));

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

  getCurrentMonthSpent() {
    const currentYearMonth = getLocalDateStr(new Date()).substring(0, 7);
    return (this.plugin.settings.transactions || [])
      .filter(tx => (tx.date || '').startsWith(currentYearMonth))
      .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
  }

  renderKPIs(parent, txs) {
    const kpiGrid = parent.createDiv({ cls: 'fd-kpi-grid' });
    const cur = this.plugin.settings.currency;

    const total = txs.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
    const count = txs.length;

    const totalsByCat = {};
    CATEGORIES.forEach(c => { totalsByCat[c.id] = 0; });
    txs.forEach(tx => {
      totalsByCat[tx.categoryId] = (totalsByCat[tx.categoryId] || 0) + Number(tx.amount);
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
    c1.createDiv({ cls: 'fd-kpi-label', text: t('totalSpentLabel') });
    c1.createDiv({ cls: 'fd-kpi-value', text: `${cur} ${total.toFixed(2)}` });
    const c1Badge = c1.createDiv({ cls: 'fd-kpi-badge' });
    appendIconLabel(c1Badge, 'receipt', `${count} ${t('txCountSuffix')}`, 12);

    // Card 2: Caja de Ahorros
    const savingsBal = Number(this.plugin.settings.savingsBalance) || 0;
    const savingsGoal = Number(this.plugin.settings.savingsGoal) || 0;
    const c2 = kpiGrid.createDiv({ cls: 'fd-kpi-card fd-kpi-savings' });
    c2.createDiv({ cls: 'fd-kpi-label', text: t('savingsVaultKpiLabel') });
    const c2Val = c2.createDiv({ cls: 'fd-kpi-value fd-savings-val', text: `${cur} ${savingsBal.toFixed(2)}` });
    c2Val.style.color = '#10B981';
    const c2Badge = c2.createDiv({ cls: 'fd-kpi-badge' });
    if (savingsGoal > 0) {
      appendIconLabel(c2Badge, 'target', tf('savingsGoalProgress', {
        pct: Math.round((savingsBal / savingsGoal) * 100),
        cur,
        goal: savingsGoal.toFixed(0)
      }), 12);
    } else {
      appendIconLabel(c2Badge, 'vault', t('savingsAvailableBadge'), 12);
    }
    c2.style.cursor = 'pointer';
    c2.onclick = () => {
      const svCard = document.querySelector('.fd-savings-card');
      if (svCard) svCard.scrollIntoView({ behavior: 'smooth' });
    };

    // Card 3: Ingresos Actuales (editable + relacionado con Gastos Fijos Mensuales + Neto del mes)
    const income = Number(this.plugin.settings.currentIncome) || 0;
    const fixedList = this.plugin.settings.fixedExpensesList || [];
    const fixed = fixedList.length > 0
      ? this.plugin.computeFixedExpensesSum()
      : (Number(this.plugin.settings.monthlyFixedExpenses) || 0);
    const netAfterFixed = income - fixed;
    const freePct = income > 0 ? Math.max(0, (netAfterFixed / income) * 100) : 0;
    const fixedPct = income > 0 ? (fixed / income) * 100 : 0;
    const monthSpent = this.getCurrentMonthSpent();
    const realMonthNet = income - fixed - monthSpent;

    let incomeBadgeText = t('clickToSetIncome');
    let incomeBadgeTone = 'muted';
    if (income > 0 && fixed > 0) {
      if (netAfterFixed > 0) {
        incomeBadgeText = `${t('freeAfterFixed')}: ${cur}${netAfterFixed.toFixed(2)} (${freePct.toFixed(0)}%)`;
        incomeBadgeTone = 'positive';
      } else if (netAfterFixed === 0) {
        incomeBadgeText = t('exactBalance');
        incomeBadgeTone = 'warning';
      } else {
        incomeBadgeText = `${t('deficitAfterFixed')}: -${cur}${Math.abs(netAfterFixed).toFixed(2)}`;
        incomeBadgeTone = 'danger';
      }
    } else if (income > 0) {
      incomeBadgeText = `${t('freeAfterFixed')}: ${cur}${income.toFixed(2)} (100%)`;
      incomeBadgeTone = 'positive';
    } else if (fixed > 0) {
      incomeBadgeText = `${t('deficitAfterFixed')}: -${cur}${fixed.toFixed(2)}`;
      incomeBadgeTone = 'danger';
    }

    let incomeSubText = null;
    let incomeSubTone = 'muted';
    if (income > 0 || monthSpent > 0) {
      const signedVal = realMonthNet < 0
        ? `-${cur}${Math.abs(realMonthNet).toFixed(2)}`
        : `${cur}${realMonthNet.toFixed(2)}`;
      incomeSubText = tf('netMonthAfterAll', { val: signedVal });
      incomeSubTone = realMonthNet >= 0 ? 'positive' : 'warning';
    }

    this.renderEditableFinancialKpi(kpiGrid, {
      key: 'income',
      cardClass: 'fd-kpi-income',
      label: t('currentIncomeLabel'),
      editTitle: t('editIncomeTitle'),
      value: income,
      badgeText: incomeBadgeText,
      badgeTone: incomeBadgeTone,
      subMetricText: incomeSubText,
      subMetricTone: incomeSubTone,
      barPct: income > 0 ? Math.min(100, freePct) : null,
      barTone: incomeBadgeTone,
      onSave: async (nextVal) => {
        const ok = await this.plugin.setCurrentIncome(nextVal);
        if (ok) {
          this.editingKpi = null;
          this.render();
        }
      }
    });

    // Card 4: Mayor Inversión
    const c4 = kpiGrid.createDiv({ cls: 'fd-kpi-card' });
    c4.createDiv({ cls: 'fd-kpi-label', text: t('topInvestmentLabel') });
    const topLabel = total > 0 ? `${topCat.icon} ${topCat.name}` : t('noExpensesLabel');
    c4.createDiv({ cls: 'fd-kpi-value', text: topLabel });
    const pct = total > 0 ? ((maxSpent / total) * 100).toFixed(1) + '%' : '0%';
    c4.createDiv({ cls: 'fd-kpi-badge', text: tf('topInvestmentPct', { pct }) });

    // Card 5: Gastos Fijos Mensuales (editable + desglosable + relacionado con Ingresos Actuales)
    let fixedBadgeText = t('clickToSetFixed');
    let fixedBadgeTone = 'muted';
    if (income > 0) {
      fixedBadgeText = `${fixedPct.toFixed(1)}% ${t('pctOfIncome')}`;
      if (fixedPct <= 50) {
        fixedBadgeTone = 'positive';
      } else if (fixedPct <= 80) {
        fixedBadgeTone = 'warning';
      } else {
        fixedBadgeTone = 'danger';
      }
    } else if (fixed > 0) {
      fixedBadgeText = t('setIncomeForPct');
      fixedBadgeTone = 'warning';
    }

    this.renderEditableFinancialKpi(kpiGrid, {
      key: 'fixed',
      cardClass: 'fd-kpi-fixed',
      label: t('monthlyFixedLabel'),
      editTitle: t('editFixedTitle'),
      value: fixed,
      badgeText: fixedBadgeText,
      badgeTone: fixedBadgeTone,
      subMetricText: fixedList.length > 0 ? tf('fixedAutoLinkedHint', { count: fixedList.length }) : null,
      subMetricTone: 'muted',
      barPct: income > 0 ? Math.min(100, fixedPct) : null,
      barTone: fixedBadgeTone,
      hasFixedBreakdown: true,
      fixedBreakdownCount: fixedList.length,
      onPencilClick: fixedList.length > 0 ? () => {
        this.editingKpi = null;
        this.showFixedDrawer = !this.showFixedDrawer;
        this.render();
      } : null,
      onSave: async (nextVal) => {
        const ok = await this.plugin.setMonthlyFixedExpenses(nextVal);
        if (ok) {
          this.editingKpi = null;
          this.render();
        }
      }
    });
  }

  renderEditableFinancialKpi(parent, cfg) {
    const isEditing = this.editingKpi === cfg.key;
    const card = parent.createDiv({
      cls: `fd-kpi-card fd-kpi-editable ${cfg.cardClass} ${isEditing ? 'is-editing' : ''}`,
      attr: isEditing ? {} : { title: cfg.editTitle }
    });

    const topRow = card.createDiv({ cls: 'fd-kpi-top-row' });
    topRow.createDiv({ cls: 'fd-kpi-label', text: cfg.label });

    if (!isEditing) {
      const topActions = topRow.createDiv({ cls: 'fd-kpi-top-actions' });

      if (cfg.hasFixedBreakdown) {
        const listBtn = topActions.createEl('button', {
          cls: `fd-kpi-breakdown-btn ${this.showFixedDrawer ? 'active' : ''}`,
          attr: {
            type: 'button',
            title: cfg.fixedBreakdownCount > 0
              ? tf('fixedBreakdownCount', { count: cfg.fixedBreakdownCount })
              : t('fixedBreakdownBtn')
          }
        });
        listBtn.appendChild(createUiSvgIcon('list', 12));
        if (cfg.fixedBreakdownCount > 0) {
          listBtn.createSpan({ text: String(cfg.fixedBreakdownCount) });
        }
        listBtn.onclick = (e) => {
          e.stopPropagation();
          this.editingKpi = null;
          this.showFixedDrawer = !this.showFixedDrawer;
          this.render();
        };
      }

      const editBtn = topActions.createEl('button', {
        cls: 'fd-kpi-edit-btn',
        attr: { type: 'button', title: cfg.editTitle, 'aria-label': cfg.editTitle }
      });
      editBtn.appendChild(createUiSvgIcon('pencil', 12));

      const valEl = card.createDiv({
        cls: 'fd-kpi-value',
        text: `${this.plugin.settings.currency} ${cfg.value.toFixed(2)}`
      });
      if (cfg.key === 'income' && cfg.value > 0) {
        valEl.addClass('fd-income-val');
      } else if (cfg.key === 'fixed' && cfg.value > 0) {
        valEl.addClass('fd-fixed-val');
      }

      const startEdit = (e) => {
        if (e) e.stopPropagation();
        if (cfg.onPencilClick) {
          cfg.onPencilClick();
          return;
        }
        this.editingKpi = cfg.key;
        this.render();
      };
      editBtn.onclick = startEdit;
      card.onclick = startEdit;
    } else {
      const editRow = card.createDiv({ cls: 'fd-kpi-inline-edit' });
      const input = editRow.createEl('input', {
        cls: 'fd-kpi-inline-input',
        attr: {
          type: 'number',
          step: '0.01',
          min: '0',
          placeholder: '0.00',
          value: cfg.value > 0 ? String(cfg.value) : ''
        }
      });

      const actions = editRow.createDiv({ cls: 'fd-kpi-inline-actions' });
      const saveBtn = actions.createEl('button', {
        cls: 'fd-kpi-inline-btn save',
        attr: { type: 'button', title: t('saveBtn'), 'aria-label': t('saveBtn') }
      });
      saveBtn.appendChild(createUiSvgIcon('check', 13));

      const cancelBtn = actions.createEl('button', {
        cls: 'fd-kpi-inline-btn cancel',
        attr: { type: 'button', title: t('cancelBtn'), 'aria-label': t('cancelBtn') }
      });
      cancelBtn.appendChild(createUiSvgIcon('x', 13));

      const commit = async () => {
        await cfg.onSave(input.value);
      };
      const cancel = () => {
        this.editingKpi = null;
        this.render();
      };

      saveBtn.onmousedown = (e) => e.preventDefault();
      cancelBtn.onmousedown = (e) => e.preventDefault();
      saveBtn.onclick = (e) => {
        e.stopPropagation();
        return commit();
      };
      cancelBtn.onclick = (e) => {
        e.stopPropagation();
        cancel();
      };
      input.onclick = (e) => e.stopPropagation();
      input.onkeydown = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          commit();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          cancel();
        }
      };

      setTimeout(() => {
        input.focus();
        input.select();
      }, 15);
    }

    card.createDiv({
      cls: `fd-kpi-badge fd-tone-${cfg.badgeTone}`,
      text: cfg.badgeText
    });

    if (cfg.subMetricText) {
      card.createDiv({
        cls: `fd-kpi-sub-metric fd-tone-${cfg.subMetricTone || 'muted'}`,
        text: cfg.subMetricText
      });
    }

    if (cfg.barPct !== null) {
      const barBg = card.createDiv({ cls: 'fd-kpi-mini-bar' });
      const barFill = barBg.createDiv({ cls: `fd-kpi-mini-bar-fill fd-tone-${cfg.barTone}` });
      barFill.style.width = `${cfg.barPct}%`;
    }
  }

  renderFixedExpensesDrawer(parent) {
    const cur = this.plugin.settings.currency;
    const list = this.plugin.settings.fixedExpensesList || [];
    const total = list.length > 0
      ? this.plugin.computeFixedExpensesSum()
      : (Number(this.plugin.settings.monthlyFixedExpenses) || 0);

    const drawer = parent.createDiv({ cls: 'fd-fixed-drawer' });

    const header = drawer.createDiv({ cls: 'fd-fixed-drawer-header' });
    const titleWrap = header.createDiv();
    const titleEl = titleWrap.createEl('h4', { cls: 'fd-fixed-drawer-title' });
    appendIconLabel(titleEl, 'list', t('fixedDrawerTitle'), 15);
    titleWrap.createEl('p', { cls: 'fd-fixed-drawer-sub', text: t('fixedDrawerSubtitle') });

    const headerRight = header.createDiv({ cls: 'fd-fixed-drawer-right' });
    const totalBadge = headerRight.createDiv({ cls: 'fd-fixed-total-pill' });
    totalBadge.createSpan({ text: `${t('fixedDrawerTotalLabel')} ` });
    totalBadge.createEl('strong', { text: `${cur}${total.toFixed(2)}` });

    const closeBtn = headerRight.createEl('button', {
      cls: 'fd-fixed-close-btn',
      attr: { type: 'button', title: t('closeLabel'), 'aria-label': t('closeLabel') }
    });
    closeBtn.appendChild(createUiSvgIcon('x', 14));
    closeBtn.onclick = () => {
      this.showFixedDrawer = false;
      this.render();
    };

    const formRow = drawer.createDiv({ cls: 'fd-fixed-form-row' });
    const amtInput = formRow.createEl('input', {
      cls: 'fd-input fd-amount-input',
      attr: {
        type: 'number',
        step: '0.01',
        min: '0.01',
        placeholder: tf('fixedAmountPlaceholder', { cur })
      }
    });
    const conceptInput = formRow.createEl('input', {
      cls: 'fd-input',
      attr: {
        type: 'text',
        placeholder: t('fixedConceptPlaceholder')
      }
    });
    const addBtn = formRow.createEl('button', {
      cls: 'fd-submit-btn fd-fixed-add-btn',
      attr: { type: 'button' },
      text: t('fixedAddBtn')
    });

    const handleAddFixed = async () => {
      const ok = await this.plugin.addFixedExpenseItem({
        amount: amtInput.value,
        concept: conceptInput.value
      });
      if (ok) {
        amtInput.value = '';
        conceptInput.value = '';
        this.render();
      }
    };

    addBtn.onclick = handleAddFixed;
    amtInput.onkeydown = (e) => { if (e.key === 'Enter') conceptInput.focus(); };
    conceptInput.onkeydown = (e) => { if (e.key === 'Enter') handleAddFixed(); };

    const itemsWrap = drawer.createDiv({ cls: 'fd-fixed-items-list' });
    if (list.length === 0) {
      itemsWrap.createDiv({ cls: 'fd-fixed-empty', text: t('fixedEmptyHint') });
      return;
    }

    list.forEach(item => {
      const row = itemsWrap.createDiv({ cls: 'fd-fixed-item-row' });
      row.createSpan({ cls: 'fd-fixed-item-name', text: item.concept });

      const right = row.createDiv({ cls: 'fd-fixed-item-right' });
      right.createSpan({
        cls: 'fd-fixed-item-amount',
        text: `${cur}${Number(item.amount).toFixed(2)}`
      });

      const editBtn = right.createEl('button', {
        cls: 'fd-row-action-btn edit',
        attr: { type: 'button', title: t('editItemTitle'), 'aria-label': t('editItemTitle') }
      });
      editBtn.appendChild(createUiSvgIcon('pencil', 13));
      editBtn.onclick = () => {
        new EditItemModal(this.app, this.plugin, {
          mode: 'fixed',
          item,
          onDone: () => this.render()
        }).open();
      };

      const delBtn = right.createEl('button', {
        cls: 'fd-delete-btn',
        attr: { type: 'button', title: t('deleteBtn'), 'aria-label': t('deleteBtn') }
      });
      delBtn.appendChild(createUiSvgIcon('trash', 13));
      delBtn.onclick = () => {
        new ConfirmModal(this.app, {
          title: t('confirmDeleteFixedTitle'),
          message: tf('confirmDeleteFixedBody', {
            concept: item.concept,
            cur,
            amount: Number(item.amount).toFixed(2)
          }),
          confirmText: t('deleteBtn'),
          tone: 'danger',
          onConfirm: async () => {
            await this.plugin.deleteFixedExpenseItem(item.id);
            this.render();
          }
        }).open();
      };
    });
  }

  // ─── CAJA DE AHORROS (SAVINGS VAULT) ──────────────────────────────────────
  renderSavingsVault(parent) {
    const cur = this.plugin.settings.currency;
    const card = parent.createDiv({ cls: 'fd-savings-card' });

    const topRow = card.createDiv({ cls: 'fd-savings-top' });

    const identity = topRow.createDiv({ cls: 'fd-savings-identity' });
    const iconBox = identity.createDiv({ cls: 'fd-savings-icon' });
    iconBox.appendChild(createUiSvgIcon('vault', 20));

    const textWrap = identity.createDiv();
    textWrap.createEl('h3', { cls: 'fd-savings-title', text: t('savingsCardTitle') });
    textWrap.createEl('p', { cls: 'fd-savings-subtitle', text: t('savingsCardSubtitle') });

    const balanceDisplay = topRow.createDiv({ cls: 'fd-savings-balance-box' });
    balanceDisplay.createDiv({ cls: 'fd-savings-balance-label', text: t('savingsTotalLabel') });
    balanceDisplay.createDiv({
      cls: 'fd-savings-balance-val',
      text: `${cur} ${(Number(this.plugin.settings.savingsBalance) || 0).toFixed(2)}`
    });

    const actionsRow = card.createDiv({ cls: 'fd-savings-actions' });

    const depositBtn = actionsRow.createEl('button', { cls: 'fd-savings-btn deposit', attr: { type: 'button' } });
    appendIconLabel(depositBtn, 'plus', t('depositBtn'), 13);
    depositBtn.onclick = () => {
      new SavingsDepositModal(this.app, this.plugin, () => this.render()).open();
    };

    const withdrawBtn = actionsRow.createEl('button', { cls: 'fd-savings-btn withdraw', attr: { type: 'button' } });
    appendIconLabel(withdrawBtn, 'arrow-up-right', t('withdrawBtn'), 13);
    withdrawBtn.onclick = () => {
      new SavingsWithdrawModal(this.app, this.plugin, () => this.render()).open();
    };

    const goalBtn = actionsRow.createEl('button', { cls: 'fd-savings-btn goal', attr: { type: 'button' } });
    appendIconLabel(goalBtn, 'target', t('goalBtn'), 13);
    goalBtn.onclick = () => {
      new SavingsGoalModal(this.app, this.plugin, () => this.render()).open();
    };

    const histCount = (this.plugin.settings.savingsHistory || []).length;
    const historyBtn = actionsRow.createEl('button', {
      cls: `fd-savings-btn history ${this.showSavingsHistory ? 'active' : ''}`,
      attr: { type: 'button' }
    });
    appendIconLabel(historyBtn, 'list', tf('movementsBtn', { count: histCount }), 13);
    historyBtn.onclick = () => {
      this.showSavingsHistory = !this.showSavingsHistory;
      this.render();
    };

    const currentBal = Number(this.plugin.settings.savingsBalance) || 0;
    const goal = Number(this.plugin.settings.savingsGoal) || 0;

    if (goal > 0) {
      const goalBox = card.createDiv({ cls: 'fd-savings-goal-box' });
      const goalHeader = goalBox.createDiv({ cls: 'fd-savings-goal-header' });
      const pct = Math.min(100, Math.round((currentBal / goal) * 100));

      const goalLeft = goalHeader.createSpan({ cls: 'fd-inline-icon-text' });
      appendIconLabel(goalLeft, 'target', tf('goalTargetLabel', { cur, goal: goal.toFixed(2) }), 12);
      goalHeader.createSpan({
        cls: 'fd-goal-pct',
        text: tf('goalAchievedLabel', { pct, cur, bal: currentBal.toFixed(2), goal: goal.toFixed(2) })
      });

      const barBg = goalBox.createDiv({ cls: 'fd-progress-bar-bg fd-goal-bar-bg' });
      const barFill = barBg.createDiv({ cls: 'fd-progress-bar-fill fd-goal-bar-fill' });
      barFill.style.width = `${pct}%`;
    }

    if (this.showSavingsHistory) {
      const historyBox = card.createDiv({ cls: 'fd-savings-history-box' });
      const histList = this.plugin.settings.savingsHistory || [];

      if (histList.length === 0) {
        historyBox.createDiv({ cls: 'fd-empty-state', text: t('savingsHistoryEmpty') });
      } else {
        histList.slice(0, 15).forEach(entry => {
          const item = historyBox.createDiv({ cls: 'fd-savings-hist-item' });
          const left = item.createDiv({ cls: 'fd-hist-left' });
          const isDep = entry.type === 'deposit';

          const typeBadge = left.createSpan({ cls: `fd-hist-type ${isDep ? 'dep' : 'with'}` });
          appendIconLabel(typeBadge, isDep ? 'arrow-down-left' : 'arrow-up-right', isDep ? t('depositBadge') : t('withdrawBadge'), 11);

          left.createSpan({ cls: 'fd-hist-note', text: entry.note || (isDep ? t('defaultDepositNote') : t('defaultWithdrawNote')) });
          left.createSpan({ cls: 'fd-hist-date', text: `${entry.date || ''} • ${entry.time || ''}` });

          const right = item.createDiv({ cls: 'fd-hist-right' });
          right.createSpan({
            cls: `fd-hist-amount ${isDep ? 'dep' : 'with'}`,
            text: `${isDep ? '+' : '-'}${cur}${Number(entry.amount).toFixed(2)}`
          });

          const del = right.createEl('button', {
            cls: 'fd-delete-btn',
            attr: { type: 'button', title: t('deleteMovementTitle'), 'aria-label': t('deleteMovementTitle') }
          });
          del.appendChild(createUiSvgIcon('trash', 13));
          del.onclick = () => {
            new ConfirmModal(this.app, {
              title: t('confirmDeleteSavingsTitle'),
              message: tf('confirmDeleteSavingsBody', {
                note: entry.note || (isDep ? t('defaultDepositNote') : t('defaultWithdrawNote')),
                cur,
                amount: Number(entry.amount).toFixed(2)
              }),
              confirmText: t('deleteBtn'),
              tone: 'danger',
              onConfirm: async () => {
                await this.plugin.deleteSavingsHistoryEntry(entry.id);
                this.render();
              }
            }).open();
          };
        });
      }
    }
  }

  // ─── UNIFIED TOP CAPTURE (GASTO RÁPIDO / COMPRA PLANIFICADA) ────────────
  renderQuickCapture(parent) {
    const box = parent.createDiv({ cls: `fd-capture-box mode-${this.captureMode}` });
    const pendingWishCount = (this.plugin.settings.wishlist || []).filter(w => !w.bought).length;
    const cur = this.plugin.settings.currency;

    const header = box.createDiv({ cls: 'fd-capture-header' });
    const modeTabs = header.createDiv({ cls: 'fd-capture-mode-tabs' });

    const expenseTab = modeTabs.createEl('button', {
      cls: `fd-capture-mode-tab expense ${this.captureMode === 'expense' ? 'active' : ''}`,
      attr: { type: 'button' }
    });
    const expIcon = expenseTab.createSpan({ cls: 'fd-capture-tab-icon' });
    expIcon.appendChild(createUiSvgIcon('zap', 14));
    expenseTab.createSpan({ text: t('tabQuickExpense') });
    expenseTab.onclick = () => {
      if (this.captureMode !== 'expense') {
        this.captureMode = 'expense';
        this.render();
      }
    };

    const wishTab = modeTabs.createEl('button', {
      cls: `fd-capture-mode-tab wishlist ${this.captureMode === 'wishlist' ? 'active' : ''}`,
      attr: { type: 'button' }
    });
    const wishIcon = wishTab.createSpan({ cls: 'fd-capture-tab-icon' });
    wishIcon.appendChild(createUiSvgIcon('target', 14));
    wishTab.createSpan({ text: t('tabPlannedPurchase') });
    if (pendingWishCount > 0) {
      wishTab.createSpan({ cls: 'fd-capture-tab-count', text: String(pendingWishCount) });
    }
    wishTab.onclick = () => {
      if (this.captureMode !== 'wishlist') {
        this.captureMode = 'wishlist';
        this.render();
      }
    };

    const isWishMode = this.captureMode === 'wishlist';
    this.renderCategorySelectorBlock(box, header, {
      pillModeKey: isWishMode ? 'wishlistPillMode' : 'quickExpensePillMode',
      getSelectedCat: () => (isWishMode ? this.selectedWishCat : this.selectedFormCat),
      setSelectedCat: (id) => {
        if (isWishMode) {
          this.selectedWishCat = id;
        } else {
          this.selectedFormCat = id;
        }
      }
    });

    const inputsRow = box.createDiv({ cls: 'fd-capture-inputs' });
    const amountInput = inputsRow.createEl('input', {
      cls: 'fd-input fd-amount-input',
      attr: {
        type: 'number',
        step: '0.01',
        min: '0.01',
        placeholder: isWishMode
          ? tf('pricePlaceholder', { cur })
          : tf('amountPlaceholder', { cur })
      }
    });

    const conceptInput = inputsRow.createEl('input', {
      cls: 'fd-input',
      attr: {
        type: 'text',
        placeholder: isWishMode ? t('wishConceptPlaceholder') : t('expenseConceptPlaceholder')
      }
    });

    const submitBtn = inputsRow.createEl('button', {
      cls: isWishMode ? 'fd-submit-btn fd-wish-add-btn' : 'fd-submit-btn',
      text: isWishMode ? t('addWishBtn') : t('registerExpenseBtn')
    });

    const handleSubmit = async () => {
      const val = amountInput.value;
      const conc = conceptInput.value;
      if (isWishMode) {
        const res = await this.plugin.addWishlistItem({
          amount: val,
          concept: conc,
          categoryId: this.selectedWishCat
        });
        if (res) {
          amountInput.value = '';
          conceptInput.value = '';
          this.render();
        }
      } else {
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
      }
    };

    submitBtn.onclick = handleSubmit;
    conceptInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSubmit();
    });
    amountInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') conceptInput.focus();
    });
  }

  renderCategorySelectorBlock(box, headerContainer, opts) {
    const modeSwitch = headerContainer.createDiv({ cls: 'fd-pill-mode-switch' });
    const currentMode = this.plugin.settings[opts.pillModeKey] || 'full';

    const fullBtn = modeSwitch.createEl('button', {
      cls: `fd-pill-mode-btn ${currentMode === 'full' ? 'active' : ''}`,
      attr: { type: 'button', title: t('pillModeFullTitle') },
      text: `🩺 ${t('catSalud')}`
    });

    const emojiBtn = modeSwitch.createEl('button', {
      cls: `fd-pill-mode-btn ${currentMode === 'emoji' ? 'active' : ''}`,
      attr: { type: 'button', title: t('pillModeEmojiTitle') },
      text: '🩺'
    });

    const catSelector = box.createDiv({ cls: `fd-category-selector ${currentMode === 'emoji' ? 'emoji-only' : ''}` });

    const updatePills = () => {
      catSelector.empty();
      const mode = this.plugin.settings[opts.pillModeKey] || 'full';
      if (mode === 'emoji') {
        catSelector.addClass('emoji-only');
      } else {
        catSelector.removeClass('emoji-only');
      }

      const activeId = opts.getSelectedCat();
      CATEGORIES.forEach(c => {
        const isSelected = activeId === c.id;
        const pill = catSelector.createEl('button', {
          cls: `fd-cat-pill ${mode === 'emoji' ? 'emoji-only' : ''} ${isSelected ? 'selected' : ''}`,
          attr: {
            type: 'button',
            title: `${c.icon} ${c.name}`
          }
        });
        pill.style.borderColor = isSelected ? c.color : 'var(--background-modifier-border)';
        pill.style.background = isSelected ? c.color : 'var(--background-primary)';

        const iconSpan = pill.createSpan({ cls: 'fd-pill-icon' });
        iconSpan.setText(c.icon);

        if (mode === 'full') {
          const nameSpan = pill.createSpan({ cls: 'fd-pill-name' });
          nameSpan.setText(c.name);
        }

        pill.onclick = () => {
          opts.setSelectedCat(c.id);
          updatePills();
        };
      });
    };

    fullBtn.onclick = async () => {
      if (this.plugin.settings[opts.pillModeKey] !== 'full') {
        this.plugin.settings[opts.pillModeKey] = 'full';
        await this.plugin.saveSettings();
        fullBtn.addClass('active');
        emojiBtn.removeClass('active');
        updatePills();
      }
    };

    emojiBtn.onclick = async () => {
      if (this.plugin.settings[opts.pillModeKey] !== 'emoji') {
        this.plugin.settings[opts.pillModeKey] = 'emoji';
        await this.plugin.saveSettings();
        emojiBtn.addClass('active');
        fullBtn.removeClass('active');
        updatePills();
      }
    };

    updatePills();
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
    CATEGORIES.forEach(c => { totals[c.id] = 0; });
    txs.forEach(tx => {
      totals[tx.categoryId] = (totals[tx.categoryId] || 0) + Number(tx.amount);
    });

    const grandTotal = txs.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
    const maxVal = Math.max(...Object.values(totals), 1);

    const size = 380;
    const cx = size / 2;
    const cy = size / 2;
    const rInner = 60;
    const rBaseOuter = 120;
    const maxExtra = 35;

    const svg = document.createElementNS(SVG_NS, 'svg');
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

      const path = document.createElementNS(SVG_NS, 'path');
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
      const titleEl = document.createElementNS(SVG_NS, 'title');
      titleEl.textContent = `${c.icon} ${c.name}: ${this.plugin.settings.currency}${catSpent.toFixed(2)} (${catPct}%)`;
      path.appendChild(titleEl);

      svg.appendChild(path);

      const midDeg = (startDeg + endDeg) / 2;
      const midRad = (midDeg * Math.PI) / 180;
      const iconDist = rInner + (rOuter - rInner) * 0.55;
      const ix = cx + iconDist * Math.cos(midRad);
      const iy = cy + iconDist * Math.sin(midRad);

      const text = document.createElementNS(SVG_NS, 'text');
      text.setAttribute('x', ix);
      text.setAttribute('y', iy);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'central');
      text.setAttribute('font-size', '13');
      text.setAttribute('pointer-events', 'none');
      text.textContent = c.icon;
      svg.appendChild(text);
    });

    const centerCircle = document.createElementNS(SVG_NS, 'circle');
    centerCircle.setAttribute('cx', cx);
    centerCircle.setAttribute('cy', cy);
    centerCircle.setAttribute('r', rInner - 4);
    centerCircle.setAttribute('fill', 'var(--background-primary)');
    centerCircle.setAttribute('stroke', 'var(--background-modifier-border)');
    centerCircle.setAttribute('stroke-width', '2');
    svg.appendChild(centerCircle);

    const centerAmount = document.createElementNS(SVG_NS, 'text');
    centerAmount.setAttribute('x', cx);
    centerAmount.setAttribute('y', cy - 5);
    centerAmount.setAttribute('text-anchor', 'middle');
    centerAmount.setAttribute('fill', 'var(--text-normal)');
    centerAmount.setAttribute('font-size', '14');
    centerAmount.setAttribute('font-weight', 'bold');
    centerAmount.setAttribute('font-family', 'var(--font-monospace)');
    centerAmount.textContent = `${this.plugin.settings.currency}${grandTotal.toFixed(0)}`;
    svg.appendChild(centerAmount);

    const centerLabel = document.createElementNS(SVG_NS, 'text');
    centerLabel.setAttribute('x', cx);
    centerLabel.setAttribute('y', cy + 14);
    centerLabel.setAttribute('text-anchor', 'middle');
    centerLabel.setAttribute('fill', 'var(--text-muted)');
    centerLabel.setAttribute('font-size', '9');
    centerLabel.setAttribute('text-transform', 'uppercase');
    centerLabel.setAttribute('letter-spacing', '0.05em');
    centerLabel.textContent = this.selectedCatFilter ? t('wheelFilteredLabel') : t('wheelTotalLabel');
    svg.appendChild(centerLabel);

    card.appendChild(svg);

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
    const counts = {};
    CATEGORIES.forEach(c => {
      totals[c.id] = 0;
      counts[c.id] = 0;
    });

    txs.forEach(tx => {
      totals[tx.categoryId] = (totals[tx.categoryId] || 0) + Number(tx.amount);
      counts[tx.categoryId] = (counts[tx.categoryId] || 0) + 1;
    });

    const grandTotal = txs.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

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
      footer.createSpan({ text: tf('quadSpentCount', { count }) });
      footer.createSpan({ text: tf('quadPctOfTotal', { pct }) });
    });
  }

  // ─── WISHLIST & COMPRAS PLANIFICADAS ACUMULADAS (8 CUADRANTES) ───────────
  renderWishlist(parent) {
    const cur = this.plugin.settings.currency;
    const box = parent.createDiv({ cls: 'fd-wishlist-box' });

    const header = box.createDiv({ cls: 'fd-wishlist-header' });
    const titleGroup = header.createDiv({ cls: 'fd-wishlist-title-group' });
    const title = titleGroup.createEl('h3', { cls: 'fd-wishlist-title' });
    appendIconLabel(title, 'target', t('wishlistHeaderTitle'), 16);
    titleGroup.createEl('p', { cls: 'fd-wishlist-subtitle', text: t('wishlistHeaderSubtitle') });

    const wishlist = this.plugin.settings.wishlist || [];
    const pendingItems = wishlist.filter(w => !w.bought);
    const boughtItems = wishlist.filter(w => w.bought);
    const pendingTotal = pendingItems.reduce((acc, w) => acc + (Number(w.amount) || 0), 0);
    const boughtTotal = boughtItems.reduce((acc, w) => acc + (Number(w.amount) || 0), 0);

    const statsRow = header.createDiv({ cls: 'fd-wishlist-stats' });
    const pBadge = statsRow.createDiv({ cls: 'fd-wish-stat-pill pending' });
    appendIconLabel(pBadge, 'hourglass', `${t('wishPendingStat')} `, 12);
    pBadge.createEl('strong', { text: `${cur}${pendingTotal.toFixed(2)} (${pendingItems.length})` });

    const bBadge = statsRow.createDiv({ cls: 'fd-wish-stat-pill bought' });
    appendIconLabel(bBadge, 'check-circle', `${t('wishInWheelStat')} `, 12);
    bBadge.createEl('strong', { text: `${cur}${boughtTotal.toFixed(2)} (${boughtItems.length})` });

    const toolbar = box.createDiv({ cls: 'fd-wishlist-toolbar' });

    const sortGroup = toolbar.createDiv({ cls: 'fd-toolbar-group' });
    sortGroup.createSpan({ cls: 'fd-toolbar-label', text: t('sortByLabel') });

    const currentSort = this.wishlistSort || this.plugin.settings.wishlistSort || 'desc';
    const sortOptions = [
      { key: 'desc', icon: 'arrow-down', label: t('sortDesc') },
      { key: 'asc', icon: 'arrow-up', label: t('sortAsc') },
      { key: 'recent', icon: 'clock', label: t('sortRecent') },
      { key: 'category', icon: 'tag', label: t('sortCategory') }
    ];

    sortOptions.forEach(opt => {
      const isAct = currentSort === opt.key;
      const sBtn = sortGroup.createEl('button', {
        cls: `fd-sort-btn ${isAct ? 'active' : ''}`,
        attr: { type: 'button' }
      });
      appendIconLabel(sBtn, opt.icon, opt.label, 12);
      sBtn.onclick = async () => {
        this.wishlistSort = opt.key;
        this.plugin.settings.wishlistSort = opt.key;
        await this.plugin.saveSettings();
        this.render();
      };
    });

    const searchGroup = toolbar.createDiv({ cls: 'fd-toolbar-group fd-wishlist-search-wrap' });
    const searchIcon = searchGroup.createSpan({ cls: 'fd-wishlist-search-icon' });
    searchIcon.appendChild(createUiSvgIcon('search', 14));

    const searchInput = searchGroup.createEl('input', {
      cls: 'fd-wishlist-search-input',
      attr: {
        type: 'text',
        placeholder: t('wishlistSearchPlaceholder'),
        value: this.wishlistSearchQuery || ''
      }
    });

    const clearSearchBtn = searchGroup.createEl('button', {
      cls: `fd-wishlist-search-clear ${this.wishlistSearchQuery ? 'visible' : ''}`,
      attr: { type: 'button', title: t('clearSearchTitle'), 'aria-label': t('clearSearchTitle') }
    });
    clearSearchBtn.appendChild(createUiSvgIcon('x', 12));

    searchInput.oninput = (e) => {
      this.wishlistSearchQuery = e.target.value.trim().toLowerCase();
      if (this.wishlistSearchQuery) {
        clearSearchBtn.addClass('visible');
      } else {
        clearSearchBtn.removeClass('visible');
      }
      this.renderWishlistItems(itemsContainer);
    };

    clearSearchBtn.onclick = () => {
      this.wishlistSearchQuery = '';
      searchInput.value = '';
      clearSearchBtn.removeClass('visible');
      this.renderWishlistItems(itemsContainer);
      searchInput.focus();
    };

    const filterGroup = toolbar.createDiv({ cls: 'fd-toolbar-group' });
    filterGroup.createSpan({ cls: 'fd-toolbar-label', text: t('viewFilterLabel') });

    let currentF = this.wishlistFilter || this.plugin.settings.wishlistFilter || 'pending';
    if (currentF === 'all') currentF = 'pending';

    const filterTabs = [
      { key: 'pending', icon: 'hourglass', label: tf('viewPendingTab', { count: pendingItems.length }) },
      { key: 'bought', icon: 'check-circle', label: tf('viewBoughtTab', { count: boughtItems.length }) }
    ];

    filterTabs.forEach(f => {
      const isAct = currentF === f.key;
      const fBtn = filterGroup.createEl('button', {
        cls: `fd-filter-chip ${isAct ? 'active' : ''}`,
        attr: { type: 'button' }
      });
      appendIconLabel(fBtn, f.icon, f.label, 12);
      fBtn.onclick = async () => {
        this.wishlistFilter = f.key;
        this.plugin.settings.wishlistFilter = f.key;
        await this.plugin.saveSettings();
        this.render();
      };
    });

    const itemsContainer = box.createDiv({ cls: 'fd-wishlist-items' });
    this.renderWishlistItems(itemsContainer);
  }

  renderWishlistItems(container) {
    container.empty();
    const cur = this.plugin.settings.currency;

    let list = [...(this.plugin.settings.wishlist || [])];
    let f = this.wishlistFilter || this.plugin.settings.wishlistFilter || 'pending';
    if (f === 'all') f = 'pending';

    if (f === 'pending') {
      list = list.filter(w => !w.bought);
    } else if (f === 'bought') {
      list = list.filter(w => w.bought);
    }

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

    if (this.wishlistSearchQuery) {
      const q = this.wishlistSearchQuery.toLowerCase();
      list = list.filter(w => {
        const conc = (w.concept || '').toLowerCase();
        const cat = CATEGORIES.find(c => c.id === w.categoryId);
        const catName = (cat ? cat.name : (w.categoryName || '')).toLowerCase();
        return conc.includes(q) || catName.includes(q);
      });
    }

    if (list.length === 0) {
      const empty = container.createDiv({ cls: 'fd-empty-state' });
      if (this.wishlistSearchQuery) {
        empty.setText(tf('wishEmptySearch', { query: this.wishlistSearchQuery }));
      } else if (f === 'pending') {
        empty.setText(t('wishEmptyPending'));
      } else {
        empty.setText(t('wishEmptyBought'));
      }
      return;
    }

    const savingsBal = Number(this.plugin.settings.savingsBalance) || 0;
    const income = Number(this.plugin.settings.currentIncome) || 0;
    const fixedList = this.plugin.settings.fixedExpensesList || [];
    const fixed = fixedList.length > 0
      ? this.plugin.computeFixedExpensesSum()
      : (Number(this.plugin.settings.monthlyFixedExpenses) || 0);
    const freeAfterFixed = income - fixed;

    list.forEach(item => {
      const cat = CATEGORIES.find(c => c.id === item.categoryId) || CATEGORIES[0];
      const isBought = !!item.bought;
      const itemAmt = Number(item.amount) || 0;

      const row = container.createDiv({
        cls: `fd-wish-item ${isBought ? 'bought' : 'pending'}`
      });

      const left = row.createDiv({ cls: 'fd-wish-left' });

      if (!isBought) {
        const chkWrap = left.createDiv({ cls: 'fd-chk-wrapper' });
        const chk = chkWrap.createEl('input', {
          cls: 'fd-wish-checkbox',
          attr: {
            type: 'checkbox',
            title: t('chkBuyTitle')
          }
        });
        chk.checked = false;

        chk.onchange = async () => {
          await this.plugin.toggleWishlistItem(item.id);
          this.render();
        };
      } else {
        const iconWrap = left.createDiv({ cls: 'fd-chk-wrapper fd-chk-done-icon' });
        iconWrap.appendChild(createUiSvgIcon('check-circle', 16));
      }

      const badge = left.createDiv({ cls: 'fd-wish-cat-badge' });
      badge.style.background = cat.color + '22';
      badge.style.color = cat.color;
      badge.style.border = `1px solid ${cat.color}55`;
      badge.setText(`${cat.icon} ${cat.name}`);

      const textWrap = left.createDiv({ cls: 'fd-wish-text-wrap' });
      textWrap.createDiv({
        cls: `fd-wish-concept ${isBought ? 'concept-bought' : ''}`,
        text: item.concept
      });

      const metaEl = textWrap.createDiv({ cls: 'fd-wish-meta' });
      if (isBought) {
        const boughtKey = item.paidFromSavings ? 'wishStatusBoughtSavings' : 'wishStatusBought';
        metaEl.createSpan({
          cls: 'fd-status-badge in-wheel',
          text: tf(boughtKey, { date: item.boughtDate || '' })
        });
      } else {
        metaEl.createSpan({ cls: 'fd-status-badge pending', text: t('wishStatusPending') });

        if (income > 0 && freeAfterFixed >= itemAmt) {
          const affBadge = metaEl.createSpan({ cls: 'fd-afford-badge margin' });
          appendIconLabel(affBadge, 'check-circle', t('affordMarginBadge'), 10);
        } else if (savingsBal > 0 && savingsBal >= itemAmt) {
          const affBadge = metaEl.createSpan({ cls: 'fd-afford-badge savings' });
          appendIconLabel(affBadge, 'vault', t('affordSavingsBadge'), 10);
        }
      }

      const right = row.createDiv({ cls: 'fd-wish-right' });
      right.createDiv({
        cls: `fd-wish-amount ${isBought ? 'amt-bought' : ''}`,
        text: `${cur}${itemAmt.toFixed(2)}`
      });

      if (!isBought && savingsBal >= itemAmt && itemAmt > 0) {
        const savBuyBtn = right.createEl('button', {
          cls: 'fd-use-savings-btn',
          attr: { type: 'button', title: t('useSavingsTitle') }
        });
        appendIconLabel(savBuyBtn, 'wallet', t('useSavingsBtn'), 11);
        savBuyBtn.onclick = () => {
          new ConfirmModal(this.app, {
            title: t('confirmUseSavingsTitle'),
            message: tf('confirmUseSavingsBody', {
              concept: item.concept,
              cur,
              amount: itemAmt.toFixed(2)
            }),
            confirmText: t('useSavingsBtn'),
            tone: 'accent',
            onConfirm: async () => {
              await this.plugin.purchaseWishlistWithSavings(item.id);
              this.render();
            }
          }).open();
        };
      }

      if (isBought) {
        const restoreBtn = right.createEl('button', {
          cls: 'fd-restore-btn',
          attr: { type: 'button', title: t('returnWishTitle') }
        });
        appendIconLabel(restoreBtn, 'rotate-ccw', t('returnWishBtn'), 11);
        restoreBtn.onclick = async () => {
          await this.plugin.toggleWishlistItem(item.id);
          this.render();
        };
      }

      const editBtn = right.createEl('button', {
        cls: 'fd-row-action-btn edit',
        attr: { type: 'button', title: t('editItemTitle'), 'aria-label': t('editItemTitle') }
      });
      editBtn.appendChild(createUiSvgIcon('pencil', 13));
      editBtn.onclick = () => {
        new EditItemModal(this.app, this.plugin, {
          mode: 'wishlist',
          item,
          onDone: () => this.render()
        }).open();
      };

      const delBtn = right.createEl('button', {
        cls: 'fd-delete-btn',
        attr: { type: 'button', title: t('deleteWishTitle'), 'aria-label': t('deleteWishTitle') }
      });
      delBtn.appendChild(createUiSvgIcon('trash', 13));
      delBtn.onclick = () => {
        new ConfirmModal(this.app, {
          title: t('confirmDeleteWishTitle'),
          message: tf('confirmDeleteWishBody', {
            concept: item.concept,
            cur,
            amount: itemAmt.toFixed(2)
          }),
          confirmText: t('deleteBtn'),
          tone: 'danger',
          onConfirm: async () => {
            await this.plugin.deleteWishlistItem(item.id);
            this.render();
          }
        }).open();
      };
    });
  }

  // ─── LEDGER (HISTORIAL DE GASTOS) ────────────────────────────────────────
  renderLedger(parent, txs) {
    const box = parent.createDiv({ cls: 'fd-ledger-box' });

    const header = box.createDiv({ cls: 'fd-ledger-header' });
    const title = header.createDiv({ cls: 'fd-ledger-title' });
    const filterCatObj = CATEGORIES.find(c => c.id === this.selectedCatFilter);
    const titleLabel = filterCatObj
      ? tf('ledgerTitleFiltered', { icon: filterCatObj.icon, name: filterCatObj.name })
      : t('ledgerTitleDefault');
    appendIconLabel(title, 'list', titleLabel, 15);

    const searchWrap = header.createDiv({ cls: 'fd-ledger-search-wrap' });
    const searchIcon = searchWrap.createSpan({ cls: 'fd-ledger-search-icon' });
    searchIcon.appendChild(createUiSvgIcon('search', 14));

    const searchInput = searchWrap.createEl('input', {
      cls: 'fd-search-input',
      attr: {
        type: 'text',
        placeholder: t('ledgerSearchPlaceholder')
      }
    });
    searchInput.value = this.searchQuery;

    const clearBtn = searchWrap.createEl('button', {
      cls: `fd-wishlist-search-clear ${this.searchQuery ? 'visible' : ''}`,
      attr: { type: 'button', title: t('clearSearchTitle'), 'aria-label': t('clearSearchTitle') }
    });
    clearBtn.appendChild(createUiSvgIcon('x', 12));

    searchInput.oninput = (e) => {
      this.searchQuery = e.target.value;
      if (this.searchQuery.trim()) {
        clearBtn.addClass('visible');
      } else {
        clearBtn.removeClass('visible');
      }
      this.renderLedgerList(listWrap, txs);
    };

    clearBtn.onclick = () => {
      this.searchQuery = '';
      searchInput.value = '';
      clearBtn.removeClass('visible');
      this.renderLedgerList(listWrap, txs);
      searchInput.focus();
    };

    const listWrap = box.createDiv({ cls: 'fd-ledger-list' });
    this.renderLedgerList(listWrap, txs);
  }

  renderLedgerList(parent, txs) {
    parent.empty();
    const cur = this.plugin.settings.currency;

    let displayList = [...txs];

    if (this.selectedCatFilter) {
      displayList = displayList.filter(tx => tx.categoryId === this.selectedCatFilter);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      displayList = displayList.filter(tx =>
        (tx.concept && tx.concept.toLowerCase().includes(q)) ||
        (tx.categoryName && tx.categoryName.toLowerCase().includes(q)) ||
        String(tx.amount).includes(q)
      );
    }

    if (displayList.length === 0) {
      const empty = parent.createDiv({ cls: 'fd-empty-state' });
      empty.setText(t('ledgerEmpty'));
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

      const dateText = textWrap.createDiv({ cls: 'fd-item-date' });
      const suffixParts = [];
      if (item.isFromWishlist) suffixParts.push(t('ledgerFromWishlist'));
      if (item.paidFromSavings) suffixParts.push(t('ledgerPaidSavings'));
      const suffix = suffixParts.length > 0 ? ` (${suffixParts.join(' • ')})` : '';
      dateText.setText(`${item.date} • ${item.time}${suffix}`);

      const right = row.createDiv({ cls: 'fd-item-right' });
      right.createDiv({ cls: 'fd-item-amount', text: `-${cur}${Number(item.amount).toFixed(2)}` });

      const editBtn = right.createEl('button', {
        cls: 'fd-row-action-btn edit',
        attr: { type: 'button', title: t('editItemTitle'), 'aria-label': t('editItemTitle') }
      });
      editBtn.appendChild(createUiSvgIcon('pencil', 13));
      editBtn.onclick = () => {
        new EditItemModal(this.app, this.plugin, {
          mode: 'expense',
          item,
          onDone: () => this.render()
        }).open();
      };

      const delBtn = right.createEl('button', {
        cls: 'fd-delete-btn',
        attr: { type: 'button', title: t('deleteExpenseTitle'), 'aria-label': t('deleteExpenseTitle') }
      });
      delBtn.appendChild(createUiSvgIcon('trash', 13));
      delBtn.onclick = () => {
        new ConfirmModal(this.app, {
          title: t('confirmDeleteExpenseTitle'),
          message: tf('confirmDeleteExpenseBody', {
            concept: item.concept,
            cur,
            amount: Number(item.amount).toFixed(2)
          }),
          confirmText: t('deleteBtn'),
          tone: 'danger',
          onConfirm: async () => {
            await this.plugin.deleteExpense(item.id);
            this.render();
          }
        }).open();
      };
    });
  }

  getFilteredTransactions() {
    const list = this.plugin.settings.transactions || [];
    const now = new Date();
    const todayStr = getLocalDateStr(now);

    if (this.currentFilter === 'hoy') {
      return list.filter(tx => tx.date === todayStr);
    }

    if (this.currentFilter === 'semana') {
      const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
      const minDateStr = getLocalDateStr(startDate);
      return list.filter(tx => (tx.date || '') >= minDateStr);
    }

    if (this.currentFilter === 'mes') {
      const currentYearMonth = todayStr.substring(0, 7);
      return list.filter(tx => (tx.date || '').startsWith(currentYearMonth));
    }

    return list;
  }
}

// ─── MODALES ───────────────────────────────────────────────────────────────

// Confirmación Oscura Nativa (reemplaza window.confirm)
class ConfirmModal extends obsidian.Modal {
  constructor(app, { title, message, confirmText, tone = 'danger', onConfirm }) {
    super(app);
    this.title = title;
    this.message = message;
    this.confirmText = confirmText || t('confirmBtn');
    this.tone = tone;
    this.onConfirm = onConfirm;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('fd-modal', 'fd-confirm-modal');

    const header = contentEl.createEl('h3', { cls: 'fd-modal-header' });
    appendIconLabel(header, this.tone === 'danger' ? 'alert' : 'wallet', this.title, 18);

    contentEl.createEl('p', {
      cls: 'fd-confirm-message',
      text: this.message
    });

    const actions = contentEl.createDiv({ cls: 'fd-confirm-actions' });
    const cancelBtn = actions.createEl('button', {
      cls: 'fd-confirm-cancel-btn',
      attr: { type: 'button' },
      text: t('cancelBtn')
    });

    const okBtn = actions.createEl('button', {
      cls: `fd-confirm-ok-btn ${this.tone === 'danger' ? 'danger' : 'accent'}`,
      attr: { type: 'button' },
      text: this.confirmText
    });

    const doConfirm = async () => {
      okBtn.disabled = true;
      this.close();
      if (this.onConfirm) {
        await this.onConfirm();
      }
    };

    cancelBtn.onclick = () => this.close();
    okBtn.onclick = doConfirm;
    contentEl.onkeydown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        doConfirm();
      }
    };

    setTimeout(() => okBtn.focus(), 30);
  }

  onClose() {
    this.contentEl.empty();
  }
}

// Modal de Edición (Gasto / Compra Planificada / Gasto Fijo)
class EditItemModal extends obsidian.Modal {
  constructor(app, plugin, { mode, item, onDone }) {
    super(app);
    this.plugin = plugin;
    this.mode = mode; // 'expense' | 'wishlist' | 'fixed'
    this.item = item;
    this.onDone = onDone;
    this.selectedCat = item.categoryId || CATEGORIES[0].id;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('fd-modal');

    const titleMap = {
      expense: t('modalEditExpenseTitle'),
      wishlist: t('modalEditWishTitle'),
      fixed: t('modalEditFixedTitle')
    };
    const header = contentEl.createEl('h3', { cls: 'fd-modal-header' });
    appendIconLabel(header, 'pencil', titleMap[this.mode] || t('editItemTitle'), 17);

    if (this.mode !== 'fixed') {
      renderModalCategoryPills(contentEl, this.selectedCat, (catId) => {
        this.selectedCat = catId;
      });
    }

    const cur = this.plugin.settings.currency;
    const amountInput = contentEl.createEl('input', {
      cls: 'fd-input fd-amount-input',
      attr: {
        type: 'number',
        step: '0.01',
        min: '0.01',
        placeholder: tf('amountPlaceholder', { cur }),
        value: String(this.item.amount ?? ''),
        style: 'width: 100%; margin-top: 8px;'
      }
    });

    const conceptInput = contentEl.createEl('input', {
      cls: 'fd-input',
      attr: {
        type: 'text',
        placeholder: t('modalEditConceptPlaceholder'),
        value: String(this.item.concept || ''),
        style: 'width: 100%; margin-top: 8px;'
      }
    });

    const actions = contentEl.createDiv({ cls: 'fd-confirm-actions' });
    const cancelBtn = actions.createEl('button', {
      cls: 'fd-confirm-cancel-btn',
      attr: { type: 'button' },
      text: t('cancelBtn')
    });
    const saveBtn = actions.createEl('button', {
      cls: this.mode === 'wishlist' ? 'fd-submit-btn fd-wish-add-btn' : 'fd-submit-btn',
      attr: { type: 'button' },
      text: t('saveChangesBtn')
    });

    const doSave = async () => {
      let ok = false;
      if (this.mode === 'expense') {
        ok = await this.plugin.editExpense(this.item.id, {
          amount: amountInput.value,
          concept: conceptInput.value,
          categoryId: this.selectedCat
        });
      } else if (this.mode === 'wishlist') {
        ok = await this.plugin.editWishlistItem(this.item.id, {
          amount: amountInput.value,
          concept: conceptInput.value,
          categoryId: this.selectedCat
        });
      } else if (this.mode === 'fixed') {
        ok = await this.plugin.editFixedExpenseItem(this.item.id, {
          amount: amountInput.value,
          concept: conceptInput.value
        });
      }
      if (ok) {
        this.close();
        if (this.onDone) this.onDone();
      }
    };

    cancelBtn.onclick = () => this.close();
    saveBtn.onclick = doSave;
    amountInput.onkeydown = (e) => { if (e.key === 'Enter') conceptInput.focus(); };
    conceptInput.onkeydown = (e) => { if (e.key === 'Enter') doSave(); };

    setTimeout(() => {
      conceptInput.focus();
      conceptInput.select();
    }, 30);
  }

  onClose() {
    this.contentEl.empty();
  }
}

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
    appendIconLabel(title, 'zap', t('modalQuickExpenseTitle'), 17);

    renderModalCategoryPills(contentEl, this.selectedCat, (catId) => {
      this.selectedCat = catId;
    });

    const amountInput = contentEl.createEl('input', {
      cls: 'fd-input fd-amount-input',
      attr: {
        type: 'number',
        step: '0.01',
        min: '0.01',
        placeholder: tf('amountPlaceholder', { cur: this.plugin.settings.currency }),
        style: 'width: 100%; margin-top: 8px;'
      }
    });

    const conceptInput = contentEl.createEl('input', {
      cls: 'fd-input',
      attr: {
        type: 'text',
        placeholder: t('modalQuickExpenseConcept'),
        style: 'width: 100%; margin-top: 8px;'
      }
    });

    const submitBtn = contentEl.createEl('button', {
      cls: 'fd-submit-btn',
      text: t('modalQuickExpenseSubmit'),
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
        this.plugin.refreshOpenViews();
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
    appendIconLabel(title, 'target', t('modalQuickWishTitle'), 17);

    renderModalCategoryPills(contentEl, this.selectedCat, (catId) => {
      this.selectedCat = catId;
    });

    const amountInput = contentEl.createEl('input', {
      cls: 'fd-input fd-amount-input',
      attr: {
        type: 'number',
        step: '0.01',
        min: '0.01',
        placeholder: tf('modalQuickWishPrice', { cur: this.plugin.settings.currency }),
        style: 'width: 100%; margin-top: 8px;'
      }
    });

    const conceptInput = contentEl.createEl('input', {
      cls: 'fd-input',
      attr: {
        type: 'text',
        placeholder: t('modalQuickWishConcept'),
        style: 'width: 100%; margin-top: 8px;'
      }
    });

    const submitBtn = contentEl.createEl('button', {
      cls: 'fd-submit-btn fd-wish-add-btn',
      text: t('modalQuickWishSubmit'),
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
        this.plugin.refreshOpenViews();
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

    const header = contentEl.createEl('h3', { cls: 'fd-modal-header' });
    appendIconLabel(header, 'vault', t('modalDepositTitle'), 17);

    const currentBal = Number(this.plugin.settings.savingsBalance) || 0;
    contentEl.createDiv({
      text: tf('modalDepositBalance', {
        cur: this.plugin.settings.currency,
        bal: currentBal.toFixed(2)
      }),
      attr: { style: 'font-size: 13px; color: #10B981; font-weight: 600;' }
    });

    const amountInput = contentEl.createEl('input', {
      cls: 'fd-input fd-amount-input',
      attr: {
        type: 'number',
        step: '0.01',
        min: '0.01',
        placeholder: tf('modalDepositAmount', { cur: this.plugin.settings.currency }),
        style: 'width: 100%; margin-top: 10px;'
      }
    });

    const noteInput = contentEl.createEl('input', {
      cls: 'fd-input',
      attr: {
        type: 'text',
        placeholder: t('modalDepositNote'),
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
      text: t('modalDepositAsExpense'),
      attr: { for: 'fd-sav-as-expense', style: 'font-size: 12px; color: var(--text-muted); cursor: pointer;' }
    });

    const submitBtn = contentEl.createEl('button', {
      cls: 'fd-submit-btn',
      text: t('modalDepositSubmit'),
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

    const header = contentEl.createEl('h3', { cls: 'fd-modal-header' });
    appendIconLabel(header, 'arrow-up-right', t('modalWithdrawTitle'), 17);

    const currentBal = Number(this.plugin.settings.savingsBalance) || 0;
    contentEl.createDiv({
      text: tf('modalWithdrawBalance', {
        cur: this.plugin.settings.currency,
        bal: currentBal.toFixed(2)
      }),
      attr: { style: 'font-size: 13px; color: var(--text-muted);' }
    });

    const amountInput = contentEl.createEl('input', {
      cls: 'fd-input fd-amount-input',
      attr: {
        type: 'number',
        step: '0.01',
        min: '0.01',
        max: String(currentBal),
        placeholder: tf('modalWithdrawAmount', { cur: this.plugin.settings.currency }),
        style: 'width: 100%; margin-top: 10px;'
      }
    });

    const noteInput = contentEl.createEl('input', {
      cls: 'fd-input',
      attr: {
        type: 'text',
        placeholder: t('modalWithdrawNote'),
        style: 'width: 100%; margin-top: 10px;'
      }
    });

    const submitBtn = contentEl.createEl('button', {
      cls: 'fd-submit-btn fd-withdraw-btn',
      text: t('modalWithdrawSubmit'),
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

    const header = contentEl.createEl('h3', { cls: 'fd-modal-header' });
    appendIconLabel(header, 'target', t('modalGoalTitle'), 17);

    contentEl.createDiv({
      text: t('modalGoalDesc'),
      attr: { style: 'font-size: 13px; color: var(--text-muted); margin-bottom: 8px;' }
    });

    const goalInput = contentEl.createEl('input', {
      cls: 'fd-input fd-amount-input',
      attr: {
        type: 'number',
        step: '1',
        min: '0',
        placeholder: tf('modalGoalPlaceholder', { cur: this.plugin.settings.currency }),
        value: this.plugin.settings.savingsGoal > 0 ? this.plugin.settings.savingsGoal : '',
        style: 'width: 100%;'
      }
    });

    const submitBtn = contentEl.createEl('button', {
      cls: 'fd-submit-btn',
      text: t('modalGoalSubmit'),
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

    containerEl.createEl('h2', { text: t('settingsTitle') });

    new obsidian.Setting(containerEl)
      .setName(t('settingsCurrencyName'))
      .setDesc(t('settingsCurrencyDesc'))
      .addText(text => text
        .setPlaceholder('$')
        .setValue(this.plugin.settings.currency)
        .onChange(async (val) => {
          this.plugin.settings.currency = val.trim() || '$';
          await this.plugin.saveSettings();
          this.plugin.refreshOpenViews();
        }));

    new obsidian.Setting(containerEl)
      .setName(t('settingsGoalName'))
      .setDesc(t('settingsGoalDesc'))
      .addText(text => text
        .setPlaceholder('500')
        .setValue(String(this.plugin.settings.savingsGoal || ''))
        .onChange(async (val) => {
          this.plugin.settings.savingsGoal = Math.max(0, parseFloat(val) || 0);
          await this.plugin.saveSettings();
          this.plugin.refreshOpenViews();
        }));

    new obsidian.Setting(containerEl)
      .setName(t('settingsIncomeName'))
      .setDesc(t('settingsIncomeDesc'))
      .addText(text => text
        .setPlaceholder('0.00')
        .setValue(String(this.plugin.settings.currentIncome || ''))
        .onChange(async (val) => {
          this.plugin.settings.currentIncome = Math.max(0, parseFloat(val) || 0);
          await this.plugin.saveSettings();
          this.plugin.refreshOpenViews();
        }));

    new obsidian.Setting(containerEl)
      .setName(t('settingsFixedName'))
      .setDesc(t('settingsFixedDesc'))
      .addText(text => text
        .setPlaceholder('0.00')
        .setValue(String(this.plugin.settings.monthlyFixedExpenses || ''))
        .onChange(async (val) => {
          this.plugin.settings.monthlyFixedExpenses = Math.max(0, parseFloat(val) || 0);
          await this.plugin.saveSettings();
          this.plugin.refreshOpenViews();
        }));

    new obsidian.Setting(containerEl)
      .setName(t('settingsSyncName'))
      .setDesc(t('settingsSyncDesc'))
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.syncWithNote)
        .onChange(async (val) => {
          this.plugin.settings.syncWithNote = val;
          await this.plugin.saveSettings();
        }));

    new obsidian.Setting(containerEl)
      .setName(t('settingsSyncPathName'))
      .setDesc(t('settingsSyncPathDesc'))
      .addText(text => text
        .setPlaceholder('DIARIO DE RUEDA.md')
        .setValue(this.plugin.settings.syncNotePath)
        .onChange(async (val) => {
          this.plugin.settings.syncNotePath = val.trim() || 'DIARIO DE RUEDA.md';
          await this.plugin.saveSettings();
        }));

    containerEl.createEl('h3', { text: t('settingsDataHeader') });

    new obsidian.Setting(containerEl)
      .setName(t('settingsExportName'))
      .setDesc(t('settingsExportDesc'))
      .addButton(btn => btn
        .setButtonText(t('settingsExportBtn'))
        .onClick(() => {
          const txs = this.plugin.settings.transactions || [];
          const wishes = this.plugin.settings.wishlist || [];
          const headers = ['Tipo', 'ID', 'Fecha', 'Hora', 'Categoria', 'Concepto', 'Monto', 'Estado'];
          const rows = [
            ...txs.map(tx => ['GASTO', tx.id, tx.date, tx.time, tx.categoryName, `"${String(tx.concept || '').replace(/"/g, '""')}"`, tx.amount, 'PAGADO']),
            ...wishes.map(w => ['DESEO', w.id, w.createdDate, '', w.categoryName, `"${String(w.concept || '').replace(/"/g, '""')}"`, w.amount, w.bought ? 'COMPRADO_EN_RUEDA' : 'PENDIENTE'])
          ];
          const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `finances_daily_full_${getLocalDateStr()}.csv`;
          a.click();
          URL.revokeObjectURL(url);
          new obsidian.Notice(t('noticeCsvExported'));
        }));

    new obsidian.Setting(containerEl)
      .setName(t('settingsResetName'))
      .setDesc(t('settingsResetDesc'))
      .addButton(btn => btn
        .setButtonText(t('settingsResetBtn'))
        .setWarning()
        .onClick(() => {
          new ConfirmModal(this.app, {
            title: t('confirmResetTitle'),
            message: t('confirmResetBody'),
            confirmText: t('settingsResetBtn'),
            tone: 'danger',
            onConfirm: async () => {
              this.plugin.settings.transactions = [];
              (this.plugin.settings.wishlist || []).forEach(w => {
                this.plugin.refundWishlistSavingsIfNeeded(w);
                w.bought = false;
                w.boughtDate = null;
                w.txId = null;
              });
              await this.plugin.saveSettings();
              this.plugin.refreshOpenViews();
              new obsidian.Notice(t('noticeHistoryCleared'));
            }
          }).open();
        }));
  }
}

module.exports = FinancesDailyPlugin;
module.exports.default = FinancesDailyPlugin;
