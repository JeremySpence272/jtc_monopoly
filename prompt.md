# Detailed Prompt for Rebuilding Monopoly Game in React + TypeScript

## Overview

Rebuild the Monopoly game as a React + TypeScript application using Vite. The game should use the JSON data files (spaces.json, properties.json, questions.json, categories.json) and maintain all the original functionality from the vanilla JavaScript version.

## Project Setup

### 1. Initialize Vite + React + TypeScript

```bash
npm create vite@latest . -- --template react-ts
npm install
```

### 2. Install Additional Dependencies

```bash
npm install @codemirror/view @codemirror/state @codemirror/lang-python @codemirror/theme-one-dark @codemirror/commands @codemirror/autocomplete @codemirror/fold @codemirror/matchbrackets @codemirror/search @codemirror/lint
```

## Data Structure

### TypeScript Interfaces

Create `src/types.ts` with:

- `Team`: id, name, color, resources, position, properties[], railroads[], utilities[], inTrap, trapTurns, getOutOfTrapFree
- `BoardSpace`: space_id, space_title, space_category, board_space (1-40), property_id (optional), owner (team id or null), houses (0-2)
- `Property`: property_name, property_color, property_cost, base_rent, rent_with_group, rent_with_1_house, rent_with_2_house, house_cost
- `Question`: question_id, question_name, question_category, question, expected_output
- `DiceRoll`: die1, die2, total, isDouble
- `GameLogEntry`: message, type, turn, timestamp
- `LandingAction`: action type ('purchase', 'payRent', 'drawCard', 'tax'), space, property (optional), deckType (optional)

### Data Loaders

Create data loader files that import from JSON:

- `src/data/spaces.ts`: Load spaces.json, export SPACES array and helper functions
- `src/data/properties.ts`: Load properties.json, export PROPERTIES object keyed by property_id
- `src/data/questions.ts`: Load questions.json, export QUESTIONS object and getQuestionByPropertyId()
- `src/data/categories.ts`: Load categories.json, export CATEGORIES object

## Game Logic (src/game/Game.ts)

### MonopolyGame Class Structure

#### Constructor

- Initialize 4 teams with 1500 resources each, position 0
- Initialize empty card decks (Community Chest and Chance - placeholder for now)
- Call `createBoard()` to set up boardSpaces array
- Initialize gameLog, turnNumber (0), currentTeamIndex (0), doubleCount (0)

#### createBoard()

- Map SPACES array to BoardSpace[] with owner: null, houses: 0
- Return the array (board spaces are 1-indexed in JSON, but use 0-indexed internally for positions)

#### Core Methods

1. **getCurrentTeam()**: Return teams[currentTeamIndex]
2. **addLog(message, type)**: Add entry to gameLog (unshift, max 50 entries)
3. **rollDice()**: Return { die1, die2, total, isDouble }
4. **moveTeam(team, spaces)**:
   - Update team.position = (position + spaces) % 40
   - If passed GO (position wraps), add 200 resources
   - Return new position
5. **getSpaceAtPosition(position)**: Find space where board_space === position + 1
6. **handleLanding(team, space)**: Async function
   - Log landing message
   - Switch on space.space_category:
     - 'corner': Handle GO, Jail, Free Parking, Go To Jail
     - 'property': Check owner, return { action: 'purchase' } or { action: 'payRent' }
     - 'railroad': Check owner, return purchase or payRent
     - 'utility': Check owner, return purchase or payRent
     - 'community_chest'/'chance': Return { action: 'drawCard', deckType }
     - 'tax': Deduct tax, return null
7. **purchaseSpace(team, space, property?)**:
   - Check if team can afford (property.property_cost or fixed costs for railroads/utilities)
   - Deduct cost, set space.owner = team.id
   - Add to team.properties/railroads/utilities array
   - Log success, return true/false
8. **calculateRent(space, ownerTeam, diceRoll?)**:
   - Properties: Check houses, use property rent values
   - Railroads: 25 \* number of railroads owned
   - Utilities: 4x or 10x dice roll (if 2 utilities owned)
9. **payRent(payingTeam, receivingTeam, amount, space)**: Transfer resources, log
10. **ownsCompleteColorGroup(team, color)**: Check if team owns all properties of that color
11. **canBuildHouse(team, propertyId)**:
    - Must own property, own complete color group, houses < 2, build evenly
