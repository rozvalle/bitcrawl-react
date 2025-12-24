// src/ui.js
import { zzfx } from "./audio/zzfxMicro.js"; // ⚡ import your zzfx function

// Play a small click sound for buttons
export function buttonClickSound() {
    zzfx(0.2, 0.5, 400); // volume, decay, frequency
}
