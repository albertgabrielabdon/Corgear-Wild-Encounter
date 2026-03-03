const sprite = document.querySelector(".boss");
const frameWidth = 128;
const frameHeight = 158;
const columns = 4;
const rows = 4;
let frame = 0;

let currentSpriteSheet = "images/idle.png"; 
sprite.style.backgroundImage = `url('${currentSpriteSheet}')`;

const bossSprite = document.querySelector('.boss');
const bossContainer = bossSprite.parentElement;

function activateAura() {
    if (auraActive) return; 

    auraActive = true;

    auraImage = document.createElement('img');
    auraImage.src = 'images/aura.gif';
    auraImage.classList.add('aura-effect');
    
    const corgearSprite = document.querySelector('.boss'); 
    if (!corgearSprite) return;

    corgearSprite.parentElement.insertBefore(auraImage, corgearSprite);

    positionAura(); 
}

function positionAura() {
    if (!auraImage) return;

    const corgearSprite = document.querySelector('.boss');
    if (!corgearSprite) return;

    auraImage.style.position = 'absolute';
    
    auraImage.style.top = '65%'; 
    auraImage.style.left = '40%';

    auraImage.style.transform = 'translate(-30%, -25%) scale(1.3)'; 
    
    auraImage.style.zIndex = '4'; 
    corgearSprite.style.zIndex = '5';
    
    auraImage.style.width = '200px'; 
    auraImage.style.height = 'auto';
    auraImage.style.imageRendering = 'pixelated';
}

setInterval(() => {
    const col = frame % columns;
    const row = Math.floor(frame / columns);

    sprite.style.backgroundPosition = `-${col * frameWidth}px -${row * frameHeight}px`;

    frame = (frame + 1) % (columns * rows);
}, 100);

function playBossAttackAnimation(duration = 2000) {
    if (!sprite) return;

    sprite.style.backgroundImage = "url('images/attack.png')";
    frame = 0;

    setTimeout(() => {
        sprite.style.backgroundImage = "url('images/idle.png')";
        frame = 0; 
    }, duration);
}

function playThundercorgEffect() {
    const frameWidth = 192;
    const frameHeight = 192;
    const columns = 5;
    const rows = 2;
    const totalFrames = columns * rows;

    const player = document.querySelector(".player");
    const topContainer = document.querySelector(".top-container"); 
    if (!player) return;

    const rect = player.getBoundingClientRect();
    const topRect = topContainer.getBoundingClientRect();

    const blackOverlay = document.createElement("div");
    blackOverlay.style.position = "absolute";
    blackOverlay.style.left = "0";
    blackOverlay.style.top = "0";
    blackOverlay.style.width = "100%";
    blackOverlay.style.height = "100%";
    blackOverlay.style.backgroundColor = "rgba(0,0,0,0.5)";
    blackOverlay.style.zIndex = "9998"; 
    topContainer.appendChild(blackOverlay);

    function createOverlay(imageURL, frameWidth, frameHeight, columns, rows, duration, scale = 3.5, zIndex = 9999) {
        const overlay = document.createElement("div");
        overlay.style.position = "absolute";
        overlay.style.left = rect.left - topRect.left + rect.width / 2 + "px";
        overlay.style.top = rect.top - topRect.top + rect.height / 2 + "px";
        overlay.style.width = frameWidth + "px";
        overlay.style.height = frameHeight + "px";
        overlay.style.transform = `translate(-50%, -50%) scale(${scale})`;
        overlay.style.pointerEvents = "none";
        overlay.style.backgroundImage = `url('${imageURL}')`;
        overlay.style.backgroundRepeat = "no-repeat";
        overlay.style.backgroundSize = `${frameWidth * columns}px ${frameHeight * rows}px`;
        overlay.style.zIndex = zIndex;
        overlay.style.imageRendering = "pixelated";
        topContainer.appendChild(overlay);

        let frame = 0;
        const totalFrames = columns * rows;

        const interval = setInterval(() => {
            const col = frame % columns;
            const row = Math.floor(frame / columns);
            overlay.style.backgroundPosition = `-${col * frameWidth}px -${row * frameHeight}px`;
            frame = (frame + 1) % totalFrames;
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            overlay.remove();
        }, duration);

        return interval;
    }

    const thundercorgAudio = new Audio("audio/thundercorg.mp3");
    thundercorgAudio.currentTime = 0;
    thundercorgAudio.play().catch(err => console.warn(err));

    createOverlay("images/Thundercorg.png", 192, 192, 5, 2, 500);
    setTimeout(() => {
        createOverlay("images/Thundercorg2.png", 192, 192, 5, 2, 500);
    }, 500);
    setTimeout(() => {
        createOverlay("images/Thundercorg3.png", 192, 192, 4, 1, 500);
    }, 1000);

    setTimeout(() => {
        blackOverlay.remove();
    }, 1500);
}

