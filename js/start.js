document.addEventListener("DOMContentLoaded", () => {

    const overlay = document.getElementById("start-overlay");
    const music = document.getElementById("game-theme");

    music.volume = 0.5;
    overlay.addEventListener("click", () => {

        music.play().catch(err => console.log(err));
        overlay.classList.add("fade-out");
        setTimeout(() => {
            overlay.remove();
        }, 600);

    });

});