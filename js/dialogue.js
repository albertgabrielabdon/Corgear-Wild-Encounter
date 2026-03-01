
function updateDialogue(message) {
    const statusText = document.getElementById('attack-text');
    if (statusText) {
        statusText.innerText = message;
        statusText.style.animation = 'none';
        statusText.offsetHeight; 
        statusText.style.animation = null; 
    }
}

function showDialogueParts(parts, defaultDelay = 1500, criticalDelay = 2500, onComplete = null) {
    const statusText = document.getElementById('attack-text');
    if (!statusText || !parts.length) {
        if (onComplete) onComplete();
        return;
    }

    let index = 0;

    function showNext() {
        let line = parts[index];
        statusText.innerText = line;
        statusText.style.animation = 'none';
        statusText.offsetHeight;
        statusText.style.animation = null;

        if (index === 0) updateUIBars();

        let delay = defaultDelay;
        if (line.toLowerCase().includes("critical hit")) delay = criticalDelay;
        else if (line.toLowerCase().includes("but it missed")) delay = 3000;

        index++;
        if (index < parts.length) setTimeout(showNext, delay);
        else if (onComplete) setTimeout(onComplete, delay);
    }      

    
    showNext();
}