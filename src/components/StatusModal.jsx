import React from "react";

export default function StatusModal({ isOpen, onClose, player, floor }) {
    if (!isOpen) return null;

    return (
        <div
            className="nes-container is-rounded status-modal"
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 10,
                width: "350px",
            }}
        >
            <p className="title">{sessionStorage.getItem("username") }</p>

            <div style={{ marginBottom: "8px" }}>
                <div>HP: {player.hp}/{player.maxHp}</div>
                <div>Level: {player.level}</div>
                <div>Floor: {floor}</div>
            </div>

            <div>
                <p>Inventory:</p>
                <ul className="nes-list is-circle">
                    {player.inventory.map((item, idx) => (
                        <li key={idx}>{item}</li>
                    ))}
                </ul>
            </div>

            <button
                className="nes-btn"
                style={{ marginTop: "8px" }}
                onClick={onClose}
            >
                Close
            </button>
        </div>
    );
}
