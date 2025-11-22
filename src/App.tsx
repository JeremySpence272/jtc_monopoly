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
import { SellPropertiesModal } from "./components/SellPropertiesModal";
import { getPropertyById, getPropertyByPosition } from "./data/properties";
import { getQuestionByPropertyId, getQuestionById } from "./data/questions";
import "./App.css";

const STORAGE_KEY = "monopoly_game_state";
const BACKEND_URL = "http://localhost:5001";

interface GameState {
  teams: Team[];
  currentTeam: Team;
  turnNumber: number;
  boardSpaces: BoardSpace[];
  gameLog: any[];
}

function App() {
  // Initialize with a default game immediately to avoid "Loading..." on first render
  const [game, setGame] = useState<MonopolyGame>(() => new MonopolyGame());
  const [gameState, setGameState] = useState<GameState>(() => {
    const defaultGame = new MonopolyGame();
    return {
      teams: defaultGame.teams,
      currentTeam: defaultGame.getCurrentTeam(),
      turnNumber: defaultGame.turnNumber,
      boardSpaces: defaultGame.boardSpaces,
      gameLog: defaultGame.gameLog,
    };
  });
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
  const [sellPropertiesModal, setSellPropertiesModal] = useState<{
    isOpen: boolean;
    payingTeam: Team | null;
    rentAmount: number;
    space: BoardSpace | null;
    ownerTeam: Team | null;
  }>({
    isOpen: false,
    payingTeam: null,
    rentAmount: 0,
    space: null,
    ownerTeam: null,
  });
  const [diceRoll, setDiceRoll] = useState<DiceRoll | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [canRoll, setCanRoll] = useState(true);
  const [isLoadingGame, setIsLoadingGame] = useState(false);

  useEffect(() => {
    // Try to load saved game in the background
    const loadSavedGame = async () => {
      let loadedGame: MonopolyGame | null = null;

      try {
        // Try to load from game_state.json file with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        try {
          const response = await fetch(`${BACKEND_URL}/load-game-state`, {
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.gameState) {
              const gameStateJson =
                typeof data.gameState === "string"
                  ? data.gameState
                  : JSON.stringify(data.gameState);
              loadedGame = MonopolyGame.fromJSON(gameStateJson);
              console.log("Loaded game state from game_state.json");
            }
          }
        } catch (fetchError) {
          clearTimeout(timeoutId);
          console.log(
            "Could not load from backend, trying localStorage:",
            fetchError
          );
        }

        // If we didn't get a game from the backend, try localStorage
        if (!loadedGame) {
          const savedState = localStorage.getItem(STORAGE_KEY);
          if (savedState) {
            try {
              loadedGame = MonopolyGame.fromJSON(savedState);
              console.log("Loaded game state from localStorage");
            } catch (err) {
              console.error("Error loading from localStorage:", err);
            }
          }
        }

        // If we successfully loaded a game, update the state
        if (loadedGame) {
          setGame(loadedGame);
          const currentTeam = loadedGame.getCurrentTeam();
          setGameState({
            teams: loadedGame.teams,
            currentTeam: currentTeam,
            turnNumber: loadedGame.turnNumber,
            boardSpaces: loadedGame.boardSpaces,
            gameLog: loadedGame.gameLog,
          });
          setCanRoll(true);
          // Save in background to sync
          updateGameState(loadedGame).catch((err) => {
            console.error("Error saving loaded game state:", err);
          });
        }
      } catch (error) {
        console.error("Error in loadSavedGame:", error);
      }
    };

    loadSavedGame();
  }, []);

  const updateGameState = async (gameInstance: MonopolyGame) => {
    const newState = {
      teams: gameInstance.teams,
      currentTeam: gameInstance.getCurrentTeam(),
      turnNumber: gameInstance.turnNumber,
      boardSpaces: gameInstance.boardSpaces,
      gameLog: gameInstance.gameLog,
    };

    setGameState(newState);

    // Save to game_state.json file (don't block on this)
    const gameStateJson = gameInstance.toJSON();
    fetch(`${BACKEND_URL}/save-game-state`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameState: gameStateJson }),
    }).catch((error) => {
      console.error("Error saving game state to file:", error);
    });

    // Also save to localStorage as backup
    try {
      localStorage.setItem(STORAGE_KEY, gameInstance.toJSON());
    } catch (error) {
      console.error("Error saving game state to localStorage:", error);
    }
  };

  const handleRollDice = async () => {
    if (!game || !canRoll || isRolling) return;

    const currentTeam = game.getCurrentTeam();

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
          // Three doubles - just move to jail position, no blocking
          currentTeam.position = 10;
          game.addLog(
            `${currentTeam.name} rolled three doubles and went to jail!`,
            "warning"
          );
          updateGameState(game);
          setIsRolling(false);
          setCanRoll(false);
          // Automatically end turn after showing message
          setTimeout(() => {
            handleEndTurn();
          }, 1500);
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
        } else if (landingAction.action === "insufficientFundsForRent") {
          // Team needs to sell properties to pay rent
          const ownerTeam =
            landingAction.ownerTeamId !== undefined
              ? gameState.teams.find(
                  (t) => t.id === landingAction.ownerTeamId
                ) || null
              : null;

          setSellPropertiesModal({
            isOpen: true,
            payingTeam: currentTeam,
            rentAmount: landingAction.rentAmount || 0,
            space: landingAction.space,
            ownerTeam: ownerTeam,
          });

          setCanRoll(false);
          setIsRolling(false);
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
        } else if (landingAction.action === "goToJail") {
          // Go to Jail - just move to jail, no blocking
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

  const handleLoadGame = async () => {
    if (isLoadingGame) return;

    setIsLoadingGame(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      let response;
      try {
        response = await fetch(`${BACKEND_URL}/load-game-state`, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.gameState) {
          // gameState is a JSON string from the backend
          const gameStateJson =
            typeof data.gameState === "string"
              ? data.gameState
              : JSON.stringify(data.gameState);
          const loadedGame = MonopolyGame.fromJSON(gameStateJson);
          setGame(loadedGame);
          setGameState({
            teams: loadedGame.teams,
            currentTeam: loadedGame.getCurrentTeam(),
            turnNumber: loadedGame.turnNumber,
            boardSpaces: loadedGame.boardSpaces,
            gameLog: loadedGame.gameLog,
          });
          // Don't await - let it save in background
          updateGameState(loadedGame).catch((err) =>
            console.error("Error saving loaded state:", err)
          );
          setDiceRoll(null);
          setCanRoll(true);
          alert("Game state loaded successfully!");
        } else {
          alert("No saved game state found");
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || "Failed to load game state");
      }
    } catch (error) {
      console.error("Error loading game:", error);
      if (error instanceof Error && error.name === "AbortError") {
        alert("Request timed out. Is the backend server running?");
      } else {
        alert(
          "Error loading game state: " +
            (error instanceof Error ? error.message : String(error))
        );
      }
    } finally {
      setIsLoadingGame(false);
    }
  };

  const handleNewGame = async () => {
    if (
      !confirm(
        "Are you sure you want to start a new game? This will reset all progress."
      )
    ) {
      return;
    }

    // Reset game state file on backend (don't block on this)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    fetch(`${BACKEND_URL}/reset-game-state`, {
      method: "POST",
      signal: controller.signal,
    })
      .then(() => clearTimeout(timeoutId))
      .catch((error) => {
        clearTimeout(timeoutId);
        console.error("Error resetting game state file:", error);
      });

    // Clear localStorage
    localStorage.removeItem(STORAGE_KEY);

    // Create new game
    const newGame = new MonopolyGame();
    setGame(newGame);
    setGameState({
      teams: newGame.teams,
      currentTeam: newGame.getCurrentTeam(),
      turnNumber: newGame.turnNumber,
      boardSpaces: newGame.boardSpaces,
      gameLog: newGame.gameLog,
    });
    // Don't await - let it save in background
    updateGameState(newGame).catch((err) =>
      console.error("Error saving new game state:", err)
    );
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
    const ownerTeam = gameState.teams.find(
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
    const ownerTeam = gameState.teams.find(
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
    const ownerTeam = gameState.teams.find(
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
    const ownerTeam = gameState.teams.find(
      (t) => t.id === manageModal.space?.owner
    );
    const buyerTeam = gameState.teams.find((t) => t.id === buyerId);
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

  const handleSellPropertyForRent = (
    space: BoardSpace,
    property?: Property
  ) => {
    if (!game || !sellPropertiesModal.payingTeam) return;

    // Get fresh team reference from game state
    const payingTeam = game.teams.find(
      (t) => t.id === sellPropertiesModal.payingTeam?.id
    );
    if (!payingTeam) return;

    const success = game.sellProperty(payingTeam, space, property);
    if (success) {
      updateGameState(game);
      // Refresh the paying team in modal state from updated game (source of truth)
      const updatedTeam = game.teams.find((t) => t.id === payingTeam.id);
      if (updatedTeam) {
        setSellPropertiesModal((prev) => ({
          ...prev,
          payingTeam: updatedTeam,
        }));
      }
    }
  };

  const handlePayRentAfterSelling = () => {
    if (
      !game ||
      !sellPropertiesModal.payingTeam ||
      !sellPropertiesModal.space ||
      !sellPropertiesModal.ownerTeam
    )
      return;

    // Get fresh team reference from game state
    const payingTeam = game.teams.find(
      (t) => t.id === sellPropertiesModal.payingTeam?.id
    );
    const ownerTeam = game.teams.find(
      (t) => t.id === sellPropertiesModal.ownerTeam?.id
    );

    if (!payingTeam || !ownerTeam) return;

    const success = game.payRent(
      payingTeam,
      ownerTeam,
      sellPropertiesModal.rentAmount,
      sellPropertiesModal.space
    );

    if (success) {
      updateGameState(game);
      setSellPropertiesModal({
        isOpen: false,
        payingTeam: null,
        rentAmount: 0,
        space: null,
        ownerTeam: null,
      });
      // Use the current diceRoll state
      const currentRoll = diceRoll;
      setCanRoll(currentRoll?.isDouble || false);
    } else {
      // Still can't pay - eliminate
      game.checkElimination(payingTeam);
      updateGameState(game);
      setSellPropertiesModal({
        isOpen: false,
        payingTeam: null,
        rentAmount: 0,
        space: null,
        ownerTeam: null,
      });
      setCanRoll(false);
      setTimeout(() => {
        handleEndTurn();
      }, 1500);
    }
  };

  const handleDeclineSelling = () => {
    if (
      !game ||
      !sellPropertiesModal.payingTeam ||
      !sellPropertiesModal.space ||
      !sellPropertiesModal.ownerTeam
    )
      return;

    // Get fresh team references from game state
    const payingTeam = game.teams.find(
      (t) => t.id === sellPropertiesModal.payingTeam?.id
    );
    const ownerTeam = game.teams.find(
      (t) => t.id === sellPropertiesModal.ownerTeam?.id
    );

    if (!payingTeam || !ownerTeam) return;

    // Pay what they can and eliminate
    const amountPaid = Math.max(0, payingTeam.resources);
    payingTeam.resources -= amountPaid;
    ownerTeam.resources += amountPaid;
    game.addLog(
      `${payingTeam.name} went bankrupt paying rent to ${ownerTeam.name}!`,
      "error"
    );
    game.checkElimination(payingTeam);

    updateGameState(game);
    setSellPropertiesModal({
      isOpen: false,
      payingTeam: null,
      rentAmount: 0,
      space: null,
      ownerTeam: null,
    });
    setCanRoll(false);
    setTimeout(() => {
      handleEndTurn();
    }, 1500);
  };

  // No longer need loading check since we initialize with default game
  // if (!game || !gameState) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Monopoly Game</h1>
        <div className="header-info">
          <span>Turn: {gameState.turnNumber + 1}</span>
          <button
            className="btn btn-small"
            onClick={handleLoadGame}
            disabled={isLoadingGame}
            style={{ marginRight: "10px" }}
          >
            {isLoadingGame ? "Loading..." : "Load Game"}
          </button>
          <button className="btn btn-small" onClick={handleNewGame}>
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
      {sellPropertiesModal.payingTeam && (
        <SellPropertiesModal
          isOpen={sellPropertiesModal.isOpen}
          onClose={handleDeclineSelling}
          payingTeam={sellPropertiesModal.payingTeam}
          rentAmount={sellPropertiesModal.rentAmount}
          space={sellPropertiesModal.space}
          ownerTeam={sellPropertiesModal.ownerTeam}
          ownedSpaces={
            game ? game.getOwnedSpaces(sellPropertiesModal.payingTeam) : []
          }
          onSellProperty={handleSellPropertyForRent}
          onPayRent={handlePayRentAfterSelling}
          onDecline={handleDeclineSelling}
        />
      )}
    </div>
  );
}

export default App;
