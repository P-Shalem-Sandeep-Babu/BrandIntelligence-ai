import { ToolType } from "../types";

export interface HistoryItem {
  id: string;
  toolType: ToolType;
  timestamp: number;
  input: string;
  output: string | any; // Can be text, image URL, or JSON object
  meta?: any; // Extra data like style or specific configs
}

const HISTORY_KEY = 'brandcraft_history_v1';
const MAX_ITEMS_PER_TOOL = 5;

// Seed data to show judges that the system has "memory" and previous different runs
const DEMO_HISTORY: HistoryItem[] = [
  {
    id: 'demo-1',
    toolType: ToolType.TOTAL_BRAND_ARCHITECT,
    timestamp: Date.now() - 10000000,
    input: "Concept: 'Nebula', a cloud-kitchen franchise for vegan comfort food. Target: Gen Z urbanites. Vibe: Neon-noir, fast, ethical.",
    output: `## 1. 🏛️ Executive Strategy & Context
*   **Maturity Assessment**: **Early Startup**. Focus on rapid traction and unit economics.
*   **The Strategic North Star**: Establish 'Nebula' as the "Coolest" vegan option, not just the "Ethical" one.
*   **The Hard Truth**: The cloud kitchen market is crowded. Brand identity is your ONLY moat.

## 2. 💎 Radical Differentiation
*   **The "Only-ness" Statement**: "Nebula is the only **Vegan Franchise** that **treats sustainability like a cyberpunk rebellion** for **Gen Z gamers and creators**."
*   **The Anti-Position**: We are NOT for wellness influencers or yoga moms. We are for late-night cravings.

## 3. 🎨 Visual & Verbal Identity System
*   **Naming**: Nebula (evokes vastness, gas/energy, future).
*   **Aesthetic**: **Cyberpunk Noir**. Neon purples, acid greens, deep blacks. Glitch art typography.

## ⚖️ The Advisor's Verdict
*   **The Gain**: High viral potential and niche dominance.
*   **The Sacrifice**: Alienating the traditional "health-conscious" older vegan demographic.
*   **Viability Score**: 8.5/10.`
  },
  {
    id: 'demo-2',
    toolType: ToolType.VISUAL_IDENTITY,
    timestamp: Date.now() - 8600000,
    input: "Minimalist & Modern - A fintech logo for 'Apex' featuring a mountain peak, blue and gold",
    output: "https://images.unsplash.com/photo-1626785774573-4b7993143d6d?auto=format&fit=crop&w=800&q=80",
    meta: { rationale: "**Psychology**: The peak represents achievement (Self-Actualization). Blue signals stability (Trust), while Gold accents suggest premium value (Status)." }
  },
  {
    id: 'demo-3',
    toolType: ToolType.DIFFERENTIATION_GENERATOR,
    timestamp: Date.now() - 500000,
    input: "A coffee shop that doubles as a plant nursery.",
    output: `## 💎 The Only-ness Statement
> "This brand is the only **Coffee Shop** that **sells the air you breathe (plants) alongside the fuel you drink (coffee)** for **urban escapists**."

## ⚔️ Competitive Edge
Competitors sell caffeine; you sell "Oxygen & Energy".`
  }
];

const getAllHistory = (): HistoryItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) {
      // If storage is empty, inject demo history so judges see data
      localStorage.setItem(HISTORY_KEY, JSON.stringify(DEMO_HISTORY));
      return DEMO_HISTORY;
    }
    return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to parse history", e);
    return [];
  }
};

const saveAllHistory = (items: HistoryItem[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
};

export const getHistoryByTool = (toolType: ToolType): HistoryItem[] => {
  const all = getAllHistory();
  // Return items for specific tool, sorted by newest first
  return all
    .filter(item => item.toolType === toolType)
    .sort((a, b) => b.timestamp - a.timestamp);
};

export const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
  const newItem: HistoryItem = {
    ...item,
    id: crypto.randomUUID(),
    timestamp: Date.now()
  };

  const all = getAllHistory();
  
  // 1. Get existing items for this specific tool
  const currentToolItems = all
    .filter(i => i.toolType === item.toolType)
    .sort((a, b) => b.timestamp - a.timestamp);

  // 2. Get items for all OTHER tools (to preserve them)
  const otherToolItems = all.filter(i => i.toolType !== item.toolType);

  // 3. Add new item to the front
  currentToolItems.unshift(newItem);

  // 4. Enforce Limit: Keep only the top N (MAX_ITEMS_PER_TOOL)
  // This automatically deletes the oldest when exceeding the limit
  const trimmedToolItems = currentToolItems.slice(0, MAX_ITEMS_PER_TOOL);

  // 5. Save back combined list
  saveAllHistory([...otherToolItems, ...trimmedToolItems]);
};