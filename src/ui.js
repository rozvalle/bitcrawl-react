import { zzfx } from "./audio/zzfxMicro.js"; // your working zzfxMicro

const logElement = document.getElementById("message-log");

// Add a message to the log
export function addMessage(msg) {
    const line = document.createElement("div");
    line.textContent = msg;
    logElement.appendChild(line);
    logElement.scrollTop = logElement.scrollHeight;
}

// Play a small click sound for buttons
export function buttonClickSound() {
    zzfx(0.2, 0.5, 400); // volume, decay, frequency
}

// Hook buttons to actions
export function setupUI({ regenCallback, toggleFOVCallback, muteCallback }) {
    document.getElementById("regen").addEventListener("click", () => {
        buttonClickSound();
        regenCallback();
    });

    // document.getElementById("toggle-fov").addEventListener("click", () => {
    //     buttonClickSound();
    //     toggleFOVCallback();
    // });

    // document.getElementById("mute").addEventListener("click", () => {
    //     buttonClickSound();
    //     muteCallback();
    // });
}