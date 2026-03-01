let snoreSound = new Audio('audio/sleep.mp3');
snoreSound.volume = 0.8;

function playSnore() {
    snoreSound.currentTime = 0;
    snoreSound.play().catch(e => console.log(e));
}

function updateUIBars() {
    const bFill = document.getElementById('boss-hp-fill');
    const pFill = document.getElementById('player-hp-fill');

    if (bFill) {
        if (bHP > bMax) {
            bFill.style.width = "100%";
            bFill.style.backgroundColor = "#e0e0e0"; 
            bFill.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.8), inset 0 0 5px #fff";
        } else {
            const bPercent = (bHP / bMax) * 100;
            bFill.style.width = bPercent + "%";
            bFill.style.boxShadow = "none";
            bFill.style.backgroundColor = bPercent > 50 ? "#63de5a" : bPercent > 20 ? "#f1c40f" : "#e74c3c";
        }
    }

    if (pFill) {
        const pPercent = (pHP / pMax) * 100;
        pFill.style.width = pPercent + "%";
        pFill.style.backgroundColor = pPercent > 50 ? "#63de5a" : pPercent > 20 ? "#f1c40f" : "#e74c3c";

        const bar = pFill.parentElement;
        bar.classList.remove("low", "medium");

        if (pHP <= 30 && pHP > 0) {
            bar.classList.add("low");
        } else if (pHP <= 60) {
            bar.classList.add("medium");
        }
    }
}

function showDamage(target, amount) {
    if (!target || amount <= 0) return;

    const dmgText = document.createElement('div');
    dmgText.innerText = `-${Math.floor(amount)}`;
    dmgText.style.position = 'absolute';
    dmgText.style.color = 'red';
    dmgText.style.fontWeight = 'bold';
    dmgText.style.fontSize = '60px';
    dmgText.style.pointerEvents = 'none';
    dmgText.style.transition = 'all 0.8s ease-out';
    
    const rect = target.getBoundingClientRect();
    dmgText.style.left = `${rect.left + rect.width / 2}px`;
    dmgText.style.top = `${rect.top - 20}px`;

    document.body.appendChild(dmgText);

    requestAnimationFrame(() => {
        dmgText.style.top = `${rect.top - 60}px`;
        dmgText.style.opacity = 0;
    });

    setTimeout(() => dmgText.remove(), 800);
}

function toggleOptions(show) {
    const allOptions = document.querySelectorAll('.options');
    const leftCont = document.querySelector('.left-cont');

    allOptions.forEach(el => el.style.display = show ? 'grid' : 'none');

    if (leftCont) leftCont.style.setProperty('width', show ? '70%' : '100%', 'important');
}

function openFight() {
    const def = document.getElementById('default-ui');
    const mov = document.getElementById('moves-ui');
    if (def && mov) {
        def.style.setProperty('display', 'none', 'important');
        mov.style.setProperty('display', 'flex', 'important');
    }
}

function closeFight() {
    const def = document.getElementById('default-ui');
    const mov = document.getElementById('moves-ui');
    if (def && mov) {
        mov.style.setProperty('display', 'none', 'important');
        def.style.setProperty('display', 'flex', 'important');
    }
}

function useRest() {
    if (isAsleep) {
        updateDialogue(`${playerName} is already asleep!`);
        return;
    }

    toggleOptions(false);
    closeFight();

    pHP = pMax;
    isAsleep = true;
    sleepTurnsRemaining = 3;
    playSnore();

    updateUIBars();

    positionSleepOverlay();
    sleepOverlay.style.display = 'block';
    sleepOverlay.style.opacity = '1';
    playerSprite.style.filter = 'brightness(0.7)';

    showDialogueParts(
        [`${playerName} used Rest!`, `${playerName} fell fast asleep!`],
        1000,
        2500,
        () => {
            corgearTurn();
        }
    );
}