12. **buildHouse(team, propertyId)**: Check canBuild, deduct cost, increment houses
13. **nextTurn()**: Increment currentTeamIndex, turnNumber, reset doubleCount, log new turn

## React Components

### 1. App.tsx (Main Component)

**State:**

- `game: MonopolyGame | null`
- `gameState`: { teams, currentTeam, turnNumber, boardSpaces, gameLog }
- `purchaseModal`: { isOpen, space, property, question }
- `diceRoll: DiceRoll | null`
- `isRolling: boolean`

**Methods:**

- `updateGameState()`: Extract state from game instance
- `handleRollDice()`:
  - Disable roll button
  - Check if in jail (handle jail logic)
  - Roll dice, animate, move team
  - Call handleLanding, show appropriate modal/button
  - Handle doubles (allow roll again)
  - Handle three doubles (go to jail)
- `handleEndTurn()`: Call game.nextTurn(), update state, reset UI
- `handleSpaceClick(space)`: Open purchase modal if property
- `handlePurchase()`: Call game.purchaseSpace(), close modal, update state
- `handleDecline()`: Close modal, show end turn button

**Render:**

- Header with game title, turn counter, rules button, end game button
- Three-column layout: Teams panel (left), Board (center), Game Log (right)
- Dice controls in center of board
- Action buttons (End Turn, Build Houses) shown contextually
- PurchaseModal component
- CardModal component (for Chance/Community Chest)

### 2. GameBoard.tsx

**Props:** boardSpaces, teams, onSpaceClick

**Layout Logic:**

- Create 11x11 grid layout
- Bottom row (positions 0-10): row 11, columns 11 down to 1
- Right column (positions 11-19): rows 10 down to 1, column 1
- Top row (positions 20-30): row 1, columns 1 to 11
- Left column (positions 31-39): rows 2 to 10, column 11

**Render Each Space:**

- Find space by board_space (1-indexed) matching position (0-indexed) + 1
- Show space.space_title
- If property: Show cost, rent info, houses indicator
- Show owner color indicator if owned
- Show team tokens on space (filter teams by position)
- Apply CSS classes: board-space, space_category, corner (if 0/10/20/30), owned
- Border color for properties based on property_color

### 3. PurchaseModal.tsx

**Props:** space, property, question, isOpen, onClose, onPurchase, onDecline, backendUrl

**Features:**

- Show property details (cost, rents, house cost)
- Show question/challenge if property has question
- CodeMirror 6 editor for Python code
- Test Code button (calls backend /test-code endpoint)
- Clear button (resets editor)
- Test result display (success/error, output, validation)
- Purchase and Decline buttons

**CodeMirror Setup:**

- Use EditorView and EditorState from @codemirror/view and @codemirror/state
- Extensions: python(), oneDark(), lineNumbers(), foldGutter(), bracketMatching(), closeBrackets(), autocompletion(), history(), keymap()
- Initialize in useEffect with useRef

**Test Code Function:**

- POST to backendUrl/test-code with { code: string }
- Display result: success, valid, output, error, test_result
- Show validation status and output

### 4. TeamPanel.tsx

**Props:** teams, currentTeam

**Render:**

- List of team cards
- Each card shows: name, color token, resources, properties count, railroads count, utilities count, complete groups count
- Highlight current team with 'active' class
- Show "In Jail" indicator if inTrap

### 5. GameLog.tsx

**Props:** gameLog

**Render:**

- List of log entries (last 20)
- Color code by type: info (default), success (green), warning (yellow), error (red)
- Show timestamp and message

### 6. DiceControls.tsx

**Props:** onRoll, onEndTurn, canRoll, isRolling, lastRoll, currentTeam

**Render:**

- Roll Dice button (disabled when canRoll is false or isRolling is true)
- Dice display (show die1, die2, total when rolled)
- End Turn button (shown after move is complete)
- Build Houses button (shown if team can build)
- Current team status text

## UI Flow

### Turn Sequence

1. **Start of Turn:**

   - Show "Roll Dice" button
   - Hide action buttons
   - Show current team name and status

2. **Roll Dice:**

   - Disable button, show loading
   - Animate dice (random numbers for ~1 second)
   - Show final dice result
   - Move team token
   - Call handleLanding()

