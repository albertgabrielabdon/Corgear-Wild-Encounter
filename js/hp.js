let pHP = 101;
let bHP = 2000;
let pMax = 101;
const bMax = 2000;

let bossDefenseDivisor = 1;      
let isCProtectActive = false;    
let cProtectDamage = 10;         
let usedProtectLastTurn = false; 
let bossAccuracy = 1.0;
let lastDamageTaken = 0;

let lastBossHP = bHP;
let lastPlayerHP = pHP;

function applyDamage(target, amount, minionId = null) {
    if (amount <= 0) return;

    const dmgSound = document.getElementById('damage-sound');

    if (target === 'boss') {
        bHP = Math.max(0, bHP - amount);
        showDamage(document.querySelector('.boss'), amount);
    } else if (target === 'player') {
        pHP = Math.max(0, pHP - amount);
        showDamage(document.querySelector('.player'), amount);
    } else if (target === 'rayquaza' || target === 'minion') {
        let targetMinion = activeMinions.find(m => m.id === minionId);
        if (targetMinion) {

            if (targetMinion.hp > targetMinion.maxHp) {
                let extraHP = targetMinion.hp - targetMinion.maxHp;
                if (amount <= extraHP) targetMinion.hp -= amount;
                else {
                    let remaining = amount - extraHP;
                    targetMinion.hp = targetMinion.maxHp - remaining;
                }
            } else {
                targetMinion.hp -= amount;
            }
            if (targetMinion.hp < 0) targetMinion.hp = 0;
            updateMinionUI(targetMinion);
        }
    }
    updateUIBars();


    if (dmgSound) {
        dmgSound.currentTime = 0;
        dmgSound.play().catch(e => console.log(e));
    }

    updateUIBars();
}

function damageEffects() {
    const bossSprite = document.querySelector('.boss');
    const playerSprite = document.querySelector('.player');
    const dmgSound = document.getElementById('damage-sound');

    if (bHP < lastBossHP) {
        const damage = lastBossHP - bHP;
        showDamage(bossSprite, damage);
        if (dmgSound) dmgSound.play().catch(e => console.log(e));
        lastBossHP = bHP;
    }

    if (pHP < lastPlayerHP) {
        const damage = lastPlayerHP - pHP;
        showDamage(playerSprite, damage);
        if (dmgSound) dmgSound.play().catch(e => console.log(e));
        lastPlayerHP = pHP;
    }
}