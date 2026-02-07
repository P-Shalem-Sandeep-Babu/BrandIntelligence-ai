import { 
  Rocket, 
  Building2, 
  LayoutDashboard, 
  Palette, 
  Megaphone, 
  PenTool, 
  BarChart3, 
  MessageSquare, 
  Sparkles, 
  Pipette, 
  Compass, 
  Quote, 
  Fingerprint, 
  Heart, 
  CalendarDays, 
  LayoutTemplate, 
  ClipboardCheck, 
  RefreshCw, 
  ShoppingBag, 
  Mail, 
  FileText, 
  BrainCircuit, 
  Map, 
  DollarSign, 
  Network, 
  Store, 
  FileSignature, 
  Landmark, 
  PieChart, 
  Zap, 
  Crown,
  GitBranch,
  AlertTriangle,
  Presentation,
  Swords,
  Share2,
  Brain,
  Globe,
  TrendingUp,
  Shield,
  Handshake,
  Gavel,
  Diamond,
  LucideIcon
} from 'lucide-react';
import { AppMode, ToolType } from './types';

export const TOOL_REGISTRY: Record<ToolType, { label: string; icon: LucideIcon }> = {
  [ToolType.DASHBOARD]: { label: 'Dashboard', icon: LayoutDashboard },
  [ToolType.TOTAL_BRAND_ARCHITECT]: { label: 'Total Brand Architect', icon: Crown },
  [ToolType.BRAND_DISCOVERY]: { label: 'Brand Discovery', icon: Compass },
  [ToolType.BUSINESS_BLUEPRINT]: { label: 'Business Blueprint', icon: Map },
  [ToolType.BRAND_SIMULATOR]: { label: 'Strategy Simulator', icon: GitBranch },
  [ToolType.BRAND_EVOLUTION]: { label: 'Brand Evolution', icon: TrendingUp },
  [ToolType.CUSTOMER_OBJECTIONS]: { label: 'Objection Crusher', icon: Shield },
  [ToolType.TRUST_BUILDER]: { label: 'Trust Architect', icon: Handshake },
  [ToolType.DECISION_CRITIC]: { label: 'Strategy Critic', icon: Gavel },
  [ToolType.DIFFERENTIATION_GENERATOR]: { label: 'Differentiation Spike', icon: Diamond },
  [ToolType.FAILURE_ANALYSIS]: { label: 'Failure Analyst', icon: AlertTriangle },
  [ToolType.INVESTOR_PITCH]: { label: 'Pitch Deck Creator', icon: Presentation },
  [ToolType.COMPETITOR_ANALYSIS]: { label: 'Competitor Battlecard', icon: Swords },
  [ToolType.CUSTOMER_PSYCHOLOGY]: { label: 'Customer Psychology', icon: Brain },
  [ToolType.CULTURAL_ALIGNMENT]: { label: 'Cultural Alignment', icon: Globe },
  [ToolType.AUTO_BRAND_BUILDER]: { label: 'Auto Brand Builder', icon: Zap },
  [ToolType.BUSINESS_ECOSYSTEM]: { label: 'Business Ecosystem', icon: Network },
  [ToolType.TENANT_MIX_OPTIMIZER]: { label: 'Tenant Mix Optimizer', icon: Store },
  [ToolType.EDUCATIONAL_AGREEMENT_INSIGHTS]: { label: 'Agreement Insights', icon: FileSignature },
  [ToolType.LEGAL_CHECKLIST]: { label: 'Legal Checklist', icon: Landmark },
  [ToolType.FINANCIAL_RISK_OVERVIEW]: { label: 'Financial & Risk', icon: PieChart },
  [ToolType.NAME_GENERATOR]: { label: 'Brand Genesis', icon: Sparkles },
  [ToolType.TAGLINE_GENERATOR]: { label: 'Slogan Architect', icon: Quote },
  [ToolType.BRAND_PERSONALITY]: { label: 'Brand Personality', icon: Fingerprint },
  [ToolType.EMOTIONAL_STRATEGY]: { label: 'Emotional Strategy', icon: Heart },
  [ToolType.VISUAL_IDENTITY]: { label: 'Visual Identity', icon: Palette },
  [ToolType.COLOR_PALETTE]: { label: 'Color Palette', icon: Pipette },
  [ToolType.WEBSITE_COPY_GENERATOR]: { label: 'Landing Page Copy', icon: LayoutTemplate },
  [ToolType.LAUNCH_CAMPAIGN]: { label: 'Viral Launch', icon: Megaphone },
  [ToolType.SOCIAL_HYPE_CALENDAR]: { label: '7-Day Hype Calendar', icon: CalendarDays },
  [ToolType.PRICING_STRATEGY]: { label: 'Pricing Strategy', icon: DollarSign },
  [ToolType.MULTI_CHANNEL_ADAPTER]: { label: 'Multi-Channel Adapter', icon: Share2 },
  [ToolType.BRAND_AUDIT]: { label: 'Brand Audit', icon: ClipboardCheck },
  [ToolType.IDENTITY_REFRESH]: { label: 'Identity Refresh', icon: RefreshCw },
  [ToolType.PRODUCT_DESCRIPTION]: { label: 'Product Descriptions', icon: ShoppingBag },
  [ToolType.MARKETING_WRITER]: { label: 'Marketing Suite', icon: Mail },
  [ToolType.CONTENT_REFINERY]: { label: 'Content Refinery', icon: PenTool },
  [ToolType.DOCUMENT_SUMMARIZER]: { label: 'Doc Summarizer', icon: FileText },
  [ToolType.BRAND_RATIONALE]: { label: 'Strategy Rationale', icon: BrainCircuit },
  [ToolType.SENTIMENT_ANALYSIS]: { label: 'Sentiment Pulse', icon: BarChart3 },
  [ToolType.BRAND_CONSULTANT]: { label: 'Brand Consultant', icon: MessageSquare },
};

