export interface Team {
  id: number;
  name: string;
  color: string;
  resources: number;
  position: number;
  properties: string[];
  railroads: string[];
  utilities: string[];
  inTrap: boolean;
  trapTurns: number;
  getOutOfTrapFree: number;
  isEliminated?: boolean;
}

export interface BoardSpace {
  space_id: string;
  space_title: string;
  space_category: string;
  board_space: number;
  property_id?: string;
  owner: number | null;
  houses: number;
}

export interface Property {
  property_name: string;
  property_color: string;
  property_cost: number;
  base_rent: number;
  rent_with_group: number;
  rent_with_1_house: number;
  rent_with_2_house: number;
  rent_with_3_house: number;
  house_cost: number;
  board_position: number;
}

export interface Question {
  question_id: string;
  question_name: string;
  question_category: string;
  question: string;
  expected_output: string;
  question_type?: "coding" | "multiple_choice";
  options?: string[];
  correct_answer?: string;
}

export interface DiceRoll {
  die1: number;
  die2: number;
  total: number;
  isDouble: boolean;
}

export interface GameLogEntry {
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  turn: number;
  timestamp: number;
}

export interface LandingAction {
  action: 'purchase' | 'payRent' | 'drawCard' | 'tax' | 'goToJail' | 'insufficientFundsForRent' | null;
  space: BoardSpace;
  property?: Property;
  deckType?: 'chance' | 'community_chest';
  rentAmount?: number;
  ownerTeamId?: number;
  card?: {
    card_id: string;
    message: string;
    amount: number;
    type: 'credit' | 'debit';
  };
}

