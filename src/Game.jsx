import React, { useEffect, useRef, useState } from "react";
import { createMap } from "./game/map";
import { createPlayer } from "./game/player";
import { setupInput } from "./game/input";
import { render } from "./game/render";
import { computeFOV } from "./game/fov";
import { generateMonsters } from "./game/monster";
import { generateItems } from "./game/items";
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
    pickUpItemSound,
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
    const itemsRef = useRef([]);
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
                items: itemsRef,
                inFight: inFightRef,
                isDead: isDeadRef,
                inputLocked: () => inputLockedRef.current,
                startFight: (monster) => {
                    setCurrentMonster(monster);
                    setInFight(true);
                },
                redraw: () => gameLoopRef.current(),
                pickupItem: pickUpItem,
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
            monstersRef.current,
            itemsRef.current
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
        itemsRef.current = generateItems(map);
        exploredRef.current = new Set();

        setPlayer(player);
        setIsDead(false);

        gameLoop();
        regenDungeonSound();
    };

    /* ---------- Combat ---------- */

    const handleAttack = () => {
        const player = playerRef.current;
        const monsterState = currentMonster;
        if (!player || !monsterState) return;

        const dmg = Math.floor(Math.random() * 6) + 1;
        attackSound();

        // Find the real monster object in the monstersRef array (currentMonster may be a copy)
        const ms = monstersRef.current || [];
        const idx = ms.findIndex(
            (m) => m.x === monsterState.x && m.y === monsterState.y && m.type === monsterState.type && m.alive
        );
        if (idx === -1) {
            // Monster not found (maybe already removed)
            return;
        }

        const monster = ms[idx];
        monster.hp = Math.max(0, monster.hp - dmg);

        // Sync UI state with the actual monster object
        setCurrentMonster({ ...monster });
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
            // keep the player ref current and update React state so UI shows new HP
            playerRef.current = player;
            setPlayer({ ...player });

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

    const pickUpItem = () => {
        const player = playerRef.current;
        const items = itemsRef.current;
        if (!player || !items) return;

        // Find the item at player's position
        const item = items.find(
            (i) => i.x === player.x && i.y === player.y && !i.picked
        );

        if (!item) return;

        item.picked = true;
        pickUpItemSound();

        if (item.type === "potion") {
            // If potion add quantity if already in inventory
            const invItem = player.inventory.find((i) => i.name === "Potion");
            if (invItem) {
                invItem.quantity += 1;
            }
        }

        addMessage(`You picked up a ${item.type}!`);

        playerRef.current = player;  // keep the ref current
        setPlayer({ ...player });  // update React state
        
        gameLoopRef.current();
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
