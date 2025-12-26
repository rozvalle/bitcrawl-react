import React, { useState } from "react";
import { uiSound } from "../audio/sounds";

export default function StatusModal({ isOpen, onClose, player, floor, playerRef, addMessage, setPlayer }) {
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

    const useItem = (itemName) => {
    const currentPlayer = playerRef.current;
    if (!currentPlayer) return;

    const itemIndex = currentPlayer.inventory.findIndex(i => i.name === itemName);
    if (itemIndex === -1) return;

    const item = currentPlayer.inventory[itemIndex];

    if (item.type === "potion") {
        const healAmount = item.heal || 10;
        currentPlayer.hp = Math.min(currentPlayer.maxHp, currentPlayer.hp + healAmount);

        addMessage(`You used a ${item.name} and healed ${healAmount} HP!`);
        uiSound();

        // Reduce quantity or remove
        if (item.quantity > 1) {
            currentPlayer.inventory[itemIndex].quantity -= 1;
        } else {
            currentPlayer.inventory.splice(itemIndex, 1);
        }

        // Update both the ref and React state
        playerRef.current = { ...currentPlayer };
        setPlayer(playerRef.current);

        setSelectedItem(null);
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
                                onClick={() => {
                                    handleItemClick(item);
                                }}
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
                        <button
                            className="nes-btn"
                            onClick={() => { useItem(selectedItem.name); }}
                        >
                            Use Item
                        </button>
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
