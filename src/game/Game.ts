import { Team, BoardSpace, Property, DiceRoll, GameLogEntry, LandingAction } from '../types';
import { SPACES } from '../data/spaces';
import { getPropertyById } from '../data/properties';
import { getCategoryByColor } from '../data/categories';
import { drawRandomCard, Card } from '../data/cards';

export class MonopolyGame {
  teams: Team[];
  boardSpaces: BoardSpace[];
  gameLog: GameLogEntry[];
  turnNumber: number;
  currentTeamIndex: number;
  doubleCount: number;
  communityChestDeck: any[];
  chanceDeck: any[];

  constructor() {
    this.teams = [
      { id: 0, name: 'Team 1', color: '#FF0000', resources: 1500, position: 0, properties: [], railroads: [], utilities: [], inTrap: false, trapTurns: 0, getOutOfTrapFree: 0 },
      { id: 1, name: 'Team 2', color: '#0000FF', resources: 1500, position: 0, properties: [], railroads: [], utilities: [], inTrap: false, trapTurns: 0, getOutOfTrapFree: 0 },
      { id: 2, name: 'Team 3', color: '#00FF00', resources: 1500, position: 0, properties: [], railroads: [], utilities: [], inTrap: false, trapTurns: 0, getOutOfTrapFree: 0 },
      { id: 3, name: 'Team 4', color: '#FFFF00', resources: 1500, position: 0, properties: [], railroads: [], utilities: [], inTrap: false, trapTurns: 0, getOutOfTrapFree: 0 },
    ];
    this.communityChestDeck = [];
    this.chanceDeck = [];
    this.boardSpaces = this.createBoard();
    this.gameLog = [];
    this.turnNumber = 0;
    this.currentTeamIndex = 0;
    this.doubleCount = 0;
    this.addLog('Game started!', 'info');
  }

  createBoard(): BoardSpace[] {
    return SPACES.map(space => ({
      ...space,
      owner: null,
      houses: 0,
    }));
  }

  getCurrentTeam(): Team {
    return this.teams[this.currentTeamIndex];
  }

  addLog(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info'): void {
    const entry: GameLogEntry = {
      message,
      type,
      turn: this.turnNumber,
      timestamp: Date.now(),
    };
    this.gameLog.unshift(entry);
    if (this.gameLog.length > 50) {
      this.gameLog = this.gameLog.slice(0, 50);
    }
  }

  rollDice(): DiceRoll {
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    return {
      die1,
      die2,
      total: die1 + die2,
      isDouble: die1 === die2,
    };
  }

  moveTeam(team: Team, spaces: number): number {
    const oldPosition = team.position;
    team.position = (team.position + spaces) % 40;
    
    // Check if passed GO (wrapped around)
    if (team.position < oldPosition) {
      team.resources += 200;
      this.addLog(`${team.name} passed GO and collected $200!`, 'success');
    }
    
    return team.position;
  }

  getSpaceAtPosition(position: number): BoardSpace | undefined {
    return this.boardSpaces.find(space => space.board_space === position + 1);
  }

