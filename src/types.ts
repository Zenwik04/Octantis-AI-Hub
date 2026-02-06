export enum OctantisScope {
  UrbanEnvironment = 'Entorno Urbano',
  SmartManufacturing = 'Fabricación Inteligente',
  EnergyTransition = 'Transición Energética',
  DigitalTransformation = 'Transformación Digital'
}

export interface InvestorCriteria {
  risk: number; // 0-100
  timeHorizon: number; // 0-100
  techMaturity: number; // 0-100
}

export interface ChallengeState {
  scope: OctantisScope | '';
  description: string;
  criteria: InvestorCriteria;
}

export type DisruptionLevel = 'Incremental' | 'Radical';

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: DisruptionLevel;
  impactScore: number; // 0-100
  feasibilityScore: number; // 0-100
}

export interface BusinessCaseData {
  opportunityId: string;
  marketSizeScore: number; // 1-10
  techFeasibilityScore: number; // 1-10
  competitiveAdvantageScore: number; // 1-10
  strategicMoatScore: number; // 1-10 (New)
  risks: {
    technical: string;
    regulatory: string;
    adoption: string;
  };
  estimatedInvestment: string;
  ebitdaImpact: string;
  paybackPeriod: string; // New
  verdict: 'Quick Win' | 'Strategic Bet'; // New
  summary: string;
}

export interface RoadmapPhase {
  phaseName: string;
  duration: string;
  tasks: string[];
  kpi: string;
  resources: string;
}

export interface RoadmapData {
  opportunityId: string;
  phases: {
    validation: RoadmapPhase;
    pilot: RoadmapPhase;
    scaling: RoadmapPhase;
  };
  nextSteps48h: string[];
}
