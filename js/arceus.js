let activeMinions = [];
let minionSpawnCount = 0;

function spawnArceus() {
    if (activeMinions.length >= 3) return;

    const cry = new Audio('audio/arceus.mp3');
    cry.volume = 0.6;
    cry.play().catch(e => console.log("Audio play blocked:", e));

    const id = minionSpawnCount++;
    const arceusObj = {
        id: id,
        type: 'ARCEUS',
        hp: 700,
        maxHp: 700,
        isImmune: false,
        group: null,
        hpFill: null
    };

    const topContainer = document.querySelector(".top-container");
    const arceusGroup = document.createElement('div');
    arceusGroup.className = 'minion-unit arceus-unit';
    arceusGroup.style.cssText = `
        position: absolute;
        bottom: 25%; 
        right: ${3 + (activeMinions.length * 16)}%; 
        width: 80px; 
        z-index: 101;
        display: flex;
        flex-direction: column;
        align-items: center;
        pointer-events: none;
        animation: rayFadeIn 1s ease-out forwards;
    `;

    const ui = document.createElement('div');
    ui.style.cssText = `
        width: 130px; 
        background-color: #4a4a4a; 
        border: 2px solid #000;
        padding: 4px;
        margin-bottom: 5px;
        border-radius: 5px;
    `;
    ui.innerHTML = `
        <div class="hp-name" style="font-size: 0.75rem; color: #fff; text-align: center; font-weight: bold;">ARCEUS</div>
        <div class="hp-status-row" style="height: 8px; margin-top: 2px; background: #222; border: 1px solid #000;">
            <div class="hp-bar-fill" style="width: 100%; background-color: #e0e0e0; height: 100%; transition: width 0.3s, background-color 0.3s;"></div>
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
    const bossOverhealCap = bMax + 2500; 
    bHP += amount;

    if (bHP > bossOverhealCap) {
        bHP = bossOverhealCap;
    }

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
        m.hp += amount;
        if (m.hp > m.maxHp * 2) m.hp = m.maxHp * 2; 
        
        updateMinionUI(m);
    });
    
    updateUIBars();
}

function updateMinionUI(minion) {
    if (!minion.hpFill) return;

    const percent = (minion.hp / minion.maxHp) * 100;
    
    if (minion.hp > minion.maxHp) {
        minion.hpFill.style.width = "100%";
        minion.hpFill.style.backgroundColor = "#e0e0e0"; 
        minion.hpFill.style.boxShadow = "0 0 10px rgba(255,255,255,0.8)";
    } else {

        minion.hpFill.style.width = percent + "%";
        minion.hpFill.style.boxShadow = "none";
        

        if (percent > 50) minion.hpFill.style.backgroundColor = "#63de5a"; 
        else if (percent > 20) minion.hpFill.style.backgroundColor = "#f2b331"; 
        else minion.hpFill.style.backgroundColor = "#f23131"; 
    }
}