3. **After Landing:**

   - If unowned property: Show PurchaseModal
   - If owned property: Calculate and pay rent, show result
   - If Chance/Community Chest: Show CardModal
   - If doubles: Show "Roll Again" button
   - If not doubles: Show "End Turn" button

4. **End Turn:**
   - Call game.nextTurn()
   - Reset UI to start of turn state
   - Update all displays

## Styling

### CSS Structure

- Import existing styles.css (keep all original styles)
- Game board uses CSS Grid (11x11)
- Board spaces styled with .board-space class
- Property colors shown as border-top-color
- Team tokens as colored circles
- Modals use existing modal styles

### Key CSS Classes

- `.game-container`: Main container
- `.game-board`: 11x11 grid container
- `.board-space`: Individual space styling
- `.board-space.property`: Property-specific styles
- `.board-space.corner`: Corner space styling
- `.board-space.owned`: Visual indicator for owned properties
- `.team-card.active`: Current team highlight
- `.modal`: Modal overlay
- `.purchase-modal-content`: Purchase modal styling

## Backend Integration

### Code Testing Endpoint

- URL: `http://localhost:5000/test-code`
- Method: POST
- Body: `{ code: string }`
- Response: `{ success: boolean, valid: boolean, output: string, error?: string, test_result?: { message: string, tests?: Record<string, boolean> } }`

### Error Handling

- Show connection error if backend unavailable
- Display execution errors clearly
- Show validation results with pass/fail indicators

## Key Features to Implement

1. **Dice Rolling:**

   - Animate dice before showing result
   - Handle doubles (allow roll again)
   - Handle three doubles (go to jail)
   - Track double count

2. **Movement:**

   - Smooth token movement (CSS transitions)
   - Pass GO detection (add 200 resources)
   - Position wrapping (0-39)

3. **Property Purchase:**

   - Show property details
   - Show code challenge question
   - Code editor with syntax highlighting
   - Test code against backend
   - Purchase/Decline options

4. **Rent Payment:**

   - Calculate rent based on property state
   - Handle railroads (25 \* count)
   - Handle utilities (4x or 10x dice)
   - Transfer resources automatically

5. **House Building:**

   - Check if can build (own property, own group, build evenly)
   - Show build modal with available properties
   - Build houses (max 2 per property)
   - Update rent calculation

6. **Jail System:**

   - Go to Jail space
   - Pay to get out (50)
   - Roll doubles to get out
   - Use Get Out of Jail Free card
   - Track trap turns

7. **Card System:**

   - Draw Chance/Community Chest cards
   - Show card modal with description
   - Execute card effects
   - Handle special cards

8. **Game End:**
   - Calculate final scores
   - Show score breakdown
   - Declare winner

## Data Mapping

### Property ID Format

- Properties in spaces.json use property_id like "mediterranean_avenue"
- Properties in properties.json are keyed by property_name converted to lowercase with underscores
- Questions are mapped: property_id "mediterranean_avenue" → question_id "mediterranean_q1"

### Position Mapping

- Internal positions: 0-39 (0-indexed)
- JSON board_space: 1-40 (1-indexed)
- Conversion: position (internal) + 1 = board_space (JSON)

## Testing Checklist

- [ ] Game initializes with 4 teams, 1500 resources each
- [ ] Board renders all 40 spaces correctly
- [ ] Dice rolling works and animates
- [ ] Team movement works
- [ ] Pass GO detection works (adds 200)
- [ ] Property purchase modal opens
- [ ] Code editor works in purchase modal
- [ ] Code testing connects to backend
- [ ] Property purchase completes successfully
- [ ] Rent calculation is correct
- [ ] Rent payment works
- [ ] House building works
- [ ] Jail system works
- [ ] Card drawing works
- [ ] Turn progression works
- [ ] Game log updates
- [ ] Team panel updates
- [ ] End game scoring works

## Notes

- Keep the original styles.css for consistent styling
- Use React hooks (useState, useEffect, useRef) for state management
- Use TypeScript for type safety
- Handle async operations properly (landing, card drawing)
- Ensure proper cleanup of event listeners and CodeMirror instances
- Test with the Python backend server running on localhost:5000
