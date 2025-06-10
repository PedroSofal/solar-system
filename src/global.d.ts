/// <reference types="vite-plugin-svgr/client" />

declare module '*.css';

declare module '*.glsl' {
  const value: string;
  export default value;
}

declare module '*.vert' {
  const value: string;
  export default value;
}

declare module '*.frag' {
  const value: string;
  export default value;
}

interface Mass {
  massValue: number;
  massExponent: number;
}

interface Volume {
  volValue: number;
  volExponent: number;
}

type BodyTypeOptions =
  | 'star'
  | 'planet'
  | 'moon'
  | 'dwarf-planet'
  | 'asteroid'
  | 'comet';

interface Parent {
  name: string;
  type: BodyTypeOptions;
  rel: string;
}

type ReferencePlane =
  | {
      ref: 'laplace';
      ra: number;
      dec: number;
    }
  | {
      ref: 'ecliptic';
      ra: null;
      dec: null;
    };

interface Obliquity {
  axialTilt: number;
  ra: number;
  dec: number;
}

interface BodyType {
  id: string;
  name: string;
  frenchName: string;
  englishName: string;
  description: string;
  isPlanet: boolean;
  moons: string[];
  semimajorAxis: number;
  perihelion: number | null;
  aphelion: number | null;
  eccentricity: number;
  inclination: number;
  mass: Mass | null;
  vol: Volume | null;
  density: number | null;
  gravity: number | null;
  escape: number | null;
  meanRadius: number;
  equaRadius: number | null;
  polarRadius: number | null;
  dimension: string;
  sideralOrbit: number | null;
  sideralRotation: number | null;
  parent: Parent | null;
  discoveredBy: string;
  discoveryDate: string;
  alternativeName: string;
  obliquity: Obliquity;
  avgTemp: number | null;
  mainAnomaly: number | null;
  argPeriapsis: number | null;
  longAscNode: number | null;
  bodyType: BodyTypeOptions;
  rel: string;
  apsidalPeriod: number | null;
  nodalPeriod: number | null;
  referencePlane: ReferencePlane;
  moonBodies?: BodyType[];
}

interface LayerOption {
  label: string;
  id: LayerId | string;
  subItems?: LayerOption[];
  value?: boolean;
}

type LayerId = 'label' | 'hitbox' | 'orbit' | 'ambient-light' | 'all-moons';
type ChildId = BodyTypeOptions;

interface NavItem {
  label: string;
  subItems?: NavItem[];
  id?: string;
  type?: string;
  info?: string;
  static?: boolean;
}

interface CullingPoints {
  farStart?: number;
  farEnd?: number;
  nearStart?: number;
  nearEnd?: number;
}
