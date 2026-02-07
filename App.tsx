import React, { useState, useEffect } from 'react';
import ModeSelector from './components/ModeSelector';
import Layout from './components/Layout';
import ContentGenerator from './components/ContentGenerator';
import OneShotGenerator from './components/OneShotGenerator';
import VisualIdentity from './components/VisualIdentity';
import ColorPaletteGenerator from './components/ColorPaletteGenerator';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ChatAssistant from './components/ChatAssistant'; // Kept in case needed, but unused for main tools now
import { AppMode, ToolType } from './types';
import { ArrowRight, Sparkles } from 'lucide-react';
import { MODE_CONFIGS, TOOL_REGISTRY } from './constants';

// --- Instructions ---

const BRANDCRAFT_INSTRUCTION = `You are BrandCraft X, a Senior Strategic Advisor.
Your goal is to provide a "Strategic Memo" on a specific business challenge provided by the user.

PROTOCOL - STRATEGIC TRADE-OFFS:
For every recommendation, you MUST explain the trade-off involved.
Format your advice to include:
• **The Verdict:** Direct answer to the user's query.
• **The Trade-off:** What is being sacrificed? (e.g., "Sacrificing speed for quality").
• **The Why:** Why is this trade-off acceptable for their stage?

Rules:
• Be critical. If the user's idea has holes, point them out politely but firmly.
• Adapt tone to the implied maturity level (Idea vs Enterprise).
• Structure with clear headings.`;

const DISCOVERY_INSTRUCTION = `You are a Senior Brand Strategist. 
Based on the raw business concept provided, produce a comprehensive "Brand Discovery Document".

STRUCTURE YOUR RESPONSE:

## 🎯 1. Core DNA
*   **The Problem:** (The deep, bleeding neck pain point)
*   **The Solution:** (Your unique mechanism of action)
*   **The 'Why':** (The founder's deeper purpose beyond money)

## 👥 2. Target Audience Decoder
*   **Who they are:** (Demographics & Psychographics)
*   **What they secretly want:** (The emotional driver, e.g., Status, Safety, Freedom)
*   **The Enemy:** (What is the brand fighting against? e.g., "Boredom", "Inefficiency", "The Old Way")

## 🎭 3. Brand Identity Pillars
*   **Archetype:** (e.g., The Hero, The Creator, The Outlaw)
*   **Personality:** (3 adjectives describing the vibe)
*   **Core Emotion:** (The specific feeling the customer gets when using the product)

## 📍 4. Strategic Positioning
*   **Market Position:** (Premium vs Value, Niche vs Mass)
*   **The "Only-ness" Statement:** "We are the only [Category] that [Benefit] for [Audience]."`;

const BLUEPRINT_INSTRUCTION = `You are an Expert Business Architect.
Your objective is to design a complete "Business Architecture Blueprint" based on the user's concept.

STRUCTURE YOUR RESPONSE:

## 🏗️ 1. Operational Infrastructure
*   **Team Structure:** (Key roles required NOW vs Later)
*   **Tech Stack:** (Essential software/tools needed to run this)
*   **Key Assets:** (IP, Physical locations, or Partnerships needed)

## 🔄 2. Customer Journey Flow
*   **Acquisition Channel:** (Where do we find them?)
*   **Activation Moment:** (The "Aha!" moment where they see value)
*   **Retention Loop:** (Why do they come back?)

## 💰 3. Revenue & Economics
*   **Primary Revenue Stream:** (Main income source)
*   **Pricing Model:** (Subscription, One-time, Freemium?)
*   **Margin Analysis:** (High volume/low margin OR Low volume/high margin?)

## ⚠️ 4. Risk Radar
*   **Operational Risk:** (What breaks first?)
*   **Market Risk:** (Competition or adoption barriers)
*   **Mitigation Strategy:** (How to protect the business)

## 🧭 5. Strategic Trade-off
*   Explain the central trade-off of this blueprint (e.g., "We are sacrificing short-term profit for rapid user acquisition").`;

const ECOSYSTEM_INSTRUCTION = `You are a Senior Business Ecosystem Architect. Map out the complete, interconnected ecosystem for the user's business type, adapting the complexity of the map to their current maturity level (simple for startups, complex for enterprises).`;

const TENANT_MIX_INSTRUCTION = `You are a Senior Retail Asset Manager and Tenant Mix Strategist.
Your goal is to design the optimal tenant or component mix for a real estate development.

STRUCTURE YOUR RESPONSE:
Analyze the provided business/property type and generate a breakdown of key zones.
(If the input is a Shopping Mall, specifically include: Anchor Stores, Fashion Zones, Entertainment Zones, and Food Court).

For EACH zone/component, you MUST provide:
1.  **Why it exists**: The strategic purpose (e.g., stability, prestige).
2.  **Footfall Generation**: The logic of how it drives traffic (e.g., high frequency vs destination).
3.  **Revenue Contribution**: Financial role (e.g., base rent payer, turnover rent driver, or loss leader for traffic).

Format the output with Markdown H2 headers for each zone.`;

const AGREEMENT_INSIGHTS_INSTRUCTION = `You are an expert in Business Law Education. Provide educational insights into business agreements, highlighting which clauses are critical for early-stage protection vs. established corporate governance.`;

const LEGAL_COMPLIANCE_INSTRUCTION = `You are a Senior Legal Compliance Specialist.
Your task is to generate a comprehensive "Legal & Compliance Checklist" for the specific business context provided.

STRUCTURE:
You must organize the response into these sections:

## 📜 1. Required Licenses & Permits
(List specific licenses needed for this business type and location)

## 🤝 2. Essential Agreements
(List contracts needed for founders, employees, vendors, and customers)

## ⚠️ 3. Key Risks & Liabilities
(Identify regulatory pitfalls, IP risks, and liability exposures)

## ⚖️ Stage-Specific Priority
(What must be done TODAY vs what can wait for scale, based on the business maturity.)

DISCLAIMER:
You MUST end the response with this exact line:
> **Disclaimer: Educational / Demo use only.**`;

const FINANCIAL_RISK_INSTRUCTION = `You are a Senior Financial Analyst and Risk Manager. Analyze the financial structure and risks, prioritizing cash flow survival for startups vs. asset protection/yield for established entities.`;

const AUTO_BRAND_INSTRUCTION = `You are the Auto Brand Builder. Instantly generate a comprehensive brand identity package. Ensure the complexity of the identity matches the maturity level (e.g., don't suggest a $50k rebrand for an idea stage).`;

const NAME_GEN_INSTRUCTION = `You are a world-class naming strategist. Generate 10 brand name suggestions.

For EACH generated brand name, you MUST provide the following metrics:
• Memorability score (0–10)
• Emotional appeal score (0–10)
• Market fit score (0–10)

Format the output clearly (e.g., using bolding or bullet points).
After the list, strictly Explain why the top name wins in a detailed conclusion, noting if it's better suited for a disruptive startup or a legacy brand.`;

