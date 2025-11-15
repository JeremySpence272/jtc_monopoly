import { useState, useEffect } from "react";
import { MonopolyGame } from "./game/Game";
import { Team, BoardSpace, Property, DiceRoll } from "./types";
import { GameBoard } from "./components/GameBoard";
import { TeamPanel } from "./components/TeamPanel";
import { GameLog } from "./components/GameLog";
import { DiceControls } from "./components/DiceControls";
import { PurchaseModal } from "./components/PurchaseModal";
import { CardModal } from "./components/CardModal";
import { ManagePropertyModal } from "./components/ManagePropertyModal";
import { getPropertyById, getPropertyByPosition } from "./data/properties";
import { getQuestionByPropertyId, getQuestionById } from "./data/questions";
import "./App.css";

const STORAGE_KEY = "monopoly_game_state";

interface GameState {
  teams: Team[];
  currentTeam: Team;
  turnNumber: number;
  boardSpaces: BoardSpace[];
  gameLog: any[];
}

function App() {
  const [game, setGame] = useState<MonopolyGame | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [purchaseModal, setPurchaseModal] = useState<{
    isOpen: boolean;
    space: BoardSpace | null;
    property: Property | null;
    question: any | null;
  }>({
    isOpen: false,
    space: null,
    property: null,
    question: null,
  });
  const [cardModal, setCardModal] = useState<{
    isOpen: boolean;
    card: {
      message: string;
      amount: number;
      type: "credit" | "debit";
    } | null;
    deckType?: "chance" | "community_chest";
  }>({
    isOpen: false,
    card: null,
    deckType: undefined,
  });
  const [manageModal, setManageModal] = useState<{
    isOpen: boolean;
    space: BoardSpace | null;
    property: Property | null;
  }>({
    isOpen: false,
    space: null,
    property: null,
  });
  const [diceRoll, setDiceRoll] = useState<DiceRoll | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [canRoll, setCanRoll] = useState(true);

  useEffect(() => {
    // Try to load saved game
    const savedState = localStorage.getItem(STORAGE_KEY);
    let newGame: MonopolyGame;

    if (savedState) {
      try {
        newGame = MonopolyGame.fromJSON(savedState);
      } catch (error) {
        console.error("Error loading saved game:", error);
        newGame = new MonopolyGame();
      }
    } else {
      newGame = new MonopolyGame();
    }

    setGame(newGame);
    updateGameState(newGame);
  }, []);

  const updateGameState = (gameInstance: MonopolyGame) => {
    setGameState({
      teams: gameInstance.teams,
      currentTeam: gameInstance.getCurrentTeam(),
      turnNumber: gameInstance.turnNumber,
      boardSpaces: gameInstance.boardSpaces,
      gameLog: gameInstance.gameLog,
    });

    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, gameInstance.toJSON());
    } catch (error) {
      console.error("Error saving game state:", error);
    }
  };

  const handleRollDice = async () => {
    if (!game || !canRoll || isRolling) return;

    const currentTeam = game.getCurrentTeam();

    // Handle jail logic
    if (currentTeam.inTrap) {
      const roll = game.rollDice();
      setDiceRoll(roll);
      const gotOut = game.handleJailRoll(currentTeam, roll);
      updateGameState(game);

      if (!gotOut) {
        setCanRoll(false);
        return;
      }
    }

    setIsRolling(true);
    setCanRoll(false);

    // Animate dice
    const animationInterval = setInterval(() => {
      setDiceRoll({
        die1: Math.floor(Math.random() * 6) + 1,
        die2: Math.floor(Math.random() * 6) + 1,
        total: 0,
        isDouble: false,
      });
    }, 100);

    setTimeout(async () => {
      clearInterval(animationInterval);
      const roll = game.rollDice();
      setDiceRoll(roll);

      // Handle three doubles
      if (roll.isDouble) {
        game.doubleCount += 1;
        if (game.doubleCount >= 3) {
          currentTeam.position = 10;
          currentTeam.inTrap = true;
          currentTeam.trapTurns = 0;
          game.addLog(
            `${currentTeam.name} rolled three doubles and went to jail!`,
            "warning"
          );
          updateGameState(game);
          setIsRolling(false);
          return;
        }
      } else {
        game.doubleCount = 0;
      }

      // Move team
      game.moveTeam(currentTeam, roll.total);
      const space = game.getSpaceAtPosition(currentTeam.position);

      if (space) {
        const landingAction = await game.handleLanding(
          currentTeam,
          space,
          roll
        );
        updateGameState(game);

        // Handle landing action
        if (landingAction.action === "purchase") {
          // Get property by property_id or by board position for railroads/utilities
          let property = landingAction.property;
          if (!property) {
            if (space.property_id) {
              property = getPropertyById(space.property_id);
            } else if (
              space.space_category === "railroad" ||
              space.space_category === "utility"
            ) {
              property = getPropertyByPosition(space.board_space);
            }
          }

          // Get question - try property_id first, then space title for railroads/utilities
          let question = null;
          if (space.property_id) {
            question = getQuestionByPropertyId(space.property_id);
          } else if (
            space.space_category === "railroad" ||
            space.space_category === "utility"
          ) {
            // Map space titles to question IDs
            const spaceToQuestionMap: Record<string, string> = {
              "Reading Railroad": "reading_railroad_q1",
              "Pennsylvania Railroad": "pennsylvania_railroad_q1",
              "B. & O. Railroad": "bo_railroad_q1",
              "Short Line": "short_line_q1",
              "Electric Company": "electric_company_q1",
              "Water Works": "water_works_q1",
            };
            const questionId = spaceToQuestionMap[space.space_title];
            if (questionId) {
              question = getQuestionById(questionId);
            }
          }
          setPurchaseModal({
            isOpen: true,
            space,
            property: property || null,
            question,
          });
        } else if (landingAction.action === "payRent") {
          // Rent already paid in handleLanding
          setCanRoll(roll.isDouble);
        } else if (landingAction.action === "drawCard") {
          // Show card modal
          if (landingAction.card) {
            setCardModal({
              isOpen: true,
              card: landingAction.card,
              deckType: landingAction.deckType,
            });
          }
          setCanRoll(roll.isDouble);
        } else {
          setCanRoll(roll.isDouble);
        }
      }

      setIsRolling(false);
    }, 1000);
  };

  const handleEndTurn = () => {
    if (!game) return;
    game.nextTurn();
    updateGameState(game);
    setDiceRoll(null);
    setCanRoll(true);
  };

  const handlePurchase = () => {
    if (!game || !purchaseModal.space) return;

    const currentTeam = game.getCurrentTeam();
    const success = game.purchaseSpace(
      currentTeam,
      purchaseModal.space,
      purchaseModal.property || undefined
    );

    if (success) {
      updateGameState(game);
      setPurchaseModal({
        isOpen: false,
        space: null,
        property: null,
        question: null,
      });
      const roll = diceRoll;
      setCanRoll(roll?.isDouble || false);
    }
  };

  const handleDecline = () => {
    setPurchaseModal({
      isOpen: false,
      space: null,
      property: null,
      question: null,
    });
    const roll = diceRoll;
    setCanRoll(roll?.isDouble || false);
  };

  const handleSpaceClick = (space: BoardSpace) => {
    if (
      space.space_category === "property" ||
      space.space_category === "railroad" ||
      space.space_category === "utility"
    ) {
      let property: Property | null = null;
      if (space.property_id) {
        property = getPropertyById(space.property_id) || null;
      } else if (
        space.space_category === "railroad" ||
        space.space_category === "utility"
      ) {
        property = getPropertyByPosition(space.board_space) || null;
      }

      if (space.owner === null) {
        // Unowned - show purchase modal
        const question = space.property_id
          ? getQuestionByPropertyId(space.property_id)
          : null;
        if (
          !question &&
          (space.space_category === "railroad" ||
            space.space_category === "utility")
        ) {
          // Map space titles to question IDs for railroads/utilities
          const spaceToQuestionMap: Record<string, string> = {
            "Reading Railroad": "reading_railroad_q1",
            "Pennsylvania Railroad": "pennsylvania_railroad_q1",
            "B. & O. Railroad": "bo_railroad_q1",
            "Short Line": "short_line_q1",
            "Electric Company": "electric_company_q1",
            "Water Works": "water_works_q1",
          };
          const questionId = spaceToQuestionMap[space.space_title];
          if (questionId) {
            const q = getQuestionById(questionId);
            setPurchaseModal({
              isOpen: true,
              space,
              property: property || null,
              question: q || null,
            });
          } else {
            setPurchaseModal({
              isOpen: true,
              space,
              property: property || null,
              question: null,
            });
          }
        } else {
          setPurchaseModal({
            isOpen: true,
            space,
            property: property || null,
            question,
          });
        }
      } else {
        // Owned - show manage modal
        setManageModal({
          isOpen: true,
          space,
          property: property || null,
        });
      }
    }
  };

  const handleBuyHouse = () => {
    if (
      !game ||
      !manageModal.space ||
      !manageModal.property ||
      !manageModal.space.property_id
    )
      return;
    const ownerTeam = gameState?.teams.find(
      (t) => t.id === manageModal.space?.owner
    );
    if (!ownerTeam) return;

    if (game.buildHouse(ownerTeam, manageModal.space.property_id)) {
      updateGameState(game);
      // Refresh modal to show updated state
      const updatedSpace = game.getSpaceAtPosition(
        manageModal.space.board_space - 1
      );
      if (updatedSpace) {
        setManageModal({
          isOpen: true,
          space: updatedSpace,
          property: manageModal.property,
        });
      }
    }
  };

  const handleSellHouse = () => {
    if (
      !game ||
      !manageModal.space ||
      !manageModal.property ||
      !manageModal.space.property_id
    )
      return;
    const ownerTeam = gameState?.teams.find(
      (t) => t.id === manageModal.space?.owner
    );
    if (!ownerTeam) return;

    if (game.sellHouse(ownerTeam, manageModal.space.property_id)) {
      updateGameState(game);
      // Refresh modal to show updated state
      const updatedSpace = game.getSpaceAtPosition(
        manageModal.space.board_space - 1
      );
      if (updatedSpace) {
        setManageModal({
          isOpen: true,
          space: updatedSpace,
          property: manageModal.property,
        });
      }
    }
  };

  const handleSellProperty = () => {
    if (!game || !manageModal.space) return;
    const ownerTeam = gameState?.teams.find(
      (t) => t.id === manageModal.space?.owner
    );
    if (!ownerTeam) return;

    if (
      game.sellProperty(
        ownerTeam,
        manageModal.space,
        manageModal.property || undefined
      )
    ) {
      updateGameState(game);
      setManageModal({ isOpen: false, space: null, property: null });
    }
  };

  const handleSellToTeam = (buyerId: number, price: number) => {
    if (!game || !manageModal.space) return;
    const ownerTeam = gameState?.teams.find(
      (t) => t.id === manageModal.space?.owner
    );
    const buyerTeam = gameState?.teams.find((t) => t.id === buyerId);
    if (!ownerTeam || !buyerTeam) return;

    if (
      game.sellPropertyToTeam(ownerTeam, buyerTeam, manageModal.space, price)
    ) {
      updateGameState(game);
      // Refresh modal to show new owner
      const updatedSpace = game.getSpaceAtPosition(
        manageModal.space.board_space - 1
      );
      if (updatedSpace) {
        setManageModal({
          isOpen: true,
          space: updatedSpace,
          property: manageModal.property,
        });
      }
    }
  };

  if (!game || !gameState) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Monopoly Game</h1>
        <div className="header-info">
          <span>Turn: {gameState.turnNumber + 1}</span>
          <button
            className="btn btn-small"
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              window.location.reload();
            }}
          >
            New Game
          </button>
        </div>
      </header>

      <div className="game-container">
        <div className="game-sidebar left">
          <TeamPanel
            teams={gameState.teams}
            currentTeam={gameState.currentTeam}
          />
        </div>

        <div className="game-center">
          <GameBoard
            boardSpaces={gameState.boardSpaces}
            teams={gameState.teams}
            onSpaceClick={handleSpaceClick}
            diceControls={
              <DiceControls
                onRoll={handleRollDice}
                onEndTurn={handleEndTurn}
                canRoll={canRoll}
                isRolling={isRolling}
                lastRoll={diceRoll}
                currentTeam={gameState.currentTeam}
              />
            }
          />
        </div>

        <div className="game-sidebar right">
          <GameLog gameLog={gameState.gameLog} />
        </div>
      </div>

      <PurchaseModal
        space={purchaseModal.space}
        property={purchaseModal.property}
        question={purchaseModal.question}
        isOpen={purchaseModal.isOpen}
        onClose={handleDecline}
        onPurchase={handlePurchase}
        onDecline={handleDecline}
      />
      <CardModal
        isOpen={cardModal.isOpen}
        card={cardModal.card}
        deckType={cardModal.deckType}
        onClose={() =>
          setCardModal({ isOpen: false, card: null, deckType: undefined })
        }
      />
      {manageModal.space && manageModal.property && (
        <ManagePropertyModal
          isOpen={manageModal.isOpen}
          onClose={() =>
            setManageModal({ isOpen: false, space: null, property: null })
          }
          space={manageModal.space}
          property={manageModal.property}
          ownerTeam={
            gameState.teams.find((t) => t.id === manageModal.space?.owner) ||
            null
          }
          currentTeam={gameState.currentTeam}
          allTeams={gameState.teams}
          onBuyHouse={handleBuyHouse}
          onSellHouse={handleSellHouse}
          onSellProperty={handleSellProperty}
          onSellToTeam={handleSellToTeam}
          canBuyHouse={
            manageModal.space.property_id
              ? game.canBuildHouse(
                  gameState.teams.find(
                    (t) => t.id === manageModal.space?.owner
                  ) || gameState.currentTeam,
                  manageModal.space.property_id
                )
              : false
          }
          canSellHouse={
            manageModal.space.property_id
              ? game.canSellHouse(
                  gameState.teams.find(
                    (t) => t.id === manageModal.space?.owner
                  ) || gameState.currentTeam,
                  manageModal.space.property_id
                )
              : false
          }
          houseCost={manageModal.property.house_cost}
          sellPrice={Math.floor(manageModal.property.property_cost * 0.8)}
          currentRent={
            manageModal.space.owner !== null
              ? game.calculateRent(
                  manageModal.space,
                  gameState.teams.find(
                    (t) => t.id === manageModal.space?.owner
                  ) || gameState.currentTeam,
                  diceRoll || undefined
                )
              : 0
          }
        />
      )}
    </div>
  );
}

export default App;
