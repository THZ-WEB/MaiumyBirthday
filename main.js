import confetti from 'canvas-confetti';

document.addEventListener('DOMContentLoaded', () => {
    // --- Sound Effect ---
    let hasInteracted = false;
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let soundBuffer;

    async function setupSound() {
        try {
            const response = await fetch('party_popper.mp3');
            const arrayBuffer = await response.arrayBuffer();
            soundBuffer = await audioContext.decodeAudioData(arrayBuffer);
        } catch (error) {
            console.error("Failed to load sound:", error);
        }
    }

    function playSound() {
        if (!soundBuffer) return;
        const source = audioContext.createBufferSource();
        source.buffer = soundBuffer;
        source.connect(audioContext.destination);
        source.start(0);
    }

    document.body.addEventListener('click', () => {
        if (!hasInteracted) {
            hasInteracted = true;
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            playSound();
        }
    }, { once: true });

    setupSound();


    // --- Confetti ---
    const myCanvas = document.getElementById('confetti-canvas');
    const myConfetti = confetti.create(myCanvas, {
        resize: true,
        useWorker: true
    });

    function launchConfetti() {
        myConfetti({
            particleCount: 150,
            spread: 180,
            origin: { y: -0.1 }
        });
    }

    setTimeout(launchConfetti, 500);


    // --- Countdown Timer ---
    const partyDate = new Date("2024-07-20T16:00:00").getTime();

    const countdownElement = document.getElementById('countdown');
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = partyDate - now;

        if (distance <= 0) {
            // Quando a hora chega
            clearInterval(timerInterval);

            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';

            // Mostra mensagem especial
            const message = document.createElement('h2');
            message.textContent = "É hora da festa! 🎉";
            message.style.marginTop = '15px';
            message.style.color = '#e91e63';
            message.style.fontSize = '1.5rem';
            countdownElement.appendChild(message);

            // Solta mais confete
            myConfetti({
                particleCount: 300,
                spread: 180,
                origin: { y: 0.6 }
            });
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown(); // Inicial
    const timerInterval = setInterval(updateCountdown, 1000);
});
