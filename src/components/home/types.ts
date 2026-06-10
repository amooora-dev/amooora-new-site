import type { CSSProperties } from 'react';

export type AccentProps = {
  accent: string;
};

export type MobileProps = {
  isMobile: boolean;
};

export type SectionProps = AccentProps & MobileProps;

export type NavProps = AccentProps & MobileProps & {
  dir: 'A' | 'B';
};

export type ManifestoProps = AccentProps & MobileProps & {
  dir: 'A' | 'B';
};

export type HeroProps = AccentProps & MobileProps & {
  particles: boolean;
};

export type HeroBProps = AccentProps & {
  particles: boolean;
};

export type ParticleCanvasProps = {
  color: string;
  active: boolean;
};

export type ManifestoParagraph = {
  big: boolean;
  text: string;
};

export type IntroParagraphStyle = (marginBottom: number) => CSSProperties;
