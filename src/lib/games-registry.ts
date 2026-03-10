export interface GameMeta {
  slug: string;
  title: string;
  descriptionKey: string;
  genre: string[];
  players: '1' | '1-2' | '1-8';
  isMultiplayer: boolean;
  isLive: boolean;
  isFeatured: boolean;
  isPremium: boolean;
  thumbnail: string;
  tags: string[];
  releaseDate: string;
}

export const GAMES_REGISTRY: GameMeta[] = [
  {
    slug: 'void',
    title: 'VOID',
    descriptionKey: 'Games.void.description',
    genre: ['Horror', 'Arcade', 'Endless Runner'],
    players: '1',
    isMultiplayer: false,
    isLive: true,
    isFeatured: true,
    isPremium: false,
    thumbnail: '/og/games/void.jpg',
    tags: ['3d', 'horror', 'webgl', 'threejs', 'endless'],
    releaseDate: '2026-04-01',
  },
];

export const getAllGames = (): GameMeta[] =>
  GAMES_REGISTRY.filter((g) => g.isLive);

export const getFeaturedGames = (): GameMeta[] =>
  GAMES_REGISTRY.filter((g) => g.isLive && g.isFeatured);

export const getGameBySlug = (slug: string): GameMeta | undefined =>
  GAMES_REGISTRY.find((g) => g.slug === slug);
