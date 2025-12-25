import React, { useState } from "react";
import { uiSound } from "../audio/sounds";

export default function StatusModal({ isOpen, onClose, player, floor }) {
    const [selectedItem, setSelectedItem] = useState(null);

    if (!isOpen) return null;

    const handleItemClick = (item) => {
        uiSound();
        // Toggle selection
        if (selectedItem && selectedItem.name === item.name) {
            setSelectedItem(null);
        } else {
            setSelectedItem(item);
        }
    };

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
                maxHeight: "80vh",
                overflowY: "auto",
            }}
        >
            <p className="title">{sessionStorage.getItem("username")}</p>

            <div style={{ marginBottom: "8px" }}>
                <div>HP: {player.hp}/{player.maxHp}</div>
                <div>Level: {player.level}</div>
                <div>Floor: {floor}</div>
            </div>

            <div>
                <p>Inventory:</p>
                <ul className="nes-list is-circle">
                    {player.inventory
                        .filter(item => item.quantity > 0)
                        .map((item, idx) => (
                            <li
                                key={idx}
                                onClick={() => handleItemClick(item)}
                                style={{ cursor: "pointer" }}
                            >
                                {item.name} {`x${item.quantity}`}
                            </li>
                        ))}
                </ul>

                {selectedItem && (
                    <div
                        className="nes-container is-rounded"
                        style={{ marginTop: "8px", padding: "8px", backgroundColor: "#222" }}
                    >
                        <p><strong>{selectedItem.name}</strong></p>
                        <p>{selectedItem.description}</p>
                    </div>
                )}
            </div>

            <button
                className="nes-btn"
                style={{ marginTop: "8px" }}
                onClick={() => { onClose(); uiSound(); }}
            >
                Close
            </button>
        </div>
    );
}
