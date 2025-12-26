import React, { useEffect, useRef, useState } from "react";
import { createMap } from "./game/map";
import { createPlayer } from "./game/player";
import { setupInput } from "./game/input";
import { render } from "./game/render";
import { computeFOV } from "./game/fov";
import { generateMonsters } from "./game/monster";
import { loadSprites } from "./game/sprites";
import { TILE_SIZE, WIDTH, HEIGHT } from "./game/constants";
import FightModal from "./components/FightModal";
import StatusModal from "./components/StatusModal";
import PopUpModal from "./components/PopUpModal";
import "./style.css";
import {
    attackSound,
    deathSound,
    monsterHitSound,
    monsterDeathSound,
    uiSound,
    gameOverSound,
    regenDungeonSound,
} from "./audio/sounds";

export default function Game() {
    /* ---------- Refs (game state) ---------- */
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);

    const playerRef = useRef(null);
    const mapRef = useRef(null);
    const monstersRef = useRef([]);
    const exploredRef = useRef(new Set());

    const isDeadRef = useRef(false);
    const inFightRef = useRef(false);
    const inputLockedRef = useRef(false);
    const gameLoopRef = useRef(() => { });

    /* ---------- React state (UI) ---------- */
    const [player, setPlayer] = useState(null);
    const [messages, setMessages] = useState([]);
    const [currentMonster, setCurrentMonster] = useState(null);

    const [inFight, setInFight] = useState(false);
    const [isDead, setIsDead] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);

    const [showPopup, setShowPopup] = useState(false);
    const [username, setUsername] = useState("");

    const logRef = useRef(null);
    const floor = 1;

    /* ---------- Effects ---------- */

    // Username check
    useEffect(() => {
        const stored = sessionStorage.getItem("username");
        if (!stored) setShowPopup(true);
        else setUsername(stored);
    }, []);

    // Sync refs with state
    useEffect(() => {
        isDeadRef.current = isDead;
        inFightRef.current = inFight;
        inputLockedRef.current = showPopup || statusOpen || inFight || isDead;
    }, [isDead, inFight, showPopup, statusOpen]);

    // Auto-scroll message log
    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [messages]);

    // Init canvas + input
    useEffect(() => {
        const canvas = canvasRef.current;
        const SCALE = 2;

        canvas.width = WIDTH * TILE_SIZE;
        canvas.height = HEIGHT * TILE_SIZE;
        canvas.style.width = `${canvas.width * SCALE}px`;
        canvas.style.height = `${canvas.height * SCALE}px`;

        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        ctxRef.current = ctx;

        addMessage(`Welcome to the Dungeon, ${username || "Adventurer"}!`);
        addMessage("Use arrow keys or WASD to move. Good luck!");

        loadSprites(() => {
            regenDungeon();

            const cleanup = setupInput({
                player: playerRef,
                map: mapRef,
                monsters: monstersRef,
                inFight: inFightRef,
                isDead: isDeadRef,
                inputLocked: () => inputLockedRef.current,
                startFight: (monster) => {
                    setCurrentMonster(monster);
                    setInFight(true);
                },
                redraw: () => gameLoopRef.current(),
            });

            return cleanup;
        });
    }, []);

    /* ---------- Game logic ---------- */

    const addMessage = (msg) =>
        setMessages((prev) => [...prev, msg]);

    const gameLoop = () => {
        if (!ctxRef.current || !mapRef.current || !playerRef.current) return;

        const vis = computeFOV(playerRef.current, mapRef.current);
        render(
            mapRef.current,
            playerRef.current,
            vis,
            exploredRef.current,
            ctxRef.current,
            monstersRef.current
        );
    };
    gameLoopRef.current = gameLoop;

    const regenDungeon = () => {
        if (inFightRef.current) return;

        uiSound();

        const map = createMap(WIDTH, HEIGHT);
        const player = createPlayer(map);

        mapRef.current = map;
        playerRef.current = player;
        monstersRef.current = generateMonsters(map);
        exploredRef.current = new Set();

        setPlayer(player);
        setIsDead(false);

        gameLoop();
        regenDungeonSound();
    };

    /* ---------- Combat ---------- */

    const handleAttack = () => {
        const player = playerRef.current;
        const monster = currentMonster;
        if (!player || !monster) return;

        const dmg = Math.floor(Math.random() * 6) + 1;
        attackSound();
        monster.hp = Math.max(0, monster.hp - dmg);
        addMessage(`You hit the ${monster.type} for ${dmg} damage!`);

        if (monster.hp <= 0) {
            monster.alive = false;
            monsterDeathSound();
            addMessage(`You defeated the ${monster.type}!`);
            setInFight(false);
            setCurrentMonster(null);
            gameLoop();
            return;
        }

        setTimeout(() => {
            const mdmg = Math.floor(Math.random() * 4) + 1;
            player.hp = Math.max(0, player.hp - mdmg);
            monsterHitSound();
            addMessage(`${monster.type} hits you for ${mdmg} damage!`);

            if (player.hp <= 0) {
                setIsDead(true);
                setInFight(false);
                deathSound();
                gameOverSound();
                addMessage("You died! Game over.");
            }

            gameLoop();
        }, 300);
    };

    const handleRun = () => {
        addMessage("You run away!");
        setInFight(false);
        setCurrentMonster(null);
        gameLoop();
    };

    /* ---------- Inventory / Status ---------- */

    // Inside your Game component

    const useItem = (itemName) => {
        const player = playerRef.current;
        if (!player) return;

        const itemIndex = player.inventory.findIndex(
            (item) => item.name === itemName
        );

        if (itemIndex === -1) return; // Player doesn't have the item

        const item = player.inventory[itemIndex];

        // Example: Healing potion
        if (item.type === "potion") {
            const healAmount = 10; // or item.heal if stored
            player.hp = Math.min(player.maxHp, player.hp + healAmount);
            addMessage(`You used a ${item.name} and healed ${healAmount} HP!`);
            uiSound();

            // Reduce quantity
            item.quantity -= 1;
            if (item.quantity <= 0) {
                // Remove from inventory
                player.inventory.splice(itemIndex, 1);
            }

            // Update state to re-render inventory and HP
            setPlayer({ ...player });
        }
    };


    /* ---------- Render ---------- */

    return (
        <div id="ui-container">
            <div id="game-wrapper" className="nes-container is-dark with-title">
                <p className="title">Dungeon</p>
                <canvas ref={canvasRef} />
            </div>

            <div
                id="message-log"
                ref={logRef}
                className="nes-container is-dark"
                style={{ height: "120px", marginTop: "8px" }}
            >
                {messages.map((msg, i) => (
                    <div key={i}>{msg}</div>
                ))}
            </div>

            <div id="controls" style={{ marginTop: "8px" }}>
                <button className="nes-btn" onClick={regenDungeon}>
                    New Game
                </button>
                <button
                    className="nes-btn"
                    style={{ marginLeft: "8px" }}
                    onClick={() => {
                        setStatusOpen(true);
                        uiSound();
                    }}
                >
                    Status
                </button>
            </div>

            <FightModal
                isOpen={inFight}
                player={player}
                monster={currentMonster}
                onAttack={handleAttack}
                onRun={handleRun}
            />

            <StatusModal
                isOpen={statusOpen}
                playerRef={playerRef}
                setPlayer={setPlayer}
                addMessage={addMessage}
                onClose={() => setStatusOpen(false)}
                player={player}
                floor={floor}
            />

            <PopUpModal
                isOpen={showPopup}
                onSave={(name) => {
                    sessionStorage.setItem("username", name);
                    setUsername(name);
                    setShowPopup(false);
                }}
            />
        </div>
    );
}
