const screens = document.querySelectorAll(".screen");
const cells = document.querySelectorAll(".cell");

const homeScreen = document.getElementById("homeScreen");
const symbolScreen = document.getElementById("symbolScreen");
const gameScreen = document.getElementById("gameScreen");
const scoresScreen = document.getElementById("scoresScreen");

const pvpBtn = document.getElementById("pvpBtn");
const computerBtn = document.getElementById("computerBtn");
const scoresBtn = document.getElementById("scoresBtn");

const backToHome = document.getElementById("backToHome");
const backToMenu = document.getElementById("backToMenu");
const backFromScores = document.getElementById("backFromScores");

const symbolButtons = document.querySelectorAll(".symbol-btn");
const continueBtn = document.getElementById("continueBtn");
const setupText = document.getElementById("setupText");

const turnText = document.getElementById("turnText");
const restartBtn = document.getElementById("restartBtn");

const resultOverlay = document.getElementById("resultOverlay");
const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");
const resultSubtext = document.getElementById("resultSubtext");
const celebration = document.getElementById("celebration");

const closePopup = document.getElementById("closePopup");
const playAgainBtn = document.getElementById("playAgainBtn");
const popupMenuBtn = document.getElementById("popupMenuBtn");

const resetScoresBtn = document.getElementById("resetScoresBtn");

let board = ["","","","","","","","",""];
let currentPlayer = "X";
let playerSymbol = "X";
let computerSymbol = "O";
let gameMode = "pvp";
let gameOver = false;

let scores = {
    X: 0,
    O: 0,
    draws: 0
};

function showScreen(screen) {
    screens.forEach(item => item.classList.remove("active"));
    screen.classList.add("active");
}

function updateScores() {
    document.getElementById("xScore").textContent = scores.X;
    document.getElementById("oScore").textContent = scores.O;
    document.getElementById("drawScore").textContent = scores.draws;

    document.getElementById("xScorePage").textContent = scores.X;
    document.getElementById("oScorePage").textContent = scores.O;
    document.getElementById("drawScorePage").textContent = scores.draws;
}

function clearBoard() {
    board = ["","","","","","","","",""];
    gameOver = false;

    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("x", "o", "winner");
    });

    currentPlayer = "X";
    updateTurnText();
}

function updateTurnText() {
    if (gameMode === "computer" && currentPlayer === computerSymbol) {
        turnText.textContent = "Computer's Turn";
    } else {
        turnText.textContent = "Player " + currentPlayer + "'s Turn";
    }
}

function checkWinner() {
    const combinations = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];

    for (let combination of combinations) {
        const [a,b,c] = combination;

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return combination;
        }
    }

    return null;
}

function makeMove(index, symbol) {
    if (board[index] !== "" || gameOver) {
        return;
    }

    board[index] = symbol;
    cells[index].textContent = symbol;
    cells[index].classList.add(symbol.toLowerCase());

    const winningCombination = checkWinner();

    if (winningCombination) {
        gameOver = true;

        winningCombination.forEach(index => {
            cells[index].classList.add("winner");
        });

        scores[symbol]++;
        updateScores();

        setTimeout(() => {
            showResult(symbol + " WINS!", "Player " + symbol, "Great game!");
        }, 300);

        return;
    }

    if (!board.includes("")) {
        gameOver = true;
        scores.draws++;
        updateScores();

        setTimeout(() => {
            showResult("IT'S A DRAW!", "Nobody wins this round.", "Good game!");
        }, 300);

        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateTurnText();

    if (gameMode === "computer" && currentPlayer === computerSymbol) {
        setTimeout(computerMove, 450);
    }
}

function computerMove() {
    if (gameOver) {
        return;
    }

    const emptyCells = [];

    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            emptyCells.push(i);
        }
    }

    if (emptyCells.length === 0) {
        return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    makeMove(emptyCells[randomIndex], computerSymbol);
}

function showResult(title, message, subtext) {
    resultTitle.textContent = title;
    resultMessage.textContent = message;
    resultSubtext.textContent = subtext;

    if (title.includes("DRAW")) {
        celebration.textContent = "—";
    } else {
        celebration.textContent = "✦";
    }

    resultOverlay.classList.add("show");
}

function closeResult() {
    resultOverlay.classList.remove("show");
}

pvpBtn.addEventListener("click", () => {
    gameMode = "pvp";
    setupText.textContent = "Choose your symbol";
    showScreen(symbolScreen);
});

computerBtn.addEventListener("click", () => {
    gameMode = "computer";
    setupText.textContent = "You are playing against the computer";
    showScreen(symbolScreen);
});

scoresBtn.addEventListener("click", () => {
    updateScores();
    showScreen(scoresScreen);
});

backToHome.addEventListener("click", () => {
    showScreen(homeScreen);
});

backToMenu.addEventListener("click", () => {
    clearBoard();
    showScreen(homeScreen);
});

backFromScores.addEventListener("click", () => {
    showScreen(homeScreen);
});

symbolButtons.forEach(button => {
    button.addEventListener("click", () => {
        symbolButtons.forEach(item => item.classList.remove("selected"));
        button.classList.add("selected");
        playerSymbol = button.dataset.symbol;
        computerSymbol = playerSymbol === "X" ? "O" : "X";
    });
});

continueBtn.addEventListener("click", () => {
    clearBoard();
    showScreen(gameScreen);

    if (gameMode === "computer" && playerSymbol === "O") {
        currentPlayer = "X";
        updateTurnText();
        setTimeout(computerMove, 450);
    }
});

cells.forEach(cell => {
    cell.addEventListener("click", () => {
        if (gameMode === "computer" && currentPlayer === computerSymbol) {
            return;
        }

        makeMove(Number(cell.dataset.index), currentPlayer);
    });
});

restartBtn.addEventListener("click", clearBoard);

playAgainBtn.addEventListener("click", () => {
    closeResult();
    clearBoard();

    if (gameMode === "computer" && playerSymbol === "O") {
        setTimeout(computerMove, 450);
    }
});

closePopup.addEventListener("click", closeResult);

popupMenuBtn.addEventListener("click", () => {
    closeResult();
    clearBoard();
    showScreen(homeScreen);
});

resetScoresBtn.addEventListener("click", () => {
    scores = {
        X: 0,
        O: 0,
        draws: 0
    };

    updateScores();
});

updateScores();
