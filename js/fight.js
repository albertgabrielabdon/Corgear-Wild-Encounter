let turnNumber = 1; 
let playerName = 'CHARMANDER';
let nextEvolveTurn = 7; //7
let isAsleep = false;
let sleepTurnsRemaining = 0;
let totalDamageDealt = 0;

let auraActive = false;
let thundercorgMultiplier = 1;
let playerDamageMultiplier = 1;
activateAura()
let playerSprite = document.querySelector('.player');
function updateDamageUI() {
    const counter = document.getElementById('damage-counter');
    if (counter) {
        counter.innerText = Math.floor(totalDamageDealt).toLocaleString();
    }
}

function updatePlayerNameUI() {
    const hpNameDivs = document.querySelectorAll('.hp-name');
    if (hpNameDivs.length < 2) return;

    const playerHpNameDiv = hpNameDivs[1]; 


    const lvlDiv = playerHpNameDiv.querySelector('.lvl');
    playerHpNameDiv.innerHTML = `${playerName} `;
    if (lvlDiv) playerHpNameDiv.appendChild(lvlDiv);
}
let currentPlayerMoves = [
    { key: 'MOVE1', name: 'SCRATCH', damage: 120, displayText: () => `${playerName} used SCRATCH!` },
    { key: 'MOVE2', name: 'SAND-ATTACK', damage: 10, displayText: () => `${playerName} used SAND-ATTACK!` },
    { key: 'MOVE3', name: 'CORGE-ENGE', damage: 50, displayText: () => `${playerName} used CORGE-ENGE!`, critText: () => `${playerName} copied the last damaging move!` },
    { key: 'MOVE4', name: '-', damage: 0, displayText: () => '-' }
];