  async handleLanding(team: Team, space: BoardSpace, diceRoll?: DiceRoll): Promise<LandingAction> {
    this.addLog(`${team.name} landed on ${space.space_title}`, 'info');

    switch (space.space_category) {
      case 'corner':
        if (space.space_id === 'go') {
          // Already handled in moveTeam
          return { action: null, space };
        } else if (space.space_id === 'go_to_jail') {
          team.position = 10; // Jail position
          team.inTrap = true;
          team.trapTurns = 0;
          this.addLog(`${team.name} was sent to Jail!`, 'warning');
          return { action: null, space };
        } else if (space.space_id === 'jail') {
          // Just visiting
          return { action: null, space };
        } else if (space.space_id === 'free_parking') {
          // Free parking - nothing happens
          return { action: null, space };
        }
        return { action: null, space };

      case 'property':
        if (space.property_id) {
          const property = getPropertyById(space.property_id);
          if (!property) return { action: null, space };

          if (space.owner === null) {
            return { action: 'purchase', space, property };
          } else if (space.owner !== team.id) {
            const ownerTeam = this.teams[space.owner];
            const rent = this.calculateRent(space, ownerTeam, diceRoll);
            this.payRent(team, ownerTeam, rent, space);
            return { action: 'payRent', space, property, rentAmount: rent };
          }
        }
        return { action: null, space };

      case 'railroad':
        if (space.owner === null) {
          return { action: 'purchase', space };
        } else if (space.owner !== team.id) {
          const ownerTeam = this.teams[space.owner];
          const rent = this.calculateRent(space, ownerTeam, diceRoll);
          this.payRent(team, ownerTeam, rent, space);
          return { action: 'payRent', space, rentAmount: rent };
        }
        return { action: null, space };

      case 'utility':
        if (space.owner === null) {
          return { action: 'purchase', space };
        } else if (space.owner !== team.id) {
          const ownerTeam = this.teams[space.owner];
          const rent = this.calculateRent(space, ownerTeam, diceRoll);
          this.payRent(team, ownerTeam, rent, space);
          return { action: 'payRent', space, rentAmount: rent };
        }
        return { action: null, space };

      case 'community_chest':
        const ccCard = drawRandomCard('community_chest');
        this.applyCardEffect(team, ccCard);
        return { 
          action: 'drawCard', 
          space, 
          deckType: 'community_chest',
          card: {
            card_id: ccCard.card_id,
            message: ccCard.message,
            amount: ccCard.amount,
            type: ccCard.type,
          }
        };

      case 'chance':
        const chanceCard = drawRandomCard('chance');
        this.applyCardEffect(team, chanceCard);
        return { 
          action: 'drawCard', 
          space, 
          deckType: 'chance',
          card: {
            card_id: chanceCard.card_id,
            message: chanceCard.message,
            amount: chanceCard.amount,
            type: chanceCard.type,
          }
        };

      case 'tax':
        const taxAmount = space.space_id === 'income_tax' ? 200 : 100;
        team.resources -= taxAmount;
        this.addLog(`${team.name} paid $${taxAmount} in taxes`, 'warning');
        return { action: 'tax', space };

      default:
        return { action: null, space };
    }
  }

  purchaseSpace(team: Team, space: BoardSpace, property?: Property): boolean {
    let cost = 0;
    
    if (space.space_category === 'property' && property) {
      cost = property.property_cost;
    } else if (space.space_category === 'railroad') {
      cost = 200;
    } else if (space.space_category === 'utility') {
      cost = 150;
    }

    if (team.resources < cost) {
      this.addLog(`${team.name} cannot afford ${space.space_title}`, 'error');
      return false;
    }

    team.resources -= cost;
    space.owner = team.id;

    if (space.space_category === 'property' && space.property_id) {
      team.properties.push(space.property_id);
    } else if (space.space_category === 'railroad') {
      team.railroads.push(space.space_id);
    } else if (space.space_category === 'utility') {
      team.utilities.push(space.space_id);
    }

    this.addLog(`${team.name} purchased ${space.space_title} for $${cost}`, 'success');
    return true;
  }

  calculateRent(space: BoardSpace, ownerTeam: Team, diceRoll?: DiceRoll): number {
    if (space.space_category === 'property' && space.property_id) {
      const property = getPropertyById(space.property_id);
      if (!property) return 0;

      if (space.houses === 2) {
        return property.rent_with_2_house;
      } else if (space.houses === 1) {
        return property.rent_with_1_house;
      } else if (this.ownsCompleteColorGroup(ownerTeam, property.property_color)) {
        return property.rent_with_group;
      } else {
        return property.base_rent;
      }
    } else if (space.space_category === 'railroad') {
      // Railroad rent: $25 for 1, $50 for 2, $100 for 3, $200 for 4
      const count = ownerTeam.railroads.length;
      if (count === 1) return 25;
      if (count === 2) return 50;
      if (count === 3) return 100;
      if (count === 4) return 200;
      return 0;
    } else if (space.space_category === 'utility') {
      // Utility rent: 4x dice for 1 utility, 10x dice for 2 utilities
      if (!diceRoll) return 0;
      const multiplier = ownerTeam.utilities.length === 2 ? 10 : 4;
      return diceRoll.total * multiplier;
    }
    return 0;
  }

  payRent(payingTeam: Team, receivingTeam: Team, amount: number, space: BoardSpace): void {
    if (payingTeam.resources < amount) {
      payingTeam.resources = 0;
      receivingTeam.resources += payingTeam.resources;
      this.addLog(`${payingTeam.name} went bankrupt paying rent to ${receivingTeam.name}!`, 'error');
    } else {
      payingTeam.resources -= amount;
      receivingTeam.resources += amount;
      this.addLog(`${payingTeam.name} paid $${amount} rent to ${receivingTeam.name} for ${space.space_title}`, 'info');
    }
  }

