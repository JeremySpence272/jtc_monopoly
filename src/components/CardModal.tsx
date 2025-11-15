import React from "react";
import "./CardModal.css";

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: {
    message: string;
    amount: number;
    type: "credit" | "debit";
  } | null;
  deckType?: "chance" | "community_chest";
}

export const CardModal: React.FC<CardModalProps> = ({
  isOpen,
  onClose,
  card,
  deckType,
}) => {
  if (!isOpen || !card) return null;

  const deckTitle = deckType === "chance" ? "CHANCE" : "COMMUNITY CHEST";
  const isCredit = card.type === "credit";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content card-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`card-header ${deckType}`}>
          <h2>{deckTitle}</h2>
        </div>

        <div className="card-body">
          <p className="card-message">{card.message}</p>

          <div className={`card-amount ${isCredit ? "credit" : "debit"}`}>
            {isCredit ? (
              <span className="amount-positive">+${card.amount}</span>
            ) : (
              <span className="amount-negative">-${card.amount}</span>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-primary" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