function renderMoves() {
    const movesListContainer = document.querySelector('#moves-ui .moves-list');
    if (!movesListContainer) return;

    movesListContainer.innerHTML = '';
    currentPlayerMoves.forEach(move => {
        const div = document.createElement('div');
        div.classList.add('move-item');
        div.innerHTML = `<span>${move.name}</span>`;
        div.onclick = () => Attack(move.key);
        movesListContainer.appendChild(div);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderMoves();
});

function checkAutoEvolve() {
    if (turnNumber >= nextEvolveTurn) {
        
        if (playerName === 'CHARMANDER' && totalDamageDealt >= 250) {//250
            evolvePlayer('charmeleon', 400, 150, [
                { key: 'MOVE1', name: 'SLASH', damage: 70, displayText: () => `${playerName} used SLASH!` },
                { key: 'MOVE2', name: 'SMOKESCREEN', damage: 15, displayText: () => `${playerName} used SMOKESCREEN!` },
                { key: 'MOVE3', name: 'CORGE-ENGE', damage: 60, displayText: () => `${playerName} used CORGE-ENGE!`, critText: () => `${playerName} copied the last damaging move!` },
                { key: 'MOVE4', name: 'FLAMETHROWER', damage: 200, displayText: () => `${playerName} used FLAMETHROWER!` }
            ]);
            nextEvolveTurn = 16; 
        } 
        
        else if (playerName === 'CHARMELEON' && totalDamageDealt >= 650) {//650
            evolvePlayer('charizard', 1500, 550, [
                { key: 'MOVE1', name: 'SLASH', damage: 150, displayText: () => `${playerName} used SLASH!` },
                { key: 'MOVE2', name: 'SWORD DANCE', damage: 0, displayText: () => `${playerName} used SWORD DANCE! Attack rose sharply!` },
                { key: 'MOVE3', name: 'CORGE-ENGE', damage: 80, displayText: () => `${playerName} used CORGE-ENGE!`, critText: () => `${playerName} copied the last damaging move!` },
                { key: 'MOVE4', name: 'FIRE BLAST', damage: 300, displayText: () => `${playerName} used FIRE BLAST!` }
            ]);
            nextEvolveTurn = 9999; 
        }
    }
}

function updateTurnButton() {
    const turnButtons = document.querySelectorAll('.turn-button span');
    const music = document.getElementById('game-theme');
    const bossOverlay = document.getElementById('boss-mode-overlay');

    turnButtons.forEach(btn => {
        btn.innerText = `T${turnNumber}`;
    });
    checkAutoEvolve();

    if (turnNumber === 20 && !auraActive) {
        activateAura();

        if (music) {
            music.src = "theme_boss.mp3";
            music.play().catch(e => console.log(e));
        }

        if (bossOverlay) {
            bossOverlay.style.display = 'flex';
            setTimeout(() => {
                bossOverlay.style.opacity = '0';
                bossOverlay.style.transition = 'opacity 1s ease';
                setTimeout(() => bossOverlay.style.display = 'none', 1000);
            }, 3000);
        }

        showDialogueParts(
            ["BOSS CORGEAR is ANGRY!"],
            1000,
            2500
        );
    }
}

function Attack(moveKey) {
    const move = currentPlayerMoves.find(m => m.key === moveKey);
    if (!move) return;

    let dmg = 0;
    let txt = typeof move.displayText === 'function' ? move.displayText() : move.displayText;
    let sandAttackHit = true;
    let isCrit = false;

    if (isAsleep) {
        toggleOptions(false);
        closeFight();
    
        if (Math.random() < 0.33) {
            isAsleep = false;
            sleepTurnsRemaining = 0;
    
            showDialogueParts(
                [`${playerName} woke up!`],
                1000,
                2000,
                () => {
                    sleepOverlay.style.opacity = '0';
                    playerSprite.style.filter = 'brightness(1)';
                    setTimeout(() => {
                        sleepOverlay.style.display = 'none';
                    }, 300);
                    Attack(moveKey); 
                }
            );
            return;
        } else {
            sleepTurnsRemaining--;
    
            if (sleepTurnsRemaining <= 0) {
                isAsleep = false;
                sleepOverlay.style.opacity = '0';
                playerSprite.style.filter = 'brightness(1)';
                showDialogueParts(
                    [`${playerName} woke up!`],
                    1000,
                    2000,
                    () => {
                        Attack(moveKey);
                    }
                );
                return;
            }
            playSnore();
            showDialogueParts(
                [`${playerName} is fast asleep...`],
                1000,
                2500,
                () => {
                    corgearTurn();
                }
            );
               
            return;
        }
    }

    toggleOptions(false);
    closeFight();

    switch (move.key) {
        case 'MOVE1':
            dmg = move.damage;
            if (move.name === 'SLASH' && Math.random() < 0.33) {
                const slashMult = 1.8 + (Math.random() * 4.2);
                dmg = Math.round(dmg * slashMult);
                isCrit = true; 
            }
            break;
        case 'MOVE2':
            if (move.name === 'SWORD DANCE') {
                const riseAudio = new Audio('audio/stat_rise.mp3');
                riseAudio.play().catch(e => console.log("Audio play blocked or missing:", e));
                playerDamageMultiplier *= 2; 
                dmg = 0;
            } 
            else if (Math.random() > 0.85) {
                sandAttackHit = false;
                txt = `${typeof move.displayText === 'function' ? move.displayText() : move.displayText()}... but it missed!`; 
            } else {
                const dropAudio = new Audio('audio/stat_drop.mp3');
                dropAudio.play().catch(e => console.log("Audio play blocked or missing:", e));
                bossAccuracy -= 0.05;
                dmg = move.damage;
                txt = `${typeof move.displayText === 'function' ? move.displayText() : move.displayText()} CORGEAR's accuracy fell!`;
            }
            break;
        case 'MOVE3':
            if (lastDamageTaken > 0) {
                dmg = Math.round(lastDamageTaken * 2);
                let critTxt = typeof move.critText === 'function' ? move.critText() : move.critText;
                txt = `${critTxt || (typeof move.displayText === 'function' ? move.displayText() : move.displayText)} It dealt ${dmg} reflected damage!`;
                applyDamage('boss', dmg);
                totalDamageDealt += dmg;
                lastDamageTaken = 0;
                dmg = 0
            } else {
                dmg = move.damage;
            }
            break;
        case 'MOVE4':
            dmg = move.damage;
            break;
    }

    if (dmg > 0) {
        const critChance = 0.0625;
        dmg = Math.round(dmg * playerDamageMultiplier);
        if (Math.random() < critChance) {
            const critMultiplier = 1.5 + Math.random() * 1.0;
            dmg = Math.round(dmg * critMultiplier);
            isCrit = true;
        }
    }

    let minionDmg = dmg / minionDurabilityDivisor;
    if (sandAttackHit && dmg > 0) {
        if (move.name === 'FIRE BLAST') {
        
            let bossDmg = dmg / bossDefenseDivisor;
            applyDamage('boss', bossDmg);
            totalDamageDealt += bossDmg;

            activeMinions.forEach(minion => {
                if (minion.type === 'RAYQUAZA' && minion.isImmune) {
                } else {
                    applyDamage('rayquaza', minionDmg, minion.id);
                    totalDamageDealt += minionDmg;
                }
            });

            activeMinions = activeMinions.filter(m => {
                if (m.hp <= 0) {
                    minionSlots[m.slot] = false;
                    const sprite = m.group.querySelector('img');
                    if (sprite) sprite.classList.add('faint-animation');
                    setTimeout(() => m.group.remove(), 800);
                    return false;
                }
                return true;
            });

            txt = `${playerName} unleashed a massive FIRE BLAST!`;
        } 
        else if (activeMinions.length > 0) {
            let target = activeMinions[0];
            if (target.isImmune) {
                txt = `${playerName} attacked... but RAYQUAZA is FLYING!`;
            } else {
                applyDamage('rayquaza', minionDmg, target.id);
                totalDamageDealt += minionDmg;
                txt = `${playerName} hit ${target.type} for ${minionDmg} damage!`;
                if (target.hp <= 0) {
                    minionSlots[target.slot] = false;
                    const sprite = target.group.querySelector('img');
                    if (sprite) sprite.classList.add('faint-animation');
                    setTimeout(() => target.group.remove(), 800);
                    activeMinions.shift();
                }
            }
        } 
        else {
            if (isCProtectActive) {
                txt = `C-PROTECT blocked the hit! ${playerName} took ${cProtectDamage} recoil damage!`;
                applyDamage('player', cProtectDamage);
            } else {
                let finalBossDmg = dmg / bossDefenseDivisor;
                applyDamage('boss', finalBossDmg);
                totalDamageDealt += finalBossDmg;
                txt = typeof move.displayText === 'function' ? move.displayText() : move.displayText;
            }
        }
    }

    updateDamageUI();
    checkAutoEvolve();
    isCProtectActive = false; 

    let dialogueParts = txt.split("!").filter(Boolean).map(s => s.trim() + "!");
    if (isCrit) {
        dialogueParts.push("Critical hit!");
    }

    showDialogueParts(dialogueParts, 1000, 3000, () => {
        updateUIBars();
        if (bHP > 0) corgearTurn();
        else {
            const bossSprite = document.querySelector('.boss'); 
            if (bossSprite) bossSprite.classList.add('faint-animation'); 
            updateDialogue("BOSS CORGEAR fainted!");
        }
    });
}

function corgearTurn() {
    const moves = ['Recover', 'Thundercorg', 'Adapt', 'C-Protect'];//['Recover', 'Thundercorg', 'Adapt', 'C-Protect']
    const choice = moves[Math.floor(Math.random() * moves.length)];
    let bossTxt = "";
    let summonTxt = "";
    let isCrit = true;

    if (auraActive && activeMinions.length < 3 && Math.random() < 0.85) {//0.40
        if (Math.random() > 0.5) {
            spawnArceus();
            summonTxt = "CORGEAR has summoned ARCEUS! ";
        } else {
            spawnRayquaza();
            summonTxt = "CORGEAR has summoned RAYQUAZA! ";
        }
    }

    if (Math.random() > bossAccuracy) {
        bossTxt = `BOSS CORGEAR used ${choice}... but it missed!`;
        usedProtectLastTurn = false;
        isCProtectActive = false; 
    } else {
        if (choice === 'Recover') {
            playBossAttackAnimation();
            playRecoverEffect();
            if (bHP < bMax) {
                playRecoverEffect();
                bHP = Math.min(bMax, bHP + 550);
                bossTxt = "BOSS CORGEAR used Recover! CORGEAR restored its HP!";
            } else {
                bossTxt = "BOSS CORGEAR used Recover! But its HP was already full!";
            }
            usedProtectLastTurn = false;
            isCrit = false;
        } 
        else if (choice === 'Thundercorg') {
            playBossAttackAnimation();
            playThundercorgEffect();
            let baseDamage = 50;
            let damage = baseDamage * thundercorgMultiplier;
        
            if (Math.random() < 0.33) { damage *= 2; isCrit = true; } else isCrit = false;
            applyDamage('player', damage);
            lastDamageTaken = damage;
            bossTxt = "BOSS CORGEAR used Thundercorg! It's super effective!";
            usedProtectLastTurn = false;
            if (auraActive) {
                thundercorgMultiplier += 0.10;
            }
        }
        else if (choice === 'Adapt') {
            playBossAttackAnimation();
            playAdaptEffect();
            bossDefenseDivisor *= 2;
            bossTxt = "BOSS CORGEAR used Adapt! Damage taken will now be halved further!";
            usedProtectLastTurn = false;
            isCrit = false;
        } 
        else if (choice === 'C-Protect') {
            if (usedProtectLastTurn && Math.random() < 0.5) {
                bossTxt = "BOSS CORGEAR used C-Protect!... but it failed!";
                isCProtectActive = false;
                usedProtectLastTurn = false;
            } else {
                playBossAttackAnimation();
                playCProtectEffect();
                isCProtectActive = true;
                bossTxt = "BOSS CORGEAR used C-Protect! It's protected from the next hit!";
                cProtectDamage += 10;
                usedProtectLastTurn = true;
                isCrit = false;
            }
        }
    }

    let finalBossTxt = summonTxt + bossTxt;

    let bossDialogueParts = finalBossTxt.split("!").filter(Boolean).map(s => s.trim() + "!");
    if (choice === 'Thundercorg' && isCrit) {
        if (bossDialogueParts.length > 1) bossDialogueParts.splice(1, 0, "Critical hit!");
        else bossDialogueParts.push("Critical hit!");
    }

    showDialogueParts(bossDialogueParts, 1000, 3000, () => {
        updateUIBars();
        minionTurn(() => {
            if (pHP <= 0) {
                const statusText = document.getElementById('attack-text');
                statusText.innerHTML = `${playerName} fainted! <span onclick="resetGame()" style="color:yellow; cursor:pointer; margin-left:10px;">Restart?</span>`;
                statusText.style.animation = "none";
                
                if (playerSprite) playerSprite.style.opacity = "0.5";
                
                toggleOptions(false);
            } else {
                updateDialogue(`What will ${playerName} do?`);
                toggleOptions(true);
                turnNumber++;
                updateTurnButton();
            }
        });
        });          
    }

function evolvePlayer(spriteName, newMaxHP, bonusHP, newMoves) {
    if (!playerSprite) return;

    const audio = new Audio();
    if (spriteName.toLowerCase() === 'charmeleon') audio.src = 'audio/charmeleon.mp3';
    else if (spriteName.toLowerCase() === 'charizard') audio.src = 'audio/charizard.mp3';
    audio.play().catch(e => console.log(e));

    const sparkle = document.createElement('div');
    sparkle.classList.add('sparkle-effect');
    playerSprite.parentElement.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 500);

    const spriteSettings = {
        'charmander': { width: 150, scale: 1, zIndex: 10 },
        'charmeleon': { width: 230, scale: 1, left: -10, zIndex: 10}, 
        'charizard': { width: 350, scale: 1.2, left: -70, zIndex: 200 } 
    };

    const settings = spriteSettings[spriteName.toLowerCase()] || { width: 150, scale: 1 };

    setTimeout(() => {
        playerSprite.src = `https://img.pokemondb.net/sprites/black-white/anim/back-normal/${spriteName}.gif`;
        playerSprite.style.width = settings.width + 'px';
        playerSprite.style.left = settings.left + 'px';
        playerSprite.style.transform = `scale(${settings.scale})`;
        playerSprite.style.zIndex = settings.zIndex;
        positionSleepOverlay();

        playerName = spriteName.toUpperCase();
        updatePlayerNameUI(); 
        pMax = newMaxHP;
        pHP = Math.min(pMax, pHP + bonusHP);

        currentPlayerMoves = newMoves;
        renderMoves();

        updateDialogue(`${playerName} EVOLVED!`);
        updateUIBars();
    }, 1000);
}