  applyCardEffect(team: Team, card: Card): void {
    if (card.type === 'credit') {
      team.resources += card.amount;
      this.addLog(`${team.name} collected $${card.amount} from card`, 'success');
    } else {
      // debit
      if (team.resources < card.amount) {
        this.addLog(`${team.name} cannot afford to pay $${card.amount} from card`, 'error');
        return;
      }
      team.resources -= card.amount;
      this.addLog(`${team.name} paid $${card.amount} from card`, 'warning');
    }
  }

  ownsCompleteColorGroup(team: Team, color: string): boolean {
    const category = getCategoryByColor(color);
    if (!category) return false;

    // Count all properties with this color
    const allPropertiesWithColor = this.boardSpaces.filter(
      space => space.property_id && 
      getPropertyById(space.property_id)?.property_color === color
    );
    const totalPropertiesInGroup = allPropertiesWithColor.length;

    // Count properties owned by this team with this color
    const ownedProperties = this.boardSpaces.filter(
      space => space.owner === team.id && 
      space.property_id && 
      getPropertyById(space.property_id)?.property_color === color
    );

    return ownedProperties.length === totalPropertiesInGroup && totalPropertiesInGroup > 0;
  }

  canBuildHouse(team: Team, propertyId: string): boolean {
    const space = this.boardSpaces.find(s => s.property_id === propertyId && s.owner === team.id);
    if (!space) return false;

    const property = getPropertyById(propertyId);
    if (!property) return false;

    // Must own complete color group
    if (!this.ownsCompleteColorGroup(team, property.property_color)) {
      return false;
    }

    // Can't build more than 2 houses
    if (space.houses >= 2) return false;

    // Check if can afford
    if (team.resources < property.house_cost) return false;

    // Build evenly - check if other properties in group have fewer houses
    const groupSpaces = this.boardSpaces.filter(
      s => s.property_id && 
      getPropertyById(s.property_id)?.property_color === property.property_color &&
      s.owner === team.id
    );

    const minHouses = Math.min(...groupSpaces.map(s => s.houses));
    if (space.houses > minHouses) return false;

    return true;
  }

  buildHouse(team: Team, propertyId: string): boolean {
    if (!this.canBuildHouse(team, propertyId)) {
      return false;
    }

    const space = this.boardSpaces.find(s => s.property_id === propertyId);
    const property = getPropertyById(propertyId);
    if (!space || !property) return false;

    team.resources -= property.house_cost;
    space.houses += 1;
    this.addLog(`${team.name} built a house on ${property.property_name} for $${property.house_cost}`, 'success');
    return true;
  }

  canSellHouse(team: Team, propertyId: string): boolean {
    const space = this.boardSpaces.find(s => s.property_id === propertyId && s.owner === team.id);
    if (!space || space.houses === 0) return false;

    const property = getPropertyById(propertyId);
    if (!property) return false;

    // Must own complete color group
    if (!this.ownsCompleteColorGroup(team, property.property_color)) {
      return false;
    }

    // Sell evenly - check if other properties in group have more houses
    const groupSpaces = this.boardSpaces.filter(
      s => s.property_id && 
      getPropertyById(s.property_id)?.property_color === property.property_color &&
      s.owner === team.id
    );

    const maxHouses = Math.max(...groupSpaces.map(s => s.houses));
    if (space.houses < maxHouses) return false;

    return true;
  }

  sellHouse(team: Team, propertyId: string): boolean {
    if (!this.canSellHouse(team, propertyId)) {
      return false;
    }

    const space = this.boardSpaces.find(s => s.property_id === propertyId);
    const property = getPropertyById(propertyId);
    if (!space || !property) return false;

    const sellPrice = Math.floor(property.house_cost * 0.5);
    team.resources += sellPrice;
    space.houses -= 1;
    this.addLog(`${team.name} sold a house on ${property.property_name} for $${sellPrice}`, 'info');
    return true;
  }

  sellProperty(team: Team, space: BoardSpace, property?: Property): boolean {
    if (space.owner !== team.id) return false;

    let cost = 0;
    if (property) {
      cost = property.property_cost;
    } else if (space.space_category === 'railroad') {
      cost = 200;
    } else if (space.space_category === 'utility') {
      cost = 150;
    }

    const sellPrice = Math.floor(cost * 0.8);
    
    // Remove houses first (sell them back)
    if (space.houses > 0 && property) {
      const houseSellPrice = Math.floor(property.house_cost * 0.5);
      team.resources += houseSellPrice * space.houses;
      space.houses = 0;
    }

    team.resources += sellPrice;
    space.owner = null;

    // Remove from team's property lists
    if (space.space_category === 'property' && space.property_id) {
      const index = team.properties.indexOf(space.property_id);
      if (index > -1) team.properties.splice(index, 1);
    } else if (space.space_category === 'railroad') {
      const index = team.railroads.indexOf(space.space_id);
      if (index > -1) team.railroads.splice(index, 1);
    } else if (space.space_category === 'utility') {
      const index = team.utilities.indexOf(space.space_id);
      if (index > -1) team.utilities.splice(index, 1);
    }

    this.addLog(`${team.name} sold ${space.space_title} to the bank for $${sellPrice}`, 'info');
    return true;
  }

