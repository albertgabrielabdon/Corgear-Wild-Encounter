let rayquazaSpawnCount = 0;

function spawnRayquaza() {
    if (activeMinions.length >= 3) return;

    const cry = new Audio('audio/rayquaza.mp3');
    cry.volume = 0.6;
    cry.play().catch(e => console.log("Audio play blocked:", e));

    const id = rayquazaSpawnCount++;
    
    const rayObj = {
        id: id,
        type: 'RAYQUAZA',
        hp: 300,
        maxHp: 300,
        isImmune: false,
        sprite: null,
        ui: null,
        hpFill: null,
        group: null 
    };

    const topContainer = document.querySelector(".top-container");

    const rayGroup = document.createElement('div');
    rayGroup.className = 'rayquaza-unit';
    rayGroup.style.cssText = `
        position: absolute;
        bottom: 20%; 
        /* Positions them beside Corgear, moving left as more spawn */
        right: ${5 + (activeMinions.length * 13)}%; 
        width: 130px; 
        z-index: 100; 
        display: flex;
        flex-direction: column;
        align-items: center;
        pointer-events: none;
        animation: rayFadeIn 0.8s ease-out forwards;
    `;

    const ui = document.createElement('div');
    ui.className = 'ray-mini-ui';
    ui.style.cssText = `
        width: 100px; 
        background-color: #2d5a27; 
        border: 2px solid #000;
        padding: 4px;
        margin-bottom: 5px;
        border-radius: 5px;
        box-shadow: 2px 2px 0px rgba(0,0,0,0.5);
    `;
    ui.innerHTML = `
        <div class="hp-name" style="font-size: 0.8rem; color: white; text-shadow: 1px 1px #000; margin: 0; justify-content: center;">
            RAYQUAZA <span class="immune-tag" style="display:none; color: #00ffff; margin-left: 5px;">FLYING</span>
        </div>
        <div class="hp-status-row" style="height: 6px; margin-top: 2px; width: 100%; box-sizing: border-box;">
            <div class="hp-bar-bg" style="height: 100%; width: 100%;">
                <div class="hp-bar-fill" style="width: 100%; background-color: #63de5a; height: 100%; transition: width 0.3s;"></div>
            </div>
        </div>
    `;

    const sprite = document.createElement('img');
    sprite.src = "https://img.pokemondb.net/sprites/black-white/anim/normal/rayquaza.gif";
    sprite.style.cssText = `
        width: 180px; 
        height: auto;
        image-rendering: pixelated;
        transform: scaleX(1); 
        filter: drop-shadow(0 0 5px rgba(255,255,255,0.3));
    `;

    rayGroup.appendChild(ui);
    rayGroup.appendChild(sprite);
    topContainer.appendChild(rayGroup);

    rayObj.group = rayGroup;
    rayObj.ui = ui;
    rayObj.sprite = sprite;
    rayObj.hpFill = ui.querySelector('.hp-bar-fill');

    activeMinions.push(rayObj);
    
    thundercorgMultiplier *= 1.5;
}
