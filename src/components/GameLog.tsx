import React from "react";
import { GameLogEntry } from "../types";
import "./GameLog.css";

interface GameLogProps {
  gameLog: GameLogEntry[];
}

export const GameLog: React.FC<GameLogProps> = ({ gameLog }) => {
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <div className="game-log">
      <h2>Game Log</h2>
      <div className="log-entries">
        {gameLog.slice(0, 10).map((entry, index) => (
          <div key={index} className={`log-entry log-${entry.type}`}>
            <span className="log-time">{formatTime(entry.timestamp)}</span>
            <span className="log-message">{entry.message}</span>
          </div>
        ))}
        {gameLog.length === 0 && (
          <div className="log-entry">No log entries yet.</div>
        )}
      </div>
    </div>
  );
};
