document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.querySelector('.game-container');
    const restartButton = document.getElementById('restart-button');
    const timerElement = document.getElementById('timer');
    const levelElement = document.getElementById('level');
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let matchedPairs = 0;
    let timer;
    let startTime;
    let level = 1;
    const flipSound = new Audio('sounds/flip.mp3');
    const matchSound = new Audio('sounds/match.mp3');
    const winSound = new Audio('sounds/win.mp3');

    function createBoard() {
        gameContainer.innerHTML = '';
        const totalPairs = level + 3;
        const cardValues = Array.from({ length: totalPairs }, (_, i) => i + 1).flatMap(v => [v, v]);
        cardValues.sort(() => Math.random() - 0.5);

        cardValues.forEach(value => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.cardValue = value;
            gameContainer.appendChild(card);
        });

        const cards = document.querySelectorAll('.card');
        cards.forEach(card => card.addEventListener('click', flipCard));
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flip');
        flipSound.play();

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.cardValue === secondCard.dataset.cardValue;
        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        matchedPairs++;
        matchSound.play();
        resetBoard();

        if (matchedPairs === (level + 3)) {
            clearInterval(timer);
            winSound.play();
            setTimeout(() => {
                alert(`Level ${level} completed in ${Math.floor((Date.now() - startTime) / 1000)} seconds!`);
                level++;
                if (level > 9) {
                    alert('Congratulations! You have completed all levels!');
                    level = 1;
                }
                startGame();
            }, 500);
        }
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoard();
        }, 1500);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function startTimer() {
        startTime = Date.now();
        timerElement.textContent = "Time: 0 seconds";
        timer = setInterval(() => {
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            timerElement.textContent = `Time: ${elapsedTime} seconds`;
        }, 1000);
    }

    function resetGame() {
        level = 1;
        startGame();
    }

    function startGame() {
        clearInterval(timer);
        matchedPairs = 0;
        createBoard();
        startTimer();
        levelElement.textContent = `Level: ${level}`;
    }

    restartButton.addEventListener('click', resetGame);
    startGame();
});













