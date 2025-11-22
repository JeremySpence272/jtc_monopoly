import React from "react";
import { Team } from "../types";
import "./TeamPanel.css";

interface TeamPanelProps {
  teams: Team[];
  currentTeam: Team;
}

export const TeamPanel: React.FC<TeamPanelProps> = ({ teams, currentTeam }) => {
  return (
    <div className="team-panel">
      <h2>Teams</h2>
      <div>
        {teams.map((team) => (
          <div
            key={team.id}
            className={`team-card ${
              team.id === currentTeam.id ? "active" : ""
            }`}
          >
            <div className="team-header">
              <div
                className="team-token"
                style={{ backgroundColor: team.color }}
              ></div>
              <h3>{team.name}</h3>
            </div>
            <div className="team-stats">
              <div className="stat">
                <span className="stat-label">Resources:</span>
                <span className="stat-value">${team.resources}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Properties:</span>
                <span className="stat-value">{team.properties.length}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Railroads:</span>
                <span className="stat-value">{team.railroads.length}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Utilities:</span>
                <span className="stat-value">{team.utilities.length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