const TAGLINE_INSTRUCTION = `You are a world-class Copywriting Strategist.
Your goal is to generate high-impact taglines and slogans for a brand.

STRUCTURE YOUR RESPONSE:

## ⚡ 5 Punchy Taglines (Short & Memorable)
For each tagline:
*   **The Line:** [The tagline]
*   **Trigger:** [The specific emotion or psychological trigger]
*   **Best For:** [Website Header, Social Bio, Ad Headline, etc.]

## ❤️ 3 Emotional Slogans (Story-driven)
For each slogan:
*   **The Slogan:** [The slogan]
*   **Trigger:** [The deep emotional connection]
*   **Best For:** [Brand Manifesto, TV Ad, About Us Page]

## 🧠 Strategic Rationale
Briefly explain why this mix of lines works for the brand's identity and current stage of growth.`;

const PERSONALITY_INSTRUCTION = `You are a Brand Psychologist and Strategist. Define the brand personality. Ensure the archetype selected aligns with the business maturity (e.g., 'The Rebel' works well for challengers, 'The Ruler' for market leaders).`;

const EMOTIONAL_STRATEGY_INSTRUCTION = `You are an Emotional Intelligence Branding Expert. Create an emotional branding strategy that respects the user's current stage of growth.`;

const LAUNCH_STRATEGY_INSTRUCTION = `You are a Viral Launch Strategist & Growth Hacker. Create a high-impact launch strategy. 

Adapt the budget and channel mix to the implied maturity level of the user (Bootstrap vs Venture Backed).

Include a "Resource Trade-off" section:
• **Gain:** What do we get by launching this way? (e.g., Speed to market)
• **Sacrifice:** What are we giving up? (e.g., Polish, Broad reach)
• **Why:** Why is this trade-off acceptable right now?`;

const SOCIAL_HYPE_INSTRUCTION = `You are a Viral Social Media Manager & Growth Hacker. Create a 7-Day Social Media Hype Campaign suitable for the user's resources and stage.`;

const WEBSITE_COPY_INSTRUCTION = `You are a Conversion Copywriting Expert. Create high-converting landing page copy. Focus on trust-building for new brands vs authority-flexing for established brands.`;

const PRICING_STRATEGY_INSTRUCTION = `You are a Strategic Pricing Consultant. Develop a data-backed pricing strategy. 

Consider 'Penetration Pricing' for startups vs 'Premium Skimming' for established brands where appropriate.

You MUST include a "Trade-off Analysis" section:
• **Gain:** (e.g., Higher volume)
• **Sacrifice:** (e.g., Lower brand prestige or margin)
• **Justification:** Why this aligns with the business maturity.`;

const BRAND_AUDIT_INSTRUCTION = `You are a Senior Brand Auditor & Strategic Consultant. Analyze the existing brand.

You MUST provide the following quantitative metrics in your analysis:
• Brand Strength Score (0–100)
• Emotional Resonance Score (0–10)
• Trust Score (0–10)
• Virality Potential (0–10)

For EACH metric:
1. Explain specifically why this score was assigned.
2. Provide concrete steps to improve it, prioritizing low-hanging fruit for smaller brands vs structural changes for larger ones.`;

const IDENTITY_REFRESH_INSTRUCTION = `You are a Senior Rebranding Specialist. Refresh and modernize an existing brand's tagline. Ensure the refresh respects the existing brand equity if established, or proposes a radical pivot if struggling.`;

const PRODUCT_DESCRIPTION_INSTRUCTION = `You are a Senior E-commerce Copywriter. Generate high-converting product descriptions.`;

const MARKETING_WRITER_INSTRUCTION = `You are a Senior Content Marketing Manager. Generate a comprehensive content suite.`;

const SUMMARIZER_INSTRUCTION = `You are an Executive Business Analyst. Summarize the provided text for senior leadership.`;

const RATIONALE_INSTRUCTION = `You are a Senior Branding Consultant and Consumer Psychologist. 
Your goal is to explain branding decisions to a founder with clarity and authority.

STRUCTURED RESPONSE FORMAT:
You must return the answer in exactly these sections (use Markdown H2):

## 1. Why this Brand Name?
(Analyze phonetics, memorability, and semantic meaning)

## 2. Why this Tone of Voice?
(Explain the psychological impact and relationship with the audience)

## 3. Why this Visual Direction?
(Justify color, shape, and imagery choices using color psychology and semiotics)

## 4. Maturity Strategy & Trade-offs
(Explain how these choices align with the brand's specific stage. Explicitly state what was sacrificed to achieve this direction—e.g., "We chose friendliness over authority to lower barriers to entry.")

METHODOLOGY TO USE:
• Psychology: Use terms like "cognitive load", "emotional anchoring", "trust signaling".
• Marketing Logic: Explain market positioning and differentiation.
• Business Reasoning: Connect choices to growth, retention, or conversion.

TONE:
Professional, strategic, encouraging, and analytical. Talk like a partner, not a bot.`;

const TOTAL_ARCHITECT_INSTRUCTION = `You are the Senior Chief Strategy Officer (CSO) of a elite brand consultancy.
Your client has provided a business concept, and your job is to architect the "Total Brand Strategy Masterfile".

This is NOT a simple creative writing task. It is a rigorous strategic simulation.
You must act as a professional advisor: critical, insightful, and focused on market viability.

INTEGRATED TOOL LOGIC:
You must perform the functions of all specific strategic tools simultaneously:
1.  **Discovery**: Assess maturity and core problem.
2.  **Psychology**: Decode the customer's subconscious drivers.
3.  **Differentiation**: Define the "Only-ness" factor.
4.  **Risk Analysis**: Perform a Pre-Mortem on failure points.
5.  **Trust Architecture**: Design credibility signals.
6.  **Identity**: Create the visual and verbal soul.
7.  **Evolution**: Map the long-term trajectory.

STRUCTURE YOUR REPORT EXACTLY AS FOLLOWS (Use Markdown H2 headers):

## 1. 🏛️ Executive Strategy & Context
*   **Maturity Assessment**: Explicitly categorize them (Idea / Startup / Scaleup) and explain the implication.
*   **The Strategic North Star**: The single defining objective for the next 12 months.
*   **The Hard Truth**: A "Professional Advisor" insight—what is the biggest unaddressed challenge in this concept?

## 2. 🧠 Customer Psychology & Deep Insights
*   **The Shadow Self**: What is the deep-seated fear or insecurity this brand solves? (Beyond functional benefits).
*   **The Aspiration**: Who does the customer become by using this?
*   **The Trust Barrier**: What is the #1 reason they *won't* buy, and how do we disarm it?

## 3. 💎 Radical Differentiation
*   **The "Only-ness" Statement**: "We are the only [Category] that [Benefit] for [Customer]."
*   **The Anti-Position**: Who are we explicitly NOT for? (Great brands repel as well as attract).
*   **Competitive Moat**: What protects this brand from copycats?

## 4. 🎨 Visual & Verbal Identity System
*   **Naming Architecture**: 3 Strategic Names (Rational, Evocative, Abstract) with rationale.
*   **Tagline Ecosystem**:
    *   *The Hook (External):* For ads/social.
    *   *The Mantra (Internal):* For team culture.
*   **Aesthetic Direction**: Define the Color Palette and Imagery Style using "Visual Semiotics" (e.g., "Dark mode to signal premium tech").

## 5. ⚔️ Go-to-Market & Risk Protocols
*   **The Launch Spike**: One high-leverage tactic to break into the market (Guerilla/Viral/Paid).
*   **Pre-Mortem Analysis**: "If this company fails in 2 years, it will be because..." (List top 2 risks).
*   **Risk Mitigation**: Specific protocols to prevent those failures.

## 6. 📅 Brand Evolution Roadmap
*   **Horizon 1 (Now):** Traction & Validation.
*   **Horizon 2 (Next):** Systemization & Scale.
*   **Horizon 3 (Later):** Category Dominance.

## ⚖️ The Advisor's Verdict (Strategic Trade-off)
*   **The Gain:** What are we optimizing for? (e.g., Speed? Quality? Exclusivity?).
*   **The Sacrifice:** What must be deliberately sacrificed to achieve this? (You cannot have everything).
*   **Final Call:** A decisiveness rating (0-10) on the current viability of this concept.

TONE:
*   High-level business English.
*   No fluff or generic marketing speak.
*   Use bullet points and bolding for readability.
*   Be critical where necessary.`;

