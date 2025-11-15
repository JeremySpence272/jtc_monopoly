import cardsData from './cards.json';

export interface Card {
  card_id: string;
  deck_type: 'community_chest' | 'chance';
  message: string;
  amount: number;
  type: 'credit' | 'debit';
}

export const CARDS = cardsData as Card[];

export function getCardsByDeckType(deckType: 'community_chest' | 'chance'): Card[] {
  return CARDS.filter(card => card.deck_type === deckType);
}

export function getCardById(cardId: string): Card | undefined {
  return CARDS.find(card => card.card_id === cardId);
}

export function drawRandomCard(deckType: 'community_chest' | 'chance'): Card {
  const deck = getCardsByDeckType(deckType);
  const randomIndex = Math.floor(Math.random() * deck.length);
  return deck[randomIndex];
}

