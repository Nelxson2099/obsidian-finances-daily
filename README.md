# Finances Daily — Wheel of Life Expense Tracker for Obsidian

[![Obsidian Plugin](https://img.shields.io/badge/Obsidian-Plugin-7C3AED?logo=obsidian&logoColor=white)](https://obsidian.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-10B981.svg)](https://github.com/Nelxson2099/obsidian-finances-daily/releases)

**Finances Daily** is a native Obsidian extension designed under the **Wheel of Life (Rueda de la Vida)** personal development framework. Rather than tracking money as dry, isolated numbers, it organizes your expenses across the **8 fundamental dimensions of human flourishing**:

1. 🩺 **Health & Vitality (Salud)** — Physical well-being, nutrition, medicine, gym, wellness.
2. 🎮 **Leisure & Recreation (Ocio)** — Entertainment, gaming, movies, outings, hobbies.
3. 🧠 **Personal Growth (Desarrollo Personal)** — Books, courses, learning, mental fitness.
4. 💼 **Profession & Career (Profesión)** — Work tools, software, equipment, professional gear.
5. ❤️ **Love & Romance (Amor)** — Dates, partner gifts, relationship experiences.
6. 👥 **Friends & Social (Amigos)** — Gatherings, celebrations, shared dinners.
7. 🏡 **Family & Home (Familia)** — Household essentials, home improvements, family support.
8. 💰 **Finances & Wealth (Finanzas)** — Savings, investments, asset building, financial reserves.

---

## ✨ Features

- 🎡 **Interactive Dynamic SVG Wheel**: Visual breakdown of your expenses across all 8 life areas with instant hover inspection and slice percentages.
- ⚡ **Quick Expense Capture**: Fast input form with amount, description, category selector, and custom date/time.
- 🎯 **Monthly Budget & Balance KPI**: Set a monthly budget goal and track your real-time total spent and remaining balance.
- 📝 **Markdown Daily Note Synchronization**: Automatically appends new transactions under specific headers in your target Markdown journal note (e.g., `### - SALUD`, `### - FINANZAS`).
- 📊 **Ledger & History Filter**: Filter expenses by **Today**, **This Week**, **This Month**, or **All Time**, with instant search by concept.
- 💾 **Data Ownership & Privacy**: 100% offline and local. Your data stays in your vault.
- 📤 **CSV Export**: One-click download of your expense history for external spreadsheets.

---

## 🚀 Installation

### Option 1: Community Plugins (Recommended)
1. In Obsidian, open **Settings** → **Community Plugins**.
2. Turn on Community Plugins and click **Browse**.
3. Search for **Finances Daily**.
4. Click **Install**, then **Enable**.

### Option 2: Manual Installation
1. Download the latest release assets (`main.js`, `manifest.json`, `styles.css`) from [Releases](https://github.com/Nelxson2099/obsidian-finances-daily/releases).
2. Create a folder named `finances-daily` inside your vault's plugin directory:
   `<your-vault>/.obsidian/plugins/finances-daily/`
3. Place `main.js`, `manifest.json`, and `styles.css` inside that folder.
4. Reload Obsidian and enable **Finances Daily** under Community Plugins.

---

## ⌨️ Commands

| Command | Action |
|---|---|
| `Open Expense Wheel` | Opens the interactive Wheel of Life financial dashboard in a workspace leaf. |
| `Quick Add Expense` | Opens a lightweight modal to quickly log an expense from anywhere. |

---

## ⚙️ Settings

- **Currency Symbol**: Customize your currency (`$`, `€`, `£`, `Bs`, `MXN`, etc.).
- **Monthly Budget**: Set a target monthly spending limit.
- **Sync with Markdown Note**: Toggle automatic synchronization with a designated note in your vault (default: `DIARIO DE RUEDA.md`).
- **Sync Note Path**: Customize the vault path of your financial journal note.
- **CSV Export**: Export all historical transactions to a CSV file.

---

## 🛡️ License

Released under the [MIT License](LICENSE). Built with excellence by **[Nelxson2099](https://github.com/Nelxson2099)**.
