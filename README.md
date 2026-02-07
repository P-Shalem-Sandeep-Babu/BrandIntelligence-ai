# BrandIntelligence AI 🧠✨

**BrandIntelligence AI** is a dual-mode, AI-powered strategic platform designed to architect, analyze, and accelerate brands. Whether you are launching a **Startup** or optimizing an **Established Enterprise**, this application acts as your 24/7 Chief Strategy Officer, Creative Director, and Data Analyst.

Powered by **Google Gemini 2.5**, it combines deep psychological insights, strategic frameworks, and generative capabilities into a single, intuitive interface.

![App Screenshot Placeholder](https://via.placeholder.com/1200x600?text=BrandIntelligence+AI+Dashboard)

---

## 🚀 Key Features

### 🌗 Dual-Mode Interface
*   **Startup Launchpad**: Focused on zero-to-one creation. Tools for validation, pitch decks, naming, viral launch strategies, and initial identity creation.
*   **Enterprise Suite**: Focused on optimization and scale. Tools for brand audits, sentiment analysis, crisis management, corporate rebranding, and market expansion.

### 🛠️ Strategic Tool Suite
The platform includes over 30+ specialized AI agents, including:

*   **👑 Total Brand Architect**: An all-in-one engine that generates a complete "Brand Masterfile" (Strategy, Visuals, Risk, Psychology) from a single prompt.
*   **🎨 Visual Identity Creator**: Generates logo concepts and visual assets with deep psychological rationales explaining *why* specific shapes and colors work.
*   **📊 Sentiment Pulse**: AI-powered NLP analysis of customer feedback, delivering emotional pattern recognition and industry benchmarking.
*   **🧪 Strategy Simulator**: Stress-tests your business model against different pricing, distribution, and demographic scenarios.
*   **🧠 Customer Psychology Map**: Decodes the deep-seated fears and aspirations of your target audience.
*   **⚖️ Risk & Compliance**: Generates legal checklists, pre-mortem failure analyses, and financial risk overviews.

### 💾 Smart History
*   **Local Persistence**: Automatically saves your generations (text, images, and color palettes).
*   **Quick Restore**: Access previous strategic sessions instantly via the history dropdown in every tool.

---

## 💻 Tech Stack

*   **Frontend Framework**: React 18
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS (with custom Glassmorphism utilities)
*   **AI Engine**: Google GenAI SDK (`@google/genai`) - Gemini 2.5 Flash & Pro Models
*   **Icons**: Lucide React
*   **Charts**: Recharts
*   **Markdown Rendering**: React Markdown & Remark GFM

---

## ⚙️ Installation & Setup

### Prerequisites
*   Node.js (v16 or higher)
*   npm or yarn
*   A valid **Google Gemini API Key**

### Steps

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/brand-intelligence-ai.git
    cd brand-intelligence-ai
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    *   Create a `.env` file in the root directory.
    *   Add your Gemini API Key:
        ```env
        API_KEY=your_google_gemini_api_key_here
        ```
    *   *Note: The application code expects `process.env.API_KEY`. Ensure your build tool (Vite/Webpack) exposes this correctly.*

4.  **Run the Application**
    ```bash
    npm start
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

---

## 📖 Usage Guide

### 1. Select Your Mode
Upon launching, choose between **Startup Launchpad** (purple theme) or **Enterprise Suite** (emerald theme). This configures the available tools and the AI's underlying persona.

### 2. Choose a Tool
Navigate through the sidebar categories:
*   **Foundation**: Core strategy and planning.
*   **Identity**: Visuals, names, and voice.
*   **Launch/Content**: Marketing assets and campaigns.
*   **Compliance/Executive**: Legal, risk, and high-level summaries.

### 3. Generate & Analyze
*   **One-Click Generation**: Most tools come pre-filled with high-quality "Judge-Ready" prompts. Just click "Generate".
*   **Custom Context**: Edit the input fields to tailor the strategy to your specific business needs.
*   **Download & Save**: Export reports as Markdown files or save generated images directly.

---

## 📂 Project Structure

```
/
├── components/          # React components
│   ├── Layout.tsx       # Sidebar and responsive shell
│   ├── ContentGenerator # Generic text generation tool
│   ├── VisualIdentity   # Image generation & psychology
│   ├── Analytics        # Charts and data visualization
│   └── ...
├── services/
│   ├── geminiService.ts # API integration logic
│   └── historyService.ts# LocalStorage management
├── constants.ts         # Tool configurations and prompts
├── types.ts             # TypeScript interfaces
├── App.tsx              # Main routing logic
└── index.tsx            # Entry point
```

---

## 🙏 Credits

*   **Google Gemini** for the reasoning and generation capabilities.
*   **Lucide** for the beautiful icon set.
*   **Tailwind CSS** for the utility-first styling engine.
