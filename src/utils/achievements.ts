import { Achievement } from '../types/game';

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_win',
    title: 'First Victory',
    description: 'Complete your first puzzle',
    unlocked: false,
  },
  {
    id: 'streak_5',
    title: 'Streak Master',
    description: 'Win 5 games in a row',
    unlocked: false,
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Complete a medium puzzle in under 30 seconds',
    unlocked: false,
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Complete a hard puzzle in minimum moves',
    unlocked: false,
  },
  {
    id: 'dedicated',
    title: 'Dedicated Player',
    description: 'Play 10 games',
    unlocked: false,
  },
  {
    id: 'expert',
    title: 'Expert',
    description: 'Complete 50 puzzles',
    unlocked: false,
  },
];