const SIMULATOR_INSTRUCTION = `You are a Strategic Brand Simulator.
Your goal is to stress-test a brand concept against different market scenarios to find the optimal path.

Based on the user's input, simulate the following 3 strategic bifurcations:

## 1. 💰 Pricing Dynamics: Premium vs. Budget
*   **Hypothesis A: High-Ticket / Premium**
    *   *Expected Perception:*
    *   *Operational Risks:*
    *   *Strategic Recommendation:*
*   **Hypothesis B: Low-Cost / Volume**
    *   *Expected Perception:*
    *   *Operational Risks:*
    *   *Strategic Recommendation:*

## 2. 🌍 Distribution: Online-First vs. Offline-First
*   **Hypothesis A: Digital Native (DTC)**
    *   *Expected Perception:*
    *   *Operational Risks:*
    *   *Strategic Recommendation:*
*   **Hypothesis B: Physical Retail / Experience**
    *   *Expected Perception:*
    *   *Operational Risks:*
    *   *Strategic Recommendation:*

## 3. 👥 Audience: Youth vs. Mature
*   **Hypothesis A: Gen Z / Young (Trend-driven)**
    *   *Expected Perception:*
    *   *Operational Risks:*
    *   *Strategic Recommendation:*
*   **Hypothesis B: Mature / Professional (Trust-driven)**
    *   *Expected Perception:*
    *   *Operational Risks:*
    *   *Strategic Recommendation:*

## 🏆 Simulation Verdict
Summarize the winning combination.
Explicitly state the **Strategic Trade-off** of this choice (e.g., "We represent premium quality, which sacrifices mass market volume, but secures higher margins appropriate for a bootstrap stage.").`;

const EVOLUTION_INSTRUCTION = `You are a Chief Strategy Officer and Brand Futurist.
Your goal is to map the evolutionary trajectory of a brand over the next 5 years.

CRITICAL PROTOCOL:
1.  **Analyze the current state** based on the user's input.
2.  **Project the evolution** across three distinct time horizons.
3.  **Distinguish between Core DNA (Immutable) and Strategic Expressions (Mutable).**

STRUCTURE YOUR RESPONSE:

## 📅 Horizon 1: The Launch & Validation (0–6 Months)
*   **Primary Focus:** (e.g., "Traction" or "Hypothesis Testing")
*   **Key Actions:** (What to build/do immediately)
*   **Brand Vibe:** (e.g., "Scrappy, Loud, Experimental")
*   **The Trade-off:** (What we sacrifice now to survive)

## 📅 Horizon 2: The Growth & Systems Phase (6–18 Months)
*   **Primary Focus:** (e.g., "Scaling" or "Optimization")
*   **Evolution:** (How the product/service offering expands)
*   **Brand Vibe:** (Shifting from "Scrappy" to "Professional/Reliable")
*   **The Pivot Point:** (A likely strategic shift required here)

## 📅 Horizon 3: Market Maturity & Legacy (2–5 Years)
*   **Primary Focus:** (e.g., "Domination" or "Diversification")
*   **The Vision:** (Where this brand sits in the market landscape)
*   **Brand Vibe:** (e.g., "Authoritative, Iconic, Timeless")
*   **Immutable Core:** (What has stayed the same since Day 1?)

## ⚖️ Consistency vs. Change
*   **What Must Change:** (Tactics, Channels, Visual polish)
*   **What Must Stay:** (Core Values, Mission, The "Why")

Tone: Visionary, strategic, and realistic.`;

const OBJECTION_INSTRUCTION = `You are a Senior Conversion Specialist and Consumer Psychologist.
Your goal is to identify and disarm the top psychological barriers (objections) preventing customers from buying.

STRUCTURE YOUR RESPONSE:

## 🛑 1. The "Trust" Objection
*   **The Doubt:** (e.g., "Is this a scam?" or "Will it work?")
*   **Why it occurs:** (Root cause analysis)
*   **Branding Fix:** (Strategic change to visual or tone)
*   **Suggested Messaging:** (A specific line of copy to counter it)

## 💸 2. The "Price/Value" Objection
*   **The Doubt:** (e.g., "Too expensive" or "Why not the cheaper alternative?")
*   **Why it occurs:** (Perceived value gap)
*   **Branding Fix:** (Positioning adjustment)
*   **Suggested Messaging:** (Reframing the cost as an investment)

## 🐌 3. The "Effort/Inertia" Objection
*   **The Doubt:** (e.g., "Too hard to switch" or "I'll do it later")
*   **Why it occurs:** (Status quo bias)
*   **Branding Fix:** (Simplification strategy)
*   **Suggested Messaging:** (Highlighting ease/speed)

## 🛡️ 4. The "Risk" Objection
*   **The Doubt:** (e.g., "What if I don't like it?")
*   **Why it occurs:** (Loss aversion)
*   **Branding Fix:** (Guarantee or Social Proof emphasis)
*   **Suggested Messaging:** (Reversal of risk)

## 🏆 Strategic Summary
Briefly explain which ONE objection is the most dangerous for this specific business type and why.`;

