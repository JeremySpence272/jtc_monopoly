import spacesData from './spaces.json';
import { BoardSpace } from '../types';

export const SPACES = spacesData as Omit<BoardSpace, 'owner' | 'houses'>[];

export function getSpaceByPosition(position: number): Omit<BoardSpace, 'owner' | 'houses'> | undefined {
  return SPACES.find(space => space.board_space === position + 1);
}

export function getSpaceById(spaceId: string): Omit<BoardSpace, 'owner' | 'houses'> | undefined {
  return SPACES.find(space => space.space_id === spaceId);
}

