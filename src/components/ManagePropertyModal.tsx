import React, { useState } from "react";
import { BoardSpace, Property, Team } from "../types";
import "./ManagePropertyModal.css";

interface ManagePropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  space: BoardSpace | null;
  property: Property | null;
  ownerTeam: Team | null;
  currentTeam: Team;
  allTeams: Team[];
  onBuyHouse: () => void;
  onSellHouse: () => void;
  onSellProperty: () => void;
  onSellToTeam: (buyerId: number, price: number) => void;
  canBuyHouse: boolean;
  canSellHouse: boolean;
  houseCost: number;
  sellPrice: number;
  currentRent: number;
}

export const ManagePropertyModal: React.FC<ManagePropertyModalProps> = ({
  isOpen,
  onClose,
  space,
  property,
  ownerTeam,
  currentTeam,
  allTeams,
  onBuyHouse,
  onSellHouse,
  onSellProperty,
  onSellToTeam,
  canBuyHouse,
  canSellHouse,
  houseCost,
  sellPrice,
  currentRent,
}) => {
  const [showSellToTeam, setShowSellToTeam] = useState(false);
  const [selectedBuyerId, setSelectedBuyerId] = useState<number | null>(null);
  const [sellPriceInput, setSellPriceInput] = useState<string>("");

  // Reset form when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setShowSellToTeam(false);
      setSelectedBuyerId(null);
      setSellPriceInput("");
    }
  }, [isOpen]);

  if (!isOpen || !space || !property) return null;

  const isOwner = ownerTeam?.id === currentTeam.id;
  const isProperty =
    property.property_color !== "railroad" &&
    property.property_color !== "utility";

  // Get teams that can buy (all teams except the owner)
  const availableBuyers = allTeams.filter((team) => team.id !== ownerTeam?.id);

  const selectedBuyer =
    selectedBuyerId !== null
      ? availableBuyers.find((team) => team.id === selectedBuyerId)
      : null;
  const price = sellPriceInput ? parseInt(sellPriceInput) : 0;
  const buyerCanAfford = selectedBuyer
    ? selectedBuyer.resources >= price
    : true;

  const handleSellToTeam = () => {
    if (selectedBuyerId === null || !sellPriceInput) return;
    const price = parseInt(sellPriceInput);
    if (isNaN(price) || price <= 0) return;
    onSellToTeam(selectedBuyerId, price);
    setShowSellToTeam(false);
    setSelectedBuyerId(null);
    setSellPriceInput("");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content manage-property-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h2>Manage {space.space_title}</h2>

        {ownerTeam && (
          <div className="owner-info">
            <p>
              <strong>Owner:</strong> {ownerTeam.name}
            </p>
            {isOwner && <p className="owner-badge">You own this property</p>}
          </div>
        )}

        <div className="property-details">
          <div className="detail-row">
            <span className="detail-label">Purchase Price:</span>
            <span className="detail-value">${property.property_cost}</span>
          </div>
          {isProperty && (
            <>
              <div className="detail-row">
                <span className="detail-label">Current Houses:</span>
                <span className="detail-value">{space.houses}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">House Cost:</span>
                <span className="detail-value">${houseCost}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Current Rent:</span>
                <span className="detail-value">${currentRent}</span>
              </div>
            </>
          )}
          {property.property_color === "railroad" && ownerTeam && (
            <div className="detail-row">
              <span className="detail-label">Current Rent:</span>
              <span className="detail-value">
                $
                {ownerTeam.railroads.length === 1
                  ? 25
                  : ownerTeam.railroads.length === 2
                  ? 50
                  : ownerTeam.railroads.length === 3
                  ? 100
                  : 200}
              </span>
            </div>
          )}
          {property.property_color === "utility" && ownerTeam && (
            <div className="detail-row">
              <span className="detail-label">Rent:</span>
              <span className="detail-value">
                {ownerTeam.utilities.length === 2
                  ? "10x dice roll"
                  : "4x dice roll"}
              </span>
            </div>
          )}
          {isOwner && (
            <div className="detail-row highlight">
              <span className="detail-label">Sell Price:</span>
              <span className="detail-value">${sellPrice}</span>
            </div>
          )}
        </div>

        {isOwner && (
          <div className="manage-actions">
            {isProperty && (
              <>
                <button
                  className="btn btn-primary"
                  onClick={onBuyHouse}
                  disabled={!canBuyHouse}
                >
                  Buy House (${houseCost})
                </button>
                {!canBuyHouse && space.houses < 2 && (
                  <p className="help-text">
                    You must own all properties in this color group to build
                    houses.
                  </p>
                )}
                <button
                  className="btn btn-secondary"
                  onClick={onSellHouse}
                  disabled={!canSellHouse}
                >
                  Sell House (${Math.floor(houseCost * 0.5)})
                </button>
                {!canSellHouse && (
                  <p className="help-text">No houses to sell.</p>
                )}
              </>
            )}
            <button className="btn btn-danger" onClick={onSellProperty}>
              Sell Property to Bank (${sellPrice})
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowSellToTeam(!showSellToTeam)}
            >
              {showSellToTeam ? "Cancel Sale" : "Sell to Another Team"}
            </button>
            {showSellToTeam && (
              <div className="sell-to-team-section">
                <h4>Sell to Another Team</h4>
                <div className="form-group">
                  <label>Select Team:</label>
                  <select
                    value={selectedBuyerId || ""}
                    onChange={(e) =>
                      setSelectedBuyerId(parseInt(e.target.value) || null)
                    }
                    className="team-select"
                  >
                    <option value="">Choose a team...</option>
                    {availableBuyers.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name} (${team.resources})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Sale Price ($):</label>
                  <input
                    type="number"
                    value={sellPriceInput}
                    onChange={(e) => setSellPriceInput(e.target.value)}
                    placeholder="Enter price"
                    min="1"
                    className="price-input"
                  />
                  {selectedBuyer && price > 0 && !buyerCanAfford && (
                    <p className="warning-text">
                      ⚠️ {selectedBuyer.name} only has $
                      {selectedBuyer.resources} and cannot afford ${price}
                    </p>
                  )}
                </div>
                <button
                  className="btn btn-primary"
                  onClick={handleSellToTeam}
                  disabled={
                    !selectedBuyerId ||
                    !sellPriceInput ||
                    isNaN(parseInt(sellPriceInput)) ||
                    parseInt(sellPriceInput) <= 0 ||
                    !buyerCanAfford
                  }
                >
                  Confirm Sale
                </button>
              </div>
            )}
          </div>
        )}

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