export interface ToolCategory {
  title: string;
  items: ToolType[];
}

export interface ModeConfig {
  label: string;
  icon: LucideIcon;
  gradient: string;
  textGradient: string;
  activeBg: string;
  activeText: string;
  categories: ToolCategory[];
}

export const MODE_CONFIGS: Record<AppMode, ModeConfig> = {
  [AppMode.STARTUP]: {
    label: 'Startup Launchpad',
    icon: Rocket,
    gradient: 'from-indigo-600 to-violet-600',
    textGradient: 'bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent',
    activeBg: 'bg-indigo-50 dark:bg-indigo-900/30',
    activeText: 'text-indigo-600 dark:text-indigo-400',
    categories: [
      {
        title: 'Phase 1: Foundation',
        items: [
          ToolType.BRAND_DISCOVERY,
          ToolType.BUSINESS_BLUEPRINT,
          ToolType.DIFFERENTIATION_GENERATOR,
          ToolType.INVESTOR_PITCH,
          ToolType.CUSTOMER_PSYCHOLOGY,
          ToolType.CUSTOMER_OBJECTIONS,
          ToolType.TRUST_BUILDER,
          ToolType.DECISION_CRITIC,
          ToolType.BRAND_SIMULATOR,
          ToolType.BRAND_EVOLUTION,
          ToolType.FAILURE_ANALYSIS,
          ToolType.COMPETITOR_ANALYSIS,
          ToolType.CULTURAL_ALIGNMENT,
          ToolType.BUSINESS_ECOSYSTEM,
          ToolType.FINANCIAL_RISK_OVERVIEW,
        ]
      },
      {
        title: 'Phase 2: Identity',
        items: [
          ToolType.AUTO_BRAND_BUILDER,
          ToolType.NAME_GENERATOR,
          ToolType.VISUAL_IDENTITY,
          ToolType.COLOR_PALETTE,
          ToolType.TAGLINE_GENERATOR,
          ToolType.BRAND_PERSONALITY,
        ]
      },
      {
        title: 'Phase 3: Launch',
        items: [
          ToolType.LAUNCH_CAMPAIGN,
          ToolType.SOCIAL_HYPE_CALENDAR,
          ToolType.MULTI_CHANNEL_ADAPTER,
          ToolType.WEBSITE_COPY_GENERATOR,
          ToolType.PRICING_STRATEGY,
        ]
      },
      {
        title: 'Phase 4: Compliance',
        items: [
          ToolType.TENANT_MIX_OPTIMIZER,
          ToolType.EDUCATIONAL_AGREEMENT_INSIGHTS,
          ToolType.LEGAL_CHECKLIST,
        ]
      },
      {
        title: 'All-in-One Engine',
        items: [ToolType.TOTAL_BRAND_ARCHITECT]
      }
    ]
  },
  [AppMode.EXISTING]: {
    label: 'Enterprise Suite',
    icon: Building2,
    gradient: 'from-emerald-600 to-teal-600',
    textGradient: 'bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent',
    activeBg: 'bg-emerald-50 dark:bg-emerald-900/30',
    activeText: 'text-emerald-600 dark:text-emerald-400',
    categories: [
      {
        title: 'Brand Intelligence',
        items: [
          ToolType.BRAND_AUDIT,
          ToolType.BRAND_EVOLUTION,
          ToolType.DIFFERENTIATION_GENERATOR,
          ToolType.CUSTOMER_OBJECTIONS,
          ToolType.TRUST_BUILDER,
          ToolType.DECISION_CRITIC,
          ToolType.COMPETITOR_ANALYSIS,
          ToolType.CUSTOMER_PSYCHOLOGY,
          ToolType.CULTURAL_ALIGNMENT,
          ToolType.BRAND_SIMULATOR,
          ToolType.FAILURE_ANALYSIS,
          ToolType.SENTIMENT_ANALYSIS,
          ToolType.BRAND_RATIONALE,
        ]
      },
      {
        title: 'Content & Messaging',
        items: [
          ToolType.MARKETING_WRITER,
          ToolType.PRODUCT_DESCRIPTION,
          ToolType.CONTENT_REFINERY,
          ToolType.MULTI_CHANNEL_ADAPTER,
          ToolType.IDENTITY_REFRESH,
        ]
      },
      {
        title: 'Executive Tools',
        items: [
          ToolType.DOCUMENT_SUMMARIZER,
          ToolType.BRAND_CONSULTANT,
        ]
      },
      {
        title: 'All-in-One Engine',
        items: [ToolType.TOTAL_BRAND_ARCHITECT]
      }
    ]
  },
  [AppMode.NONE]: {
    label: '',
    icon: Building2,
    gradient: 'from-slate-600 to-slate-600',
    textGradient: '',
    activeBg: 'bg-slate-100',
    activeText: 'text-slate-900',
    categories: []
  }
};