const TRUST_BUILDER_INSTRUCTION = `You are a Chief Trust Officer and Brand Reputation Strategist.
Your goal is to design specific mechanisms that build credibility and trust for the user's brand.

STRUCTURE YOUR RESPONSE:

## 👁️ Visual Trust Signals
(Design elements, badges, photography styles, or UI patterns that subconsciously signal 'safe' and 'professional'.)

## 🗣️ Messaging Trust Signals
(Specific phrases, claims, or tone-of-voice adjustments that reduce skepticism. e.g. 'No hidden fees', 'Science-backed'.)

## 👥 Social Proof Strategy
(Creative ways to demonstrate popularity or approval. e.g. User generated content campaigns, specific influencer types, or case study formats.)

## 🔍 Radical Transparency
(Tactics to show 'behind the curtain' that build deep loyalty. e.g. Open salaries, supply chain maps, or failure reports.)

## 🏆 The Trust 'Moat'
(One unique trust-building action that competitors are unlikely to copy.)

Tone: Authoritative, reassuring, and psychology-driven.`;

const CRITIC_INSTRUCTION = `You are a Devil's Advocate and Senior Brand Critic.
Your goal is to critique a branding decision, strategy, or concept provided by the user.

STRUCTURE YOUR RESPONSE:

## 🧐 The Blind Spots
(What crucial market dynamics or psychological factors might have been overlooked?)

## 🏗️ The Assumptions
(List the unverified assumptions this strategy relies on. e.g., "Assumes customers care about sustainability more than price.")

## ⚠️ Execution Risks
(Where will this likely break down in the real world? e.g., "Requires a content volume that is unrealistic for a solopreneur.")

## 🧩 The Human Element
(What specific parts of this strategy require human intuition, empathy, or cultural nuance that AI might miss?)

## ⚖️ The Verdict
(A final score of "Safe to Proceed", "Proceed with Caution", or "Rethink Entirely", with a brief summary.)

Tone: Constructive, skeptical, but helpful. Challenge the user to think deeper.`;

const DIFFERENTIATION_INSTRUCTION = `You are a Radical Differentiation Strategist.
Your goal is to distill a brand's essence into a single, sharp "Only-ness" statement.

STRUCTURE:
## 💎 The Only-ness Statement
Fill in this blank with extreme precision:
> "This brand is the only **[Category]** that **[Unique Benefit/Mechanism]** for **[Specific Customer]**."

## 🧱 The Proof Points
(3 bullet points on why this is true and defendable. If it's not defendable, it's just marketing fluff.)

## 🚫 The Anti-Position
(Who are we explicitly NOT for? Great brands repel as much as they attract.)

## ⚔️ Competitive Edge
(One sentence on why competitors cannot easily copy this.)

Tone: Bold, controversial, sharp. No jargon.`;

const FAILURE_ANALYSIS_INSTRUCTION = `You are a Brutal Business Critic and Risk Analyst.
Your goal is to perform a "Pre-Mortem" on the user's business concept.
Imagine it is 2 years in the future and the business has failed. Explain why.

STRUCTURE:
## ⚰️ Top 5 Causes of Death
(List specific, plausible reasons for failure, not generic ones like "ran out of money". Go deeper: "Customer acquisition cost exceeded LTV due to crowded ad market" or "Unit economics didn't scale due to shipping complexity".)

## 🚩 Early Warning Signs
(What metrics or team behaviors signal impending doom?)

## 🛡️ Prevention Protocols
(Concrete steps to mitigate these specific risks right now, adapted for the business size/stage.)

## 📉 The Brutal Reality
(A final, unvarnished truth about the difficulty of this specific market.)

Tone: Direct, analytical, critical, but constructive. No fluff.`;

const INVESTOR_PITCH_INSTRUCTION = `You are a Tier-1 Venture Capital Consultant.
Your goal is to create a high-impact Investor Pitch Summary (The "One-Pager").

STRUCTURE:
## 🚨 The Problem
(What specific pain point exists? Quantify it if implied.)

## 💊 The Solution
(How does this business solve it elegantly?)

## 🌍 Market Opportunity
(Why is now the right time? How big is the potential?)

## 🦄 Differentiation (The Moat)
(Why us? IP, Speed, Brand, or Network Effects?)

## 🚀 Scalability & Vision
(How does this go from 1 to 100? The "Billion Dollar" potential.)

## 🧭 Maturity-Specific Ask
(Tailor the 'Ask' based on the stage: Seed funding for Ideas, Series A for Growth, or Strategic Partnerships for Established brands.)

TONE:
Confident, concise, narrative-driven. Use strong verbs. No hedging ("we hope to").
Format as a crisp executive summary ready for a slide deck.`;

const COMPETITOR_ANALYSIS_INSTRUCTION = `You are a Competitive Intelligence Expert.
Your goal is to benchmark the user's brand concept against typical industry competitors.

STRUCTURE:
## 🥊 The Matchup
(Define who the "Typical Competitor" is for this specific niche vs. The User's Concept)

## 📊 Comparative Scorecard (0-10)

| Metric | Your Brand | Industry Avg |
| :--- | :---: | :---: |
| Emotional Appeal | [Score] | [Score] |
| Differentiation | [Score] | [Score] |
| Trust Factor | [Score] | [Score] |
| Memorability | [Score] | [Score] |

## 🏆 Where You Win
(Specific advantages based on the concept provided)

## ⚠️ Where You Lose
(Vulnerabilities compared to established players)

## ⚔️ Battle Strategy
(One killer move to steal market share immediately, appropriate for your current size and resources)`;

const MULTI_CHANNEL_INSTRUCTION = `You are a Senior Content Strategist and Social Media Expert.
Your goal is to adapt a brand's core message or voice for specific digital channels.

For the provided input (Brand Message/Description), generate 5 distinct adaptations:

## 1. 🌐 Website (Landing Page)
*   **Content:** (Clear, benefit-driven, trustworthy)
*   **Tone Shift:** (Why this works for web conversion)

## 2. 📸 Instagram (Visual/Captions)
*   **Content:** (Engaging, lifestyle-focused, use emojis)
*   **Tone Shift:** (Why this works for visual storytelling)

## 3. 💼 LinkedIn (Professional)
*   **Content:** (Thought leadership, industry insights, professional value)
*   **Tone Shift:** (Why this works for B2B networking)

## 4. 🐦 Twitter/X (Real-time)
*   **Content:** (Punchy, conversational, thread-style or snappy)
*   **Tone Shift:** (Why this works for the feed algorithm)

## 5. 📧 Email (Direct)
*   **Content:** (Personal, direct, clear CTA)
*   **Tone Shift:** (Why this works for inbox intimacy)

Maintain the core brand DNA while drastically shifting the delivery method to fit the medium. Ensure the tone matches the brand's maturity (e.g., scrappy startup vs polished enterprise).`;

