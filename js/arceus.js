let activeMinions = [];
let minionSlots = [false, false, false];
let minionSpawnCount = 0;
let minionDurabilityDivisor = 4;

function spawnArceus() {
    const slotIndex = minionSlots.indexOf(false);
    if (slotIndex === -1) return;
    if (activeMinions.length >= 3) return;

    const cry = new Audio('audio/arceus.mp3');
    cry.volume = 0.6;
    cry.play().catch(e => console.log("Audio play blocked:", e));

    const id = minionSpawnCount++;
    const arceusObj = {
        id: id,
        slot: slotIndex,
        type: 'ARCEUS',
        hp: 700,
        maxHp: 700,
        isImmune: false,
        group: null,
        hpFill: null
    };

    minionSlots[slotIndex] = true;

    const topContainer = document.querySelector(".top-container");
    const arceusGroup = document.createElement('div');
    arceusGroup.className = 'minion-unit arceus-unit';
    arceusGroup.style.cssText = `
        position: absolute;
        bottom: 25%; 
        right: ${5 + (slotIndex * 13)}%; 
        width: 130px; 
        z-index: 101;
        display: flex;
        flex-direction: column;
        align-items: center;
        pointer-events: none;
        animation: rayFadeIn 1s ease-out forwards;
    `;

    const ui = document.createElement('div');
    ui.style.cssText = `
        width: 100px; 
        background-color: #4a4a4a; 
        border: 2px solid #000;
        padding: 4px;
        margin-bottom: 5px;
        border-radius: 5px;
    `;
    ui.innerHTML = `
        <div class="hp-name" style="font-size: 0.75rem; color: #fff; text-align: center; font-weight: bold;">ARCEUS</div>
        <div class="hp-status-row" style="height: 8px; margin-top: 2px; background: #222; border: 1px solid #000;">
            <div class="hp-bar-fill" style="width: 100%; background: #63de5a; height: 100%; transition: width 0.3s, background-color 0.3s;"></div>
        </div>
    `;

    const sprite = document.createElement('img');
    sprite.src = "https://img.pokemondb.net/sprites/black-white/anim/normal/arceus.gif";
    sprite.style.cssText = "width: 150px; height: auto; image-rendering: pixelated; filter: drop-shadow(0 0 10px rgba(255,255,255,0.4));";

    arceusGroup.appendChild(ui);
    arceusGroup.appendChild(sprite);
    topContainer.appendChild(arceusGroup);

    arceusObj.group = arceusGroup;
    arceusObj.hpFill = ui.querySelector('.hp-bar-fill');
    minionDurabilityDivisor *= 1.35;
    activeMinions.push(arceusObj);
    thundercorgMultiplier *= 1.5; 
}


function minionTurn(nextTurnCallback) {
    if (activeMinions.length === 0) {
        if (typeof nextTurnCallback === 'function') nextTurnCallback();
        return;
    }

    let sequence = Promise.resolve();
    
    activeMinions.forEach((minion) => {
        sequence = sequence.then(() => {
            return new Promise(resolve => {

                if (!minion || !minion.group) return resolve();

                if (minion.type === 'ARCEUS') {
                    showDialogueParts(["ARCEUS used JUDGMENT!"], 800, 2000, () => {
                        applyDamage('player', 150);
                        healAllBossAllies(200);
                        showDialogueParts(["ARCEUS's light healed its allies!"], 800, 1500, resolve);
                    });
                } else {
                    minion.isImmune = !minion.isImmune;
                    
                    const tag = minion.group.querySelector('.immune-tag');
                    const sprite = minion.sprite || minion.group.querySelector('img');

                    if (tag) tag.style.display = minion.isImmune ? 'inline' : 'none';
                    if (sprite) sprite.style.opacity = minion.isImmune ? '0.5' : '1';

                    let damage = 100;
                    let critText = "";
                    
                    if (Math.random() < 0.10) {
                        const multiplier = 1.5 + (Math.random() * 3.5);
                        damage = Math.round(damage * multiplier);
                        critText = " Critical hit!!";
                    }

                    showDialogueParts([`RAYQUAZA used OUTRAGE!${critText}`], 800, 2000, () => {
                        applyDamage('player', damage); 
                        resolve();
                    });
                }
            });
        });
    });

    sequence.then(() => {
        if (typeof nextTurnCallback === 'function') nextTurnCallback();
    });
}
function healAllBossAllies(amount) {
    const bossOverhealCap = bMax * 2;
    bHP = Math.min(bHP + amount, bossOverhealCap);

    const bossHpFill = document.querySelector('.boss-hp-fill');
    if (bossHpFill) {
        if (bHP > bMax) {
            bossHpFill.style.backgroundColor = "#e0e0e0"; 
            bossHpFill.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.8)";
        } else {
            bossHpFill.style.backgroundColor = "#63de5a"; 
            bossHpFill.style.boxShadow = "none";
        }
    }

    activeMinions.forEach(m => {
        const minionCap = m.maxHp * 2; 
        m.hp = Math.min(m.hp + amount, minionCap);
        updateMinionUI(m);
    });
    
    updateUIBars();
}

function updateMinionUI(minion) {
    if (!minion.hpFill) return;

    const basePercent = Math.min((minion.hp / minion.maxHp) * 100, 100);
    const extraHP = Math.max(0, minion.hp - minion.maxHp);
    const extraPercent = (extraHP / minion.maxHp) * 100;

    let baseColor = "#63de5a"; 
    if (basePercent <= 20) baseColor = "#f23131"; 
    else if (basePercent <= 50) baseColor = "#f2b331"; 
    
    if (extraHP > 0) {
        minion.hpFill.style.width = "100%";
        minion.hpFill.style.background = `linear-gradient(to left, #ffffff ${extraPercent}%, ${baseColor} ${extraPercent}%)`;
        minion.hpFill.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.7)";
    } else {
        minion.hpFill.style.width = basePercent + "%";
        minion.hpFill.style.background = baseColor;
        minion.hpFill.style.boxShadow = "none";
    }
}