  sellPropertyToTeam(seller: Team, buyer: Team, space: BoardSpace, price: number): boolean {
    if (space.owner !== seller.id) return false;
    if (seller.id === buyer.id) return false; // Can't sell to yourself
    if (buyer.resources < price) {
      this.addLog(`${buyer.name} cannot afford to buy ${space.space_title} for $${price}`, 'error');
      return false;
    }

    // Transfer funds
    buyer.resources -= price;
    seller.resources += price;

    // Transfer ownership
    space.owner = buyer.id;

    // Remove from seller's property lists
    if (space.space_category === 'property' && space.property_id) {
      const index = seller.properties.indexOf(space.property_id);
      if (index > -1) seller.properties.splice(index, 1);
      buyer.properties.push(space.property_id);
    } else if (space.space_category === 'railroad') {
      const index = seller.railroads.indexOf(space.space_id);
      if (index > -1) seller.railroads.splice(index, 1);
      buyer.railroads.push(space.space_id);
    } else if (space.space_category === 'utility') {
      const index = seller.utilities.indexOf(space.space_id);
      if (index > -1) seller.utilities.splice(index, 1);
      buyer.utilities.push(space.space_id);
    }

    // Houses stay with the property
    this.addLog(`${seller.name} sold ${space.space_title} to ${buyer.name} for $${price}`, 'success');
    return true;
  }

  nextTurn(): void {
    this.currentTeamIndex = (this.currentTeamIndex + 1) % this.teams.length;
    if (this.currentTeamIndex === 0) {
      this.turnNumber += 1;
    }
    this.doubleCount = 0;
    const currentTeam = this.getCurrentTeam();
    this.addLog(`Turn ${this.turnNumber + 1}: ${currentTeam.name}'s turn`, 'info');
  }

  handleJailRoll(team: Team, diceRoll: DiceRoll): boolean {
    if (diceRoll.isDouble) {
      team.inTrap = false;
      team.trapTurns = 0;
      this.addLog(`${team.name} rolled doubles and got out of jail!`, 'success');
      return true;
    } else {
      team.trapTurns += 1;
      if (team.trapTurns >= 3) {
        team.resources -= 50;
        team.inTrap = false;
        team.trapTurns = 0;
        this.addLog(`${team.name} paid $50 to get out of jail`, 'warning');
        return true;
      }
      this.addLog(`${team.name} is still in jail (turn ${team.trapTurns}/3)`, 'info');
      return false;
    }
  }

  payToGetOutOfJail(team: Team): boolean {
    if (team.resources >= 50) {
      team.resources -= 50;
      team.inTrap = false;
      team.trapTurns = 0;
      this.addLog(`${team.name} paid $50 to get out of jail`, 'warning');
      return true;
    }
    return false;
  }

  useGetOutOfJailFree(team: Team): boolean {
    if (team.getOutOfTrapFree > 0) {
      team.getOutOfTrapFree -= 1;
      team.inTrap = false;
      team.trapTurns = 0;
      this.addLog(`${team.name} used a Get Out of Jail Free card!`, 'success');
      return true;
    }
    return false;
  }

  toJSON(): string {
    return JSON.stringify({
      teams: this.teams,
      boardSpaces: this.boardSpaces,
      gameLog: this.gameLog,
      turnNumber: this.turnNumber,
      currentTeamIndex: this.currentTeamIndex,
      doubleCount: this.doubleCount,
    });
  }

  static fromJSON(json: string): MonopolyGame {
    const data = JSON.parse(json);
    const game = new MonopolyGame();
    
    game.teams = data.teams;
    game.boardSpaces = data.boardSpaces;
    game.gameLog = data.gameLog;
    game.turnNumber = data.turnNumber;
    game.currentTeamIndex = data.currentTeamIndex;
    game.doubleCount = data.doubleCount || 0;
    
    return game;
  }
}

