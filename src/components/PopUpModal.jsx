import { useState } from "react";

export default function PopUpModal({ isOpen, onSave }) {
    const [name, setName] = useState("");

    if (!isOpen) return null;

    const handleSave = () => {
        if (!name.trim()) return;

        localStorage.setItem("username", name.trim());
        onSave(name.trim());
    };

    return (
        <div
            className="nes-container is-rounded popup-modal"
            style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1000,
                maxWidth: "400px",
                width: "90%",
            }}
        >
            <p className="nes-text is-primary">Welcome, adventurer!</p>

            <div className="nes-field" style={{ marginTop: "12px" }}>
                <label htmlFor="username">Your name</label>
                <input
                    id="username"
                    type="text"
                    className="nes-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    autoFocus
                />
            </div>

            <button
                className="nes-btn is-success"
                style={{ marginTop: "16px", width: "100%" }}
                onClick={handleSave}
            >
                Start Adventure
            </button>
        </div>
    );
}