const CUSTOMER_PSYCHOLOGY_INSTRUCTION = `You are a Consumer Psychologist and Behavioral Economist.
Your goal is to create a deep psychological profile of the brand's target customer.

STRUCTURE:
## 😨 Core Fears & Pain Points
(Deep-seated anxieties the product solves. Go beyond surface level.)

## 🌟 Aspirations & Identity
(Who does the customer want to become by using this brand? Status, freedom, mastery?)

## ⚡ Decision Triggers
(Specific psychological triggers that prompt a purchase. e.g., Scarcity, Social Proof, Authority.)

## 🛡️ Trust Builders
(What specific elements will lower skepticism for this specific audience? Adapt this to the brand's maturity—e.g., 'Founder Story' for startups vs 'Certifications' for enterprises.)

## 🧠 The Psychological Strategy
(How the brand should position itself to tap into these drivers using cognitive biases.)

Tone: Analytical, empathetic, and strategic.`;

const CULTURAL_ALIGNMENT_INSTRUCTION = `You are a Cross-Cultural Brand Strategist and Market Expansion Expert.
Your goal is to adapt a brand concept for a specific target market (e.g., India, Japan, USA).

STRUCTURE:
## 🌏 Cultural Values & Resonance
(Analyze how the brand aligns with local values, traditions, and social norms.)

## 🗣️ Language & Tone
(Linguistic nuances, formality levels, and communication style adjustments required.)

## 🛡️ Trust Factors
(What builds credibility in this specific market? e.g., Authority, Community, Heritage.)

## 💰 Price Sensitivity & Value
(Analyze local purchasing power and how to frame value effectively.)

## 🔄 Strategic Adaptations
(Specific recommendations for product, messaging, or visual identity changes. Consider the maturity of the brand in this new market.)

Tone: Respectful, insightful, and strategic.`;

