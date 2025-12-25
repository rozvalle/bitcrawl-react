import React, { useEffect, useRef, useState } from "react";
import { createMap } from "./game/map";
import { createPlayer } from "./game/player";
import { setupInput } from "./game/input";
import { render } from "./game/render";
import { computeFOV } from "./game/fov";
import { generateMonsters } from "./game/monster";
import { loadSprites } from "./game/sprites";
import { buttonClickSound } from "./ui";
import { TILE_SIZE, WIDTH, HEIGHT } from "./game/constants";
import FightModal from "./components/FightModal";
import StatusModal from "./components/StatusModal";
import PopUpModal from "./components/PopUpModal";
import "./style.css";

export default function Game() {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);

    const playerRef = useRef(null);
    const mapRef = useRef(null);
    const monstersRef = useRef([]);
    const exploredRef = useRef(new Set());

    const [player, setPlayer] = useState(null);
    const [map, setMap] = useState(null);
    const [visible, setVisible] = useState(new Set());
    const [explored, setExplored] = useState(new Set());
    const [messages, setMessages] = useState([]);
    const [inFight, setInFight] = useState(false);
    const [isDead, setIsDead] = useState(false);
    const isDeadRef = useRef(isDead);
    const [showPopup, setShowPopup] = useState(false);
    const [username, setUsername] = useState("");

    useEffect(() => {
        const storedName = localStorage.getItem("username");
        if (!storedName) {
            setShowPopup(true);
        } else {
            setUsername(storedName);
        }
    }, []);

    const handleSaveUsername = (name) => {
        setUsername(name);
        setShowPopup(false);
    };

    useEffect(() => {
        isDeadRef.current = isDead;
    }, [isDead]);
    const inFightRef = useRef(inFight);
    useEffect(() => {
        inFightRef.current = inFight;
    }, [inFight]);
    const [currentMonster, setCurrentMonster] = useState(null);

    const logRef = useRef(null);
    const addMessage = (msg) => setMessages((prev) => [...prev, msg]);

    const gameLoopRef = useRef(() => { });

    const [statusOpen, setStatusOpen] = useState(false);
    const floor = 1;

    // Scroll log
    useEffect(() => {
        if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    }, [messages]);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = WIDTH * TILE_SIZE;
        canvas.height = HEIGHT * TILE_SIZE;

        const context = canvas.getContext("2d");
        context.imageSmoothingEnabled = false;
        ctxRef.current = context;

        loadSprites(() => {
            regenDungeon();

            const cleanup = setupInput({
                player: playerRef,
                map: mapRef,
                monsters: monstersRef,
                inFight: inFightRef,
                isDead: isDeadRef,
                addMessage,
                startFight: (monster) => {
                    setCurrentMonster(monster);
                    setInFight(true);
                },
                redraw: () => gameLoopRef.current(),
            });

            return cleanup;
        });
    }, []);


    const gameLoop = () => {
        if (!ctxRef.current || !mapRef.current || !playerRef.current) return;

        const vis = computeFOV(playerRef.current, mapRef.current);
        setVisible(vis);
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
        if (!ctxRef.current || inFightRef.current) return;
        buttonClickSound();

        const newMap = createMap(WIDTH, HEIGHT);
        const newPlayer = createPlayer(newMap);
        const newMonsters = generateMonsters(newMap);

        // Update refs
        mapRef.current = newMap;
        playerRef.current = newPlayer;
        monstersRef.current = newMonsters;
        exploredRef.current = new Set();
        isDeadRef.current = false;
        setIsDead(false);

        // Update state for React rendering/UI
        setMap(newMap);
        setPlayer(newPlayer);
        setExplored(new Set());

        gameLoopRef.current();
        addMessage("Dungeon regenerated!");
    };

    const handleAttack = () => {
        const player = playerRef.current;
        if (!player || !currentMonster) return;

        const dmg = Math.floor(Math.random() * 6) + 1;
        currentMonster.hp -= dmg;
        if (currentMonster.hp < 0) currentMonster.hp = 0;
        addMessage(`You hit the ${currentMonster.type} for ${dmg} damage!`);

        if (currentMonster.hp <= 0) {
            currentMonster.alive = false;
            addMessage(`You defeated the ${currentMonster.type}!`);
            setInFight(false);
            setCurrentMonster(null);

            // Immediately redraw so monster disappears
            gameLoopRef.current();
            return;
        }

        setTimeout(() => {
            if (!playerRef.current || !currentMonster) return;
            const dmg = Math.floor(Math.random() * 4) + 1;
            playerRef.current.hp -= dmg;
            if (playerRef.current.hp < 0) playerRef.current.hp = 0;
            addMessage(`${currentMonster.type} hits you for ${dmg} damage!`);
            if (playerRef.current.hp <= 0) {
                setIsDead(true);
                setInFight(false);
                addMessage("You died! Game over.");
            }
            gameLoopRef.current();
        }, 300);

        gameLoopRef.current();
    };

    const handleRun = () => {
        addMessage("You run away!");
        setInFight(false);
        setCurrentMonster(null);
        gameLoopRef.current();
    };

    return (
        <div id="ui-container">
            <div id="game-wrapper" className="nes-container is-dark with-title">
                <p className="title">Dungeon</p>
                <canvas ref={canvasRef} id="game"></canvas>
            </div>

            <div
                id="message-log"
                ref={logRef}
                className="nes-container is-dark"
                style={{ height: "120px", overflowY: "auto", marginTop: "8px" }}
            >
                {messages.map((msg, idx) => <div key={idx}>{msg}</div>)}
            </div>

            <div id="controls" style={{ marginTop: "8px" }}>
                <button className="nes-btn" onClick={regenDungeon}>
                    Regenerate Dungeon
                </button>
                <button
                    className="nes-btn"
                    style={{ marginLeft: "8px" }}
                    onClick={() => setStatusOpen(true)}
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
                onClose={() => setStatusOpen(false)}
                player={player}
                floor={floor}
            />

            <PopUpModal
                isOpen={showPopup}
                onSave={handleSaveUsername}
            />
        </div>
    );
}
