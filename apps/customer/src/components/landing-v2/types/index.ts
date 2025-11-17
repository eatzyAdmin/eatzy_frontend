export interface NavItemProps {
  text: string;
  active?: boolean;
  onClick: () => void;
}

export interface SectionVisibility {
  home: boolean;
  features: boolean;
  categories: boolean;
  benefits: boolean;
  cta: boolean;
}

export interface ScrollState {
  position: number;
  showScrollTop: boolean;
  activeSection: string;
}

export interface AnimationState {
  pageLoaded: boolean;
  animationComplete: boolean;
}

export interface FeatureCardData {
  title: string;
  subtitle?: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  image?: string;
  stats?: string;
  tags?: string[];
}

export interface CategoryData {
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  image?: string;
}

export interface BenefitData {
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight?: boolean;
}

