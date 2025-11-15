import React from "react";
import { BoardSpace, Team } from "../types";
import { getPropertyById } from "../data/properties";
import "./GameBoard.css";

interface GameBoardProps {
  boardSpaces: BoardSpace[];
  teams: Team[];
  onSpaceClick?: (space: BoardSpace) => void;
  diceControls?: React.ReactNode;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  boardSpaces,
  teams,
  onSpaceClick,
  diceControls,
}) => {
  const getSpaceAtGridPosition = (
    row: number,
    col: number
  ): BoardSpace | null => {
    // Bottom row (positions 0-10): row 11, columns 11 down to 1
    // GO (position 0) should be at col 11
    if (row === 11) {
      const position = 11 - col;
      if (position >= 0 && position <= 10) {
        const space = boardSpaces.find((s) => s.board_space === position + 1);
        return space || null;
      }
    }

    // Right column (positions 11-19): rows 10 down to 2, column 1
    if (col === 1 && row >= 2 && row <= 10) {
      const position = 21 - row;
      if (position >= 11 && position <= 19) {
        const space = boardSpaces.find((s) => s.board_space === position + 1);
        return space || null;
      }
    }

    // Top row (positions 20-29): row 1, columns 1 to 10
    if (row === 1 && col >= 1 && col <= 10) {
      const position = 19 + col;
      if (position >= 20 && position <= 29) {
        const space = boardSpaces.find((s) => s.board_space === position + 1);
        return space || null;
      }
    }

    // Left column (positions 30-39): rows 1 to 10, column 11
    // Position 30 (Go To Jail, board_space 31) is at row 1, col 11
    if (col === 11 && row >= 1 && row <= 10) {
      let position: number;
      if (row === 1) {
        position = 30; // Go To Jail
      } else {
        position = 30 + (row - 1);
      }
      if (position >= 30 && position <= 39) {
        const space = boardSpaces.find((s) => s.board_space === position + 1);
        return space || null;
      }
    }

    return null;
  };

  const isCorner = (space: BoardSpace | null): boolean => {
    if (!space) return false;
    return (
      space.board_space === 1 ||
      space.board_space === 11 ||
      space.board_space === 21 ||
      space.board_space === 31
    );
  };

  const getPropertyColor = (space: BoardSpace | null): string => {
    if (!space || !space.property_id) return "";
    const property = getPropertyById(space.property_id);
    if (!property) return "";
    return property.property_color;
  };

  const getTeamsOnSpace = (space: BoardSpace | null): Team[] => {
    if (!space) return [];
    const position = space.board_space - 1;
    return teams.filter((team) => team.position === position);
  };

  const renderSpace = (row: number, col: number) => {
    const space = getSpaceAtGridPosition(row, col);
    const teamsOnSpace = getTeamsOnSpace(space);
    const corner = isCorner(space);
    const propertyColor = getPropertyColor(space);

    if (!space) {
      return <div key={`${row}-${col}`} className="board-cell empty"></div>;
    }

    const property = space.property_id
      ? getPropertyById(space.property_id)
      : null;
    const isOwned = space.owner !== null;
    const ownerTeam = isOwned ? teams.find((t) => t.id === space.owner) : null;

    return (
      <div
        key={`${row}-${col}`}
        className={`board-cell board-space ${space.space_category} ${
          corner ? "corner" : ""
        } ${isOwned ? "owned" : ""}`}
        style={{
          borderTopColor: propertyColor
            ? getColorValue(propertyColor)
            : undefined,
        }}
        onClick={() => onSpaceClick && onSpaceClick(space)}
      >
        <div className="space-title">{space.space_title}</div>
        {property && (
          <div className="space-property-info">
            <div className="property-cost">${property.property_cost}</div>
            {space.houses > 0 &&
              property.property_color !== "railroad" &&
              property.property_color !== "utility" && (
                <div className="houses-indicator">
                  {Array(space.houses)
                    .fill(0)
                    .map((_, i) => (
                      <span key={i} className="house-icon">
                        🏠
                      </span>
                    ))}
                </div>
              )}
            {property.property_color === "railroad" && isOwned && ownerTeam && (
              <div className="rent-info">
                $
                {ownerTeam.railroads.length === 1
                  ? 25
                  : ownerTeam.railroads.length === 2
                  ? 50
                  : ownerTeam.railroads.length === 3
                  ? 100
                  : 200}
              </div>
            )}
            {property.property_color === "utility" && isOwned && ownerTeam && (
              <div className="rent-info">
                {ownerTeam.utilities.length === 2 ? "10x" : "4x"}
              </div>
            )}
          </div>
        )}
        {isOwned && ownerTeam && (
          <div
            className="owner-indicator"
            style={{ backgroundColor: ownerTeam.color }}
          ></div>
        )}
        {teamsOnSpace.length > 0 && (
          <div className="team-tokens">
            {teamsOnSpace.map((team) => (
              <div
                key={team.id}
                className="team-token"
                style={{ backgroundColor: team.color }}
              ></div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const getColorValue = (color: string): string => {
    const colorMap: Record<string, string> = {
      brown: "#8B4513",
      light_blue: "#87CEEB",
      pink: "#FFC0CB",
      orange: "#FFA500",
      red: "#FF0000",
      yellow: "#FFFF00",
      green: "#008000",
      dark_blue: "#00008B",
    };
    return colorMap[color] || "#000";
  };

  return (
    <div className="game-board">
      {Array.from({ length: 11 }, (_, row) =>
        Array.from({ length: 11 }, (_, col) => {
          // Center area (rows 3-9, cols 3-9) should be empty
          if (row >= 3 && row <= 9 && col >= 3 && col <= 9) {
            return (
              <div
                key={`${row}-${col}`}
                className="board-cell empty center-area"
              ></div>
            );
          }
          return renderSpace(row + 1, col + 1);
        })
      )}
      {diceControls && (
        <div className="dice-controls-wrapper">{diceControls}</div>
      )}
    </div>
  );
};
