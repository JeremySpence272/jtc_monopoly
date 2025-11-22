import React from "react";
import { Team, DiceRoll } from "../types";
import "./DiceControls.css";

interface DiceControlsProps {
  onRoll: () => void;
  onEndTurn: () => void;
  canRoll: boolean;
  isRolling: boolean;
  lastRoll: DiceRoll | null;
  currentTeam: Team;
  onBuildHouses?: () => void;
  canBuildHouses?: boolean;
}

export const DiceControls: React.FC<DiceControlsProps> = ({
  onRoll,
  onEndTurn,
  canRoll,
  isRolling,
  lastRoll,
  currentTeam,
  onBuildHouses,
  canBuildHouses = false,
}) => {
  return (
    <div className="dice-controls">
      <div className="current-team-info">
        <h3>{currentTeam.name}'s Turn</h3>
      </div>

      <div className="dice-display">
        {lastRoll ? (
          <div className="dice-result">
            <div className="die">{lastRoll.die1}</div>
            <div className="die">{lastRoll.die2}</div>
            <div className="dice-total">Total: {lastRoll.total}</div>
            {lastRoll.isDouble && (
              <div className="double-indicator">DOUBLES!</div>
            )}
          </div>
        ) : (
          <div className="dice-placeholder">Roll the dice</div>
        )}
      </div>

      <div className="control-buttons">
        <button
          className="btn btn-primary"
          onClick={onRoll}
          disabled={!canRoll || isRolling}
        >
          {isRolling ? "Rolling..." : "Roll Dice"}
        </button>

        {canBuildHouses && onBuildHouses && (
          <button className="btn btn-secondary" onClick={onBuildHouses}>
            Build Houses
          </button>
        )}

        <button
          className="btn btn-secondary"
          onClick={onEndTurn}
          disabled={canRoll}
        >
          End Turn
        </button>
      </div>
    </div>
  );
};
