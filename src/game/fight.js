import { addMessage } from "../ui";

const modal = document.getElementById("fightModal");
const fightText = document.getElementById("fightText");
const attackBtn = document.getElementById("attackBtn");
const runBtn = document.getElementById("runBtn");

const playerHPBar = document.getElementById("playerHP");
const monsterHPBar = document.getElementById("monsterHP");
const playerHPText = document.getElementById("playerHPText");
const monsterHPText = document.getElementById("monsterHPText");

let playerRef, monsterRef, gameLoopRef;
export let inFight = false;
export let isDead = false;

export function startFight(player, monster, gameLoop) {
    inFight = true;
    playerRef = player;
    monsterRef = monster;
    gameLoopRef = gameLoop;

    modal.style.display = "block";
    updateFightModal();

    attackBtn.onclick = playerAttack;
    runBtn.onclick = runAway;
}

function updateFightModal() {
    // Update health bars
    playerHPBar.style.width = `${(playerRef.hp / playerRef.maxHp) * 100}%`;
    monsterHPBar.style.width = `${(monsterRef.hp / monsterRef.maxHp) * 100}%`;

    // Update numbers below bars
    playerHPText.textContent = `${playerRef.hp} / ${playerRef.maxHp}`;
    monsterHPText.textContent = `${monsterRef.hp} / ${monsterRef.maxHp}`;

    // Optional fight text message
    fightText.innerHTML = `You vs ${monsterRef.type}`;
}

function playerAttack() {
    const dmg = Math.floor(Math.random() * 6) + 1; // 1–6 damage
    monsterRef.hp -= dmg;
    if (monsterRef.hp < 0) monsterRef.hp = 0;
    addMessage(`You hit the ${monsterRef.type} for ${dmg} damage!`);

    updateFightModal();

    if (monsterRef.hp <= 0) {
        monsterRef.alive = false;
        addMessage(`You defeated the ${monsterRef.type}!`);
        closeFight();
        return;
    }

    // Monster attacks back
    setTimeout(monsterAttack, 300); // slight delay for clarity
}

function monsterAttack() {
    const dmg = Math.floor(Math.random() * 4) + 1; // 1–4 damage
    playerRef.hp -= dmg;
    if (playerRef.hp < 0) playerRef.hp = 0;
    addMessage(`${monsterRef.type} hits you for ${dmg} damage!`);

    updateFightModal();

    if (playerRef.hp <= 0) {
        addMessage("You died! Game over.");
        isDead = true;
        closeFight();
        // TODO: handle restart logic
        return;
    }
}

function runAway() {
    addMessage("You run away!");
    closeFight();
}

function closeFight() {
    modal.style.display = "none";
    inFight = false;
    updateFightModal(); // refresh bars just in case
    gameLoopRef(); // redraw map
}