function playBossMoveEffect(imageURL, audioURL, frameWidth, frameHeight, columns, rows, duration = 500, scale = 0.8, zIndex = 9999) {
    const boss = document.querySelector(".boss");
    if (!boss) return;

    const audio = new Audio(audioURL);
    audio.currentTime = 0;
    audio.volume = 1.0; 
    audio.play().catch(err => console.warn(err));

    const overlay = document.createElement("div");
    overlay.style.position = "absolute";
    overlay.style.left = "50%";
    overlay.style.top = "50%";
    overlay.style.width = frameWidth + "px";
    overlay.style.height = frameHeight + "px";
    overlay.style.transform = `translate(-50%, -50%) scale(${scale})`;
    overlay.style.pointerEvents = "none";
    overlay.style.backgroundImage = `url('${imageURL}')`;
    overlay.style.backgroundRepeat = "no-repeat";
    overlay.style.backgroundSize = `${frameWidth * columns}px ${frameHeight * rows}px`;
    overlay.style.zIndex = zIndex;
    overlay.style.imageRendering = "pixelated";

    boss.appendChild(overlay);

    let frame = 0;
    const totalFrames = columns * rows;

    const interval = setInterval(() => {
        const col = frame % columns;
        const row = Math.floor(frame / columns);
        overlay.style.backgroundPosition = `-${col * frameWidth}px -${row * frameHeight}px`;
        frame = (frame + 1) % totalFrames;
    }, 100);

    setTimeout(() => {
        clearInterval(interval);
        overlay.remove();
    }, duration);
}

function playCProtectEffect() {
    playBossMoveEffect("images/Protect.png", "audio/Protect.mp3", 192, 192, 5, 2, 500); // row 1
    setTimeout(() => {
        playBossMoveEffect("images/Protect.png", "audio/Protect.mp3", 192, 192, 2, 2, 500); // row 2
    }, 2000);
}

function playAdaptEffect() {
    setTimeout(() => {
        playBossMoveEffect("images/Reflect.png", "audio/Reflect.mp3", 192, 192, 5, 3, 1500); // row 2
    }, 1500);
}

function playRecoverEffect() {
    setTimeout(() => {
        playBossMoveEffect("images/recover.png", "audio/recover.mp3", 192, 192, 5, 2, 1000); // row 2
    }, 1500);
}

let sleepOverlay;

document.addEventListener('DOMContentLoaded', () => {
    renderMoves();

    const playerContainer = document.querySelector('.player').parentElement;

    sleepOverlay = document.createElement('img');
    sleepOverlay.src = 'images/sleep.png'; 
    sleepOverlay.style.position = 'absolute';
    sleepOverlay.style.pointerEvents = 'none';
    sleepOverlay.style.display = 'none';
    sleepOverlay.style.width = '192px';
    sleepOverlay.style.zIndex = '10';
    sleepOverlay.style.transition = 'opacity 0.3s ease';

    playerContainer.appendChild(sleepOverlay);
});

function positionSleepOverlay() {
    if (!sleepOverlay || !playerSprite) return;

    const rect = playerSprite.getBoundingClientRect();
    const parentRect = playerSprite.parentElement.getBoundingClientRect();

    sleepOverlay.style.left = (rect.left - parentRect.left + rect.width / 2 - 60) + 'px';
    sleepOverlay.style.top = (rect.top - parentRect.top - 40) + 'px';
}


