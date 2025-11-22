import React from "react";
import { BoardSpace, Property, Team } from "../types";
import { getPropertyById, getPropertyByPosition } from "../data/properties";
import "./SellPropertiesModal.css";

interface SellPropertiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  payingTeam: Team | null;
  rentAmount: number;
  space: BoardSpace | null;
  ownerTeam: Team | null;
  ownedSpaces: BoardSpace[];
  onSellProperty: (space: BoardSpace, property?: Property) => void;
  onPayRent: () => void;
  onDecline: () => void;
}

export const SellPropertiesModal: React.FC<SellPropertiesModalProps> = ({
  isOpen,
  onClose,
  payingTeam,
  rentAmount,
  space,
  ownerTeam,
  ownedSpaces,
  onSellProperty,
  onPayRent,
  onDecline,
}) => {
  // Use onClose as onDecline for consistency
  const handleClose = onClose || onDecline;
  if (!isOpen || !payingTeam) return null;

  const currentResources = payingTeam.resources;
  const shortfall = Math.max(0, rentAmount - currentResources);
  const canPayRent = currentResources >= rentAmount;

  const calculateSellPrice = (space: BoardSpace): number => {
    let cost = 0;
    if (space.property_id) {
      const property = getPropertyById(space.property_id);
      if (property) {
        cost = property.property_cost;
        // Add house sell value
        if (space.houses > 0) {
          cost += Math.floor(property.house_cost * 0.5) * space.houses;
        }
      }
    } else if (space.space_category === "railroad") {
      cost = 200;
    } else if (space.space_category === "utility") {
      cost = 150;
    }
    return Math.floor(cost * 0.8);
  };

  const getPropertyForSpace = (space: BoardSpace): Property | null => {
    if (space.property_id) {
      return getPropertyById(space.property_id) || null;
    }
    return getPropertyByPosition(space.board_space) || null;
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content sell-properties-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={handleClose}>
          ×
        </button>

        <h2>Sell Properties to Pay Rent</h2>

        <div className="rent-info">
          <div className="info-row">
            <span className="info-label">Rent Due:</span>
            <span className="info-value">${rentAmount}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Current Resources:</span>
            <span className="info-value">${currentResources}</span>
          </div>
          {shortfall > 0 && (
            <div className="info-row warning">
              <span className="info-label">Shortfall:</span>
              <span className="info-value">${shortfall}</span>
            </div>
          )}
          {space && ownerTeam && (
            <div className="info-row">
              <span className="info-label">Owing to:</span>
              <span className="info-value">
                {ownerTeam.name} for {space.space_title}
              </span>
            </div>
          )}
        </div>

        {ownedSpaces.length === 0 ? (
          <div className="no-properties">
            <p>You have no properties to sell.</p>
          </div>
        ) : (
          <>
            <h3>Your Properties</h3>
            <div className="properties-list">
              {ownedSpaces.map((ownedSpace) => {
                const property = getPropertyForSpace(ownedSpace);
                const sellPrice = calculateSellPrice(ownedSpace);

                return (
                  <div key={ownedSpace.space_id} className="property-item">
                    <div className="property-info">
                      <span className="property-name">
                        {ownedSpace.space_title}
                      </span>
                      {ownedSpace.houses > 0 && (
                        <span className="property-houses">
                          {ownedSpace.houses} house(s)
                        </span>
                      )}
                      <span className="property-sell-price">
                        Sell for ${sellPrice}
                      </span>
                    </div>
                    <button
                      className="btn btn-secondary"
                      onClick={() =>
                        onSellProperty(ownedSpace, property || undefined)
                      }
                    >
                      Sell
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div className="modal-actions">
          <button
            className="btn btn-primary"
            onClick={onPayRent}
            disabled={!canPayRent}
          >
            Pay Rent ${rentAmount}
          </button>
          <button className="btn btn-secondary" onClick={onDecline}>
            Decline (Go Bankrupt)
          </button>
        </div>
      </div>
    </div>
  );
};
