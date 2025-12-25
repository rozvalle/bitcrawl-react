import React from "react";

export default function FightModal({ isOpen, player, monster, onAttack, onRun }) {
    if (!player || !monster) return null;

    const playerHpPercent = (player.hp / player.maxHp) * 100;
    const monsterHpPercent = (monster.hp / monster.maxHp) * 100;

    return (
        <div
            className="nes-container is-rounded fight-modal"
            style={{
                display: isOpen ? "block" : "none",
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "500px",
                transform: "translate(-50%, -50%)",
                zIndex: 100,
                backgroundColor: "#222",
                padding: "16px",
            }}
        >
            <p className="title">Battle!</p>

            <div style={{ marginBottom: "8px" }}>
                <p>{sessionStorage.getItem("username")}</p>
                <div style={{ width: "100%", background: "#555", height: "16px" }}>
                    <div style={{ width: `${playerHpPercent}%`, background: "red", height: "16px" }}></div>
                </div>
                <div>{`${player.hp} / ${player.maxHp}`}</div>
            </div>

            <div style={{ marginBottom: "8px" }}>
                <p>{monster.type}</p>
                <div style={{ width: "100%", background: "#555", height: "16px" }}>
                    <div style={{ width: `${monsterHpPercent}%`, background: "green", height: "16px" }}></div>
                </div>
                <div>{`${monster.hp} / ${monster.maxHp}`}</div>
            </div>
            <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
                <button className="nes-btn" onClick={onAttack}>
                    Attack
                </button>
                <button className="nes-btn" onClick={onRun}>
                    Run
                </button>
            </div>
        </div>
    );
}