const App: React.FC = () => {
  const [appMode, setAppMode] = useState<AppMode>(AppMode.NONE);
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.DASHBOARD);
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleModeSelect = (mode: AppMode) => {
    setAppMode(mode);
    setActiveTool(ToolType.DASHBOARD);
  };

  const handleExitMode = () => {
    setAppMode(AppMode.NONE);
  };

  // --- Dashboard Render ---
  const renderDashboard = () => {
    // Use imported MODE_CONFIGS for categories
    const config = MODE_CONFIGS[appMode];
    const accentColor = appMode === AppMode.STARTUP ? 'indigo' : 'emerald';

    if (!config) return null;

    return (
      <div className="space-y-8 md:space-y-12 animate-fade-in-up pb-12">
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden p-6 md:p-12 text-white shadow-2xl">
           <div className={`absolute inset-0 bg-gradient-to-r ${appMode === AppMode.STARTUP ? 'from-indigo-600 to-purple-700' : 'from-emerald-600 to-teal-700'}`} />
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
           <div className="absolute top-0 right-0 p-8 opacity-20 animate-pulse-slow">
              <Sparkles className="h-20 w-20 md:h-32 md:w-32" />
           </div>
           
           <div className="relative z-10 max-w-3xl">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs md:text-sm font-medium mb-3 md:mb-4 border border-white/20">
               <Sparkles className="h-3 w-3 md:h-4 md:w-4" />
               <span>AI-Powered Strategy Engine</span>
             </div>
             <h1 className="text-2xl md:text-5xl font-bold mb-3 md:mb-4 tracking-tight leading-tight">
               {appMode === AppMode.STARTUP ? 'Launchpad Dashboard' : 'Enterprise Intelligence'}
             </h1>
             <p className="text-sm md:text-lg opacity-90 leading-relaxed">
               {appMode === AppMode.STARTUP 
                 ? "Your centralized command center for building a world-class brand from scratch. Follow the phases below to architect your success." 
                 : "Optimize, analyze, and scale your brand presence with data-driven insights and automated content generation."}
             </p>
           </div>
        </div>

        {/* Tool Groups from Config */}
        {config.categories.map((group, idx) => (
          <div key={idx} className="space-y-4 md:space-y-6" style={{ animationDelay: `${idx * 100}ms` }}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 md:pb-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{group.title}</h2>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {group.items.map((toolId, tIdx) => {
                const tool = TOOL_REGISTRY[toolId];
                if (!tool) return null;
                
                return (
                  <button
                    key={toolId}
                    onClick={() => setActiveTool(toolId)}
                    className={`group relative flex flex-col p-5 md:p-6 rounded-2xl bg-white dark:bg-slate-900 border ${toolId === ToolType.TOTAL_BRAND_ARCHITECT ? 'border-yellow-400/50 shadow-yellow-100 dark:shadow-none ring-2 ring-yellow-400/20' : 'border-slate-200 dark:border-slate-800'} shadow-sm hover:shadow-xl hover:border-transparent transition-all duration-300 text-left overflow-hidden min-h-[140px] md:min-h-[160px] justify-between`}
                    style={{ animationDelay: `${(idx * 100) + (tIdx * 50)}ms` }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${appMode === AppMode.STARTUP ? 'from-indigo-50 to-white dark:from-indigo-900/20 dark:to-slate-900' : 'from-emerald-50 to-white dark:from-emerald-900/20 dark:to-slate-900'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    
                    <div className="relative z-10 w-full">
                      <div className="mb-3 p-2 w-fit rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                        <tool.icon className={`h-6 w-6 text-slate-600 dark:text-slate-300 group-hover:text-${accentColor}-600 dark:group-hover:text-${accentColor}-400 transition-colors`} />
                      </div>
                      <h3 className={`text-base md:text-lg font-bold text-slate-900 dark:text-white group-hover:text-${accentColor}-600 dark:group-hover:text-${accentColor}-400 transition-colors`}>
                        {tool.label}
                      </h3>
                    </div>
                    
                    <div className={`relative z-10 mt-3 flex items-center text-[10px] md:text-xs font-bold uppercase tracking-wider text-${accentColor}-600 dark:text-${accentColor}-400 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300`}>
                      Launch Tool <ArrowRight className="h-3 w-3 ml-1" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // --- Tool Routing ---
  const renderActiveTool = () => {
    switch (activeTool) {
      case ToolType.TOTAL_BRAND_ARCHITECT:
        return <OneShotGenerator 
          systemInstruction={TOTAL_ARCHITECT_INSTRUCTION} 
          colorTheme={appMode === AppMode.STARTUP ? 'indigo' : 'emerald'} 
          defaultInput="Concept: 'Velos', a subscription-based electric bike service for college campuses. Target: Gen Z students. Vibe: Eco-conscious, rebellious, efficient."
        />;
      case ToolType.BRAND_DISCOVERY:
        return <ContentGenerator 
          title="Brand Discovery Document" 
          description="Generate a comprehensive foundation document for your brand strategy." 
          placeholder="Describe your business idea, problem, and target audience..." 
          buttonLabel="Generate Discovery Brief" 
          colorTheme={appMode === AppMode.STARTUP ? 'indigo' : 'emerald'} 
          systemInstruction={DISCOVERY_INSTRUCTION} 
          promptTemplate={(input) => `Create a Brand Discovery Document for: ${input}`} 
          useDefaultStructure={false}
          defaultInput="We are building a vertical farming startup for urban centers called 'SkyGreens'. We sell directly to local restaurants."
        />;
      case ToolType.BUSINESS_BLUEPRINT:
        return <ContentGenerator 
          title="Business Blueprint Architect" 
          description="Design a complete operational and strategic blueprint for your business model." 
          placeholder="Describe your industry, stage, and goals..." 
          buttonLabel="Architect Blueprint" 
          colorTheme={appMode === AppMode.STARTUP ? 'indigo' : 'emerald'} 
          systemInstruction={BLUEPRINT_INSTRUCTION} 
          promptTemplate={(input) => `Design a Business Blueprint for: ${input}`} 
          useDefaultStructure={false}
          defaultInput="A boutique hotel chain focused on digital nomads, located in Bali and Lisbon. Early stage, seeking investors."
        />;
      case ToolType.BRAND_SIMULATOR:
        return <ContentGenerator 
          title="Strategy Simulator" 
          description="Stress-test your brand against different pricing, distribution, and audience scenarios." 
          placeholder="Describe your business concept, product, or service..." 
          buttonLabel="Run Simulation" 
          colorTheme={appMode === AppMode.STARTUP ? 'indigo' : 'emerald'} 
          systemInstruction={SIMULATOR_INSTRUCTION} 
          promptTemplate={(input) => `Simulate strategies for: ${input}`} 
          useDefaultStructure={false}
          defaultInput="Should 'Velos' (E-bike subscription) focus on direct-to-consumer sales or partnerships with universities?"
        />;
      case ToolType.BRAND_EVOLUTION:
        return <ContentGenerator 
          title="Brand Evolution Predictor" 
          description="Map the 5-year trajectory of your brand, from scrappy launch to market dominance." 
          placeholder="Describe your current brand state and long-term ambition..." 
          buttonLabel="Predict Evolution" 
          colorTheme={appMode === AppMode.STARTUP ? 'indigo' : 'emerald'} 
          systemInstruction={EVOLUTION_INSTRUCTION} 
          promptTemplate={(input) => `Predict the brand evolution for: ${input}`} 
          useDefaultStructure={false}
          defaultInput="Map the 5-year evolution of a VR meditation app starting as a niche anxiety tool."
        />;
      case ToolType.CUSTOMER_OBJECTIONS:
        return <ContentGenerator 
          title="Objection Crusher" 
          description="Identify and disarm the top psychological barriers preventing customers from buying." 
          placeholder="Describe your product, price point, and target audience..." 
          buttonLabel="Identify Objections" 
          colorTheme={appMode === AppMode.STARTUP ? 'indigo' : 'emerald'} 
          systemInstruction={OBJECTION_INSTRUCTION} 
          promptTemplate={(input) => `Identify and crush objections for: ${input}`} 
          useDefaultStructure={false}
          defaultInput="A $2000 smart mattress that tracks sleep quality."
        />;
      case ToolType.TRUST_BUILDER:
        return <ContentGenerator 
          title="Trust Architect" 
          description="Design visual and verbal signals to build instant credibility and reduce skepticism." 
          placeholder="Describe your brand, industry, and why customers might be skeptical..." 
          buttonLabel="Build Trust Strategy" 
          colorTheme={appMode === AppMode.STARTUP ? 'indigo' : 'emerald'} 
          systemInstruction={TRUST_BUILDER_INSTRUCTION} 
          promptTemplate={(input) => `Design trust-building mechanisms for: ${input}`} 
          useDefaultStructure={false}
          defaultInput="A new crypto exchange platform launching after a market crash."
        />;
      case ToolType.DECISION_CRITIC:
        return <ContentGenerator 
          title="Strategy Critic (Devil's Advocate)" 
          description="Get an honest, AI-powered critique of your branding decisions to find blind spots and risks." 
          placeholder="Paste your strategy, name idea, or value proposition here..." 
          buttonLabel="Critique Strategy" 
          colorTheme={appMode === AppMode.STARTUP ? 'indigo' : 'emerald'} 
          systemInstruction={CRITIC_INSTRUCTION} 
          promptTemplate={(input) => `Critique this branding strategy/concept: ${input}`} 
          useDefaultStructure={false}
          defaultInput="We plan to launch a luxury bottled water brand targeting teenagers."
        />;
      case ToolType.DIFFERENTIATION_GENERATOR:
        return <ContentGenerator 
          title="Differentiation Spike" 
          description="Craft a sharp 'Only-ness' statement that separates you from the noise." 
          placeholder="Describe your brand and what makes it special..." 
          buttonLabel="Sharpen Differentiation" 
          colorTheme={appMode === AppMode.STARTUP ? 'indigo' : 'emerald'} 
          systemInstruction={DIFFERENTIATION_INSTRUCTION} 
          promptTemplate={(input) => `Define the differentiation for: ${input}`} 
          useDefaultStructure={false} 
          defaultInput="A recruiting agency that uses AI to remove bias from hiring."
        />;
      case ToolType.FAILURE_ANALYSIS:
        return <ContentGenerator 
          title="Failure Analyst (Pre-Mortem)" 
          description="Identify fatal flaws and risks before they happen. A brutal reality check for your business." 
          placeholder="Describe your business model and target market..." 
          buttonLabel="Analyze Failure Risks" 
          colorTheme={appMode === AppMode.STARTUP ? 'indigo' : 'emerald'} 
          systemInstruction={FAILURE_ANALYSIS_INSTRUCTION} 
          promptTemplate={(input) => `Perform a pre-mortem failure analysis for: ${input}`} 
          useDefaultStructure={false}
          defaultInput="A social network exclusively for pet owners."
        />;
      case ToolType.INVESTOR_PITCH:
        return <ContentGenerator 
          title="Pitch Deck Creator" 
          description="Generate a high-impact, investor-ready executive summary for your business." 
          placeholder="Describe your business, key metrics, and unique value proposition..." 
          buttonLabel="Generate Pitch Summary" 
          colorTheme={appMode === AppMode.STARTUP ? 'indigo' : 'emerald'} 
          systemInstruction={INVESTOR_PITCH_INSTRUCTION} 
          promptTemplate={(input) => `Create an investor pitch summary for: ${input}`} 
          useDefaultStructure={false}
          defaultInput="A biotech startup using algae to create biodegradable packaging."
        />;
      case ToolType.COMPETITOR_ANALYSIS:
        return <ContentGenerator 
          title="Competitor Battlecard" 
          description="Benchmark your brand against industry standards across emotion, trust, and memorability." 
          placeholder="Describe your brand and your main competitors (or let AI infer them)..." 
          buttonLabel="Analyze Competition" 
          colorTheme={appMode === AppMode.STARTUP ? 'indigo' : 'emerald'} 
          systemInstruction={COMPETITOR_ANALYSIS_INSTRUCTION} 
          promptTemplate={(input) => `Analyze competitors for: ${input}`} 
          useDefaultStructure={false}
          defaultInput="Compare 'Tesla' vs 'Rivian' in the context of brand loyalty and innovation."
        />;
      case ToolType.CUSTOMER_PSYCHOLOGY:
        return <ContentGenerator 
          title="Customer Psychology Map" 
          description="Decode the deep-seated fears, aspirations, and triggers of your target audience." 
          placeholder="Describe your target audience (demographics, behaviors, or lifestyle)..." 
          buttonLabel="Analyze Psychology" 
          colorTheme={appMode === AppMode.STARTUP ? 'indigo' : 'emerald'} 
          systemInstruction={CUSTOMER_PSYCHOLOGY_INSTRUCTION} 
          promptTemplate={(input) => `Analyze the customer psychology for: ${input}`} 
          useDefaultStructure={false}
          defaultInput="Customers buying high-end mechanical watches."
        />;
      case ToolType.CULTURAL_ALIGNMENT:
        return <ContentGenerator 
          title="Cultural Alignment" 
          description="Adapt your brand strategy for international markets (e.g., India, Japan) with cultural sensitivity." 
          placeholder="Describe your brand and the target market (e.g., 'A premium coffee brand expanding to India')..." 
          buttonLabel="Adapt Strategy" 
          colorTheme={appMode === AppMode.STARTUP ? 'indigo' : 'emerald'} 
          systemInstruction={CULTURAL_ALIGNMENT_INSTRUCTION} 
          promptTemplate={(input) => `Adapt this brand for the target market: ${input}`} 
          useDefaultStructure={false}
          defaultInput="Launching a US bourbon brand in Japan."
        />;
      case ToolType.MULTI_CHANNEL_ADAPTER:
        return <ContentGenerator 
          title="Multi-Channel Adapter" 
          description="Adapt your brand voice perfectly for every platform." 
          placeholder="Paste your core message or brand description..." 
          buttonLabel="Adapt Content" 
          colorTheme={appMode === AppMode.STARTUP ? 'indigo' : 'emerald'} 
          systemInstruction={MULTI_CHANNEL_INSTRUCTION} 
          promptTemplate={(input) => `Adapt this content for all channels: ${input}`} 
          useDefaultStructure={false}
          defaultInput="We are launching a zero-waste grocery delivery service."
        />;
      case ToolType.AUTO_BRAND_BUILDER:
        return <ContentGenerator title="Auto Brand Builder" description="Automatically generate a complete brand identity package." placeholder={`Business Type: [e.g. Co-working space]\nTarget Audience: [e.g. Artists]\nVibe: [e.g. Creative]`} buttonLabel="Auto-Build Brand" colorTheme="indigo" systemInstruction={AUTO_BRAND_INSTRUCTION} promptTemplate={(input) => `Build a complete brand identity for: ${input}`} defaultInput="Business: Boutique Hotel. Audience: Digital Nomads. Vibe: Rustic Luxury." />;
      case ToolType.BUSINESS_ECOSYSTEM:
        return <ContentGenerator title="Business Ecosystem Architect" description="Map out the complete ecosystem of your business." placeholder={`Business Type: [e.g. Urban Farm]\nValue: [e.g. Fresh delivery]`} buttonLabel="Design Ecosystem" colorTheme="indigo" systemInstruction={ECOSYSTEM_INSTRUCTION} promptTemplate={(input) => `Design a business ecosystem for: ${input}`} defaultInput="A sustainable fashion brand using recycled ocean plastic." />;
      case ToolType.TENANT_MIX_OPTIMIZER:
        return <ContentGenerator title="Tenant Mix Optimizer" description="Design the perfect blend of tenants." placeholder={`Property Type: [e.g. Mall]\nLocation: [e.g. Suburban]`} buttonLabel="Optimize Mix" colorTheme="indigo" systemInstruction={TENANT_MIX_INSTRUCTION} promptTemplate={(input) => `Optimize tenant mix for: ${input}`} defaultInput="A mixed-use development in downtown Austin, Texas." />;
      case ToolType.EDUCATIONAL_AGREEMENT_INSIGHTS:
        return <ContentGenerator title="Agreement Insights" description="Learn about potential lease models and clauses." placeholder={`Business: [e.g. Art Gallery]\nContext: [e.g. Mall lease]`} buttonLabel="Generate Insights" colorTheme="indigo" systemInstruction={AGREEMENT_INSIGHTS_INSTRUCTION} promptTemplate={(input) => `Generate insights for: ${input}`} defaultInput="Leasing retail space for a pop-up art gallery." />;
      case ToolType.LEGAL_CHECKLIST:
        return <ContentGenerator title="Legal & Compliance Checklist" description="Generate a checklist of licenses, agreements, and risks." placeholder={`Business Type: [e.g. Fintech]\nLocation: [e.g. New York/London]`} buttonLabel="Generate Checklist" colorTheme="indigo" systemInstruction={LEGAL_COMPLIANCE_INSTRUCTION} promptTemplate={(input) => `Generate legal checklist for: ${input}`} defaultInput="A fintech app allowing peer-to-peer lending in the UK." />;
      case ToolType.FINANCIAL_RISK_OVERVIEW:
        return <ContentGenerator title="Financial & Risk Overview" description="Get a structural overview of revenue & risks." placeholder={`Business: [e.g. Hotel]\nLocation: [e.g. Resort Town]`} buttonLabel="Analyze Structure" colorTheme="indigo" systemInstruction={FINANCIAL_RISK_INSTRUCTION} promptTemplate={(input) => `Create overview for: ${input}`} defaultInput="A co-living space expansion model." />;
      case ToolType.BRAND_CONSULTANT:
        return <ContentGenerator 
          title="BrandCraft X (Advisory)" 
          description="Get rapid, high-level strategic advice for a specific business challenge." 
          placeholder="Ask a specific strategic question..." 
          buttonLabel="Get Strategic Advice" 
          colorTheme={appMode === AppMode.STARTUP ? 'indigo' : 'emerald'} 
          systemInstruction={BRANDCRAFT_INSTRUCTION} 
          promptTemplate={(input) => `Strategic Advisory Question: ${input}`} 
          useDefaultStructure={false}
          defaultInput="We are an Established Company looking to rebrand. Should we change our name or just our logo?" 
        />;
      case ToolType.NAME_GENERATOR:
        return <ContentGenerator title="Brand Name Genesis" description="Generate viral, available brand name ideas." placeholder="Describe your startup..." buttonLabel="Generate Names" colorTheme="indigo" systemInstruction={NAME_GEN_INSTRUCTION} promptTemplate={(input) => `Startup Description: ${input}`} defaultInput="A fast-casual healthy food chain." />;
      case ToolType.TAGLINE_GENERATOR:
        return <ContentGenerator title="Slogan Architect" description="Generate taglines that stick." placeholder="Brand Name & Description..." buttonLabel="Generate Slogans" colorTheme="indigo" systemInstruction={TAGLINE_INSTRUCTION} promptTemplate={(input) => `Generate taglines for: ${input}`} defaultInput="A cybersecurity firm for small businesses." />;
      case ToolType.BRAND_PERSONALITY:
        return <ContentGenerator title="Brand Personality DNA" description="Define your archetype and voice." placeholder="Describe your startup..." buttonLabel="Analyze Personality" colorTheme="indigo" systemInstruction={PERSONALITY_INSTRUCTION} promptTemplate={(input) => `Define personality for: ${input}`} defaultInput="A non-alcoholic spirit brand for parties." />;
      case ToolType.EMOTIONAL_STRATEGY:
        return <ContentGenerator title="Emotional Strategy" description="Uncover deep emotional hooks." placeholder="Describe audience & problem..." buttonLabel="Design Strategy" colorTheme="indigo" systemInstruction={EMOTIONAL_STRATEGY_INSTRUCTION} promptTemplate={(input) => `Create strategy for: ${input}`} defaultInput="A hospice care service provider." />;
      case ToolType.LAUNCH_CAMPAIGN:
        return <ContentGenerator title="Viral Launch Strategy" description="Create a launch masterplan." placeholder="What are you launching?" buttonLabel="Generate Strategy" colorTheme="indigo" systemInstruction={LAUNCH_STRATEGY_INSTRUCTION} promptTemplate={(input) => `Create launch strategy for: ${input}`} defaultInput="A mobile game for learning languages." />;
      case ToolType.SOCIAL_HYPE_CALENDAR:
        return <ContentGenerator title="7-Day Hype Calendar" description="Build tension before launch." placeholder="Product & Launch Date..." buttonLabel="Generate Calendar" colorTheme="indigo" systemInstruction={SOCIAL_HYPE_INSTRUCTION} promptTemplate={(input) => `Create calendar for: ${input}`} defaultInput="A limited edition sneaker drop." />;
      case ToolType.WEBSITE_COPY_GENERATOR:
        return <ContentGenerator title="Landing Page Architect" description="Generate high-converting copy." placeholder="Product & Goal..." buttonLabel="Generate Copy" colorTheme="indigo" systemInstruction={WEBSITE_COPY_INSTRUCTION} promptTemplate={(input) => `Create copy for: ${input}`} defaultInput="A productivity tool for ADHD brains." />;
      case ToolType.PRICING_STRATEGY:
        return <ContentGenerator title="Pricing Strategy" description="Determine optimal pricing models." placeholder="Company Idea & Industry..." buttonLabel="Generate Strategy" colorTheme="indigo" systemInstruction={PRICING_STRATEGY_INSTRUCTION} promptTemplate={(input) => `Develop strategy for: ${input}`} defaultInput="A SaaS platform for video editing with AI." />;
      case ToolType.BRAND_AUDIT:
        return <ContentGenerator title="Brand Health Audit" description="Evaluate strengths & weaknesses." placeholder="Mission & Website copy..." buttonLabel="Run Audit" colorTheme="emerald" systemInstruction={BRAND_AUDIT_INSTRUCTION} promptTemplate={(input) => `Audit this: ${input}`} defaultInput="Audit 'Oatly' based on their current market position." />;
      case ToolType.IDENTITY_REFRESH:
        return <ContentGenerator title="Identity Refresh" description="Modernize tagline and voice." placeholder="Current Tagline & Description..." buttonLabel="Refresh Identity" colorTheme="emerald" systemInstruction={IDENTITY_REFRESH_INSTRUCTION} promptTemplate={(input) => `Refresh: ${input}`} defaultInput="Refresh the brand 'Nokia' for the modern era." />;
      case ToolType.PRODUCT_DESCRIPTION:
        return <ContentGenerator title="Product Descriptions" description="Generate multi-format copy." placeholder="Product Features..." buttonLabel="Generate Descriptions" colorTheme="emerald" systemInstruction={PRODUCT_DESCRIPTION_INSTRUCTION} promptTemplate={(input) => `Generate descriptions for: ${input}`} defaultInput="A noise-canceling headphone with 50-hour battery life." />;
      case ToolType.MARKETING_WRITER:
        return <ContentGenerator title="Marketing Content Suite" description="Generate unified campaign assets." placeholder="Campaign Topic & Offer..." buttonLabel="Generate Suite" colorTheme="emerald" systemInstruction={MARKETING_WRITER_INSTRUCTION} promptTemplate={(input) => `Create suite for: ${input}`} defaultInput="Campaign: Summer Sale for Organic Cotton Sheets." />;
      case ToolType.DOCUMENT_SUMMARIZER:
        return <ContentGenerator title="Executive Summarizer" description="Concise executive summaries." placeholder="Paste long text..." buttonLabel="Summarize" colorTheme="emerald" systemInstruction={SUMMARIZER_INSTRUCTION} promptTemplate={(input) => `Summarize: ${input}`} defaultInput="Summarize the key risks in a Series A term sheet." />;
      case ToolType.BRAND_RATIONALE:
        return <ContentGenerator title="Strategy Rationale" description="Explain the 'Why'." placeholder="Paste your brand assets (Name, Tagline, Visuals) here..." buttonLabel="Explain Strategy" colorTheme="emerald" useDefaultStructure={false} systemInstruction={RATIONALE_INSTRUCTION} promptTemplate={(input) => `Explain rationale for: ${input}`} defaultInput="Why we chose the name 'Bolt' for a delivery service." />;
      case ToolType.CONTENT_REFINERY:
        return <ContentGenerator title="Content Refinery" description="Rewrite for better tone." placeholder="Paste content..." buttonLabel="Polish Content" colorTheme="emerald" systemInstruction="Rewrite to be more persuasive and professional." promptTemplate={(input) => `Rewrite: ${input}`} defaultInput="Rewrite this email to investors to be more confident." />;
      case ToolType.VISUAL_IDENTITY:
        return <VisualIdentity mode={appMode === AppMode.STARTUP ? 'STARTUP' : 'EXISTING'} defaultInput="A geometric fox logo for a cyber-security firm, neon orange and black, minimalist style." />;
      case ToolType.COLOR_PALETTE:
        return <ColorPaletteGenerator defaultInput="A wellness brand focusing on mental clarity and calm." />;
      case ToolType.SENTIMENT_ANALYSIS:
        return <AnalyticsDashboard defaultInput="The app is great but crashes on startup. Support was helpful though." />;
      case ToolType.DASHBOARD:
      default:
        return renderDashboard();
    }
  };

  if (appMode === AppMode.NONE) {
    return <ModeSelector onSelect={handleModeSelect} />;
  }

  return (
    <Layout 
      currentMode={appMode} 
      currentTool={activeTool} 
      onToolSelect={setActiveTool}
      onExitMode={handleExitMode}
      isDarkMode={isDarkMode}
      onToggleTheme={toggleTheme}
    >
      {renderActiveTool()}
    </Layout>
  );
};

export default App;