function resetGame() {
    minionSlots = [false, false, false];
    const overlay = document.getElementById('fade-overlay');
    const themeMusic = document.getElementById('game-theme');

    overlay.style.pointerEvents = "all";
    overlay.style.opacity = "1";

    setTimeout(() => {
        if (themeMusic) {
            themeMusic.pause();
            themeMusic.currentTime = 0;
            themeMusic.src = "theme.mp3";
            themeMusic.play().catch(err => console.log(err));
            const bossOverlay = document.getElementById('boss-mode-overlay');
            if (bossOverlay) {
                bossOverlay.style.display = 'none';
                bossOverlay.style.opacity = '1'; 
            }
        }

        activeMinions.forEach(ray => {
            if (ray.group) ray.group.remove();
        });
        activeMinions = [];
        minionSpawnCount = 0; 
        rayquazaSpawnCount = 0;
        thundercorgMultiplier = 1;
        auraActive = false;

        totalDamageDealt = 0;
        updateDamageUI();
        
        const auraEl = document.querySelector('.aura-effect');
        if (auraEl) auraEl.remove();

        pHP = 101;
        bHP = 2000;
        pMax = 101;
        bossDefenseDivisor = 1;
        isCProtectActive = false;
        cProtectDamage = 10;
        usedProtectLastTurn = false;
        bossAccuracy = 1.0;
        lastDamageTaken = 0;
        playerDamageMultiplier = 1;

        isAsleep = false;
        sleepTurnsRemaining = 0;
        if (sleepOverlay) {
            sleepOverlay.style.display = 'none';
            sleepOverlay.style.opacity = '0';
        }

        playerName = 'CHARMANDER';
        if (playerSprite) {
            playerSprite.src = 'https://img.pokemondb.net/sprites/black-white/anim/back-normal/charmander.gif';
            playerSprite.style.opacity = "1";
            playerSprite.style.filter = "brightness(1)";
            playerSprite.style.zIndex = "10";
            
            playerSprite.style.width = '150px';
            playerSprite.style.left = '0px';
            playerSprite.style.transform = 'scale(1)';
        }

        currentPlayerMoves = [
            { key: 'MOVE1', name: 'SCRATCH', damage: 120, displayText: () => `${playerName} used SCRATCH!` },
            { key: 'MOVE2', name: 'SAND-ATTACK', damage: 10, displayText: () => `${playerName} used SAND-ATTACK!` },
            { key: 'MOVE3', name: 'CORGE-ENGE', damage: 50, displayText: () => `${playerName} used CORGE-ENGE!`, critText: () => `${playerName} copied the last damaging move!` },
            { key: 'MOVE4', name: '-', damage: 0, displayText: () => '-' }
        ];
        renderMoves();
        turnNumber = 1;
        nextEvolveTurn = 2;
        evolveAvailable = false;
        const evolveBtn = document.getElementById('evolve-btn');
        if (evolveBtn) evolveBtn.style.display = 'none';

        updateUIBars();
        updatePlayerNameUI(); 
        updateDialogue("A wild Corgear appeared!");
        toggleOptions(true);
        updateTurnButton();

        document.getElementById('moves-ui').style.display = 'none';
        document.getElementById('default-ui').style.display = 'flex';

        overlay.style.opacity = "0";
        overlay.style.pointerEvents = "none";
    }, 1000);
}
