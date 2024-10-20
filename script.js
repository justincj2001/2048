const gridContainer = document.getElementById("grid-container");
const scoreDisplay = document.getElementById("score");
const messageDisplay = document.getElementById("game-message");

let grid = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

let score = 0;

// Initialize the grid
function initializeGrid() {
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            let cell = document.createElement("div");
            cell.classList.add("game-cell");
            cell.id = `cell-${row}-${col}`;
            gridContainer.appendChild(cell);
        }
    }
    generateRandomTile();
    generateRandomTile();
    updateGrid();
}

// Generate random tile (2 or 4)
function generateRandomTile() {
    let availableCells = [];
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (grid[row][col] === 0) {
                availableCells.push({ row, col });
            }
        }
    }
    if (availableCells.length === 0) return;

    let randomIndex = Math.floor(Math.random() * availableCells.length);
    let randomCell = availableCells[randomIndex];
    grid[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
}
// Update the cell content and background dynamically
function updateGrid() {
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            let cell = document.getElementById(`cell-${row}-${col}`);
            let value = grid[row][col];
            cell.textContent = value === 0 ? "" : value;
            cell.setAttribute('data-value', value); // Add value to data-value attribute
            cell.style.backgroundColor = getBackgroundColor(value);
        }
    }
    scoreDisplay.textContent = score;
}

// Modify background color for tiles based on the value
function getBackgroundColor(value) {
    switch (value) {
        case 0: return "#cdc1b4";
        case 2: return "#eee4da";
        case 4: return "#ede0c8";
        case 8: return "#f2b179";
        case 16: return "#f59563";
        case 32: return "#f67c5f";
        case 64: return "#f65e3b";
        case 128: return "#edcf72";
        case 256: return "#edcc61";
        case 512: return "#edc850";
        case 1024: return "#edc53f";
        case 2048: return "#edc22e";
        default: return "#3c3a32";
    }
}

// Handle keypress for movement
window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            moveUp();
            break;
        case "ArrowDown":
            moveDown();
            break;
        case "ArrowLeft":
            moveLeft();
            break;
        case "ArrowRight":
            moveRight();
            break;
    }
    updateGrid();
    checkGameOver();
});

// Shift and merge functions for each direction
function moveUp() {
    for (let col = 0; col < 4; col++) {
        let column = [];
        for (let row = 0; row < 4; row++) {
            column.push(grid[row][col]);
        }
        let newColumn = shiftAndMerge(column);
        for (let row = 0; row < 4; row++) {
            grid[row][col] = newColumn[row];
        }
    }
    generateRandomTile();
}

function moveDown() {
    for (let col = 0; col < 4; col++) {
        let column = [];
        for (let row = 0; row < 4; row++) {
            column.push(grid[row][col]);
        }
        let newColumn = shiftAndMerge(column.reverse()).reverse();
        for (let row = 0; row < 4; row++) {
            grid[row][col] = newColumn[row];
        }
    }
    generateRandomTile();
}

function moveLeft() {
    for (let row = 0; row < 4; row++) {
        let newRow = shiftAndMerge(grid[row]);
        grid[row] = newRow;
    }
    generateRandomTile();
}

function moveRight() {
    for (let row = 0; row < 4; row++) {
        let newRow = shiftAndMerge(grid[row].reverse()).reverse();
        grid[row] = newRow;
    }
    generateRandomTile();
}

// Merge function (shift and merge values)
function shiftAndMerge(row) {
    let arr = row.filter(val => val !== 0); // remove zeros
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
            arr[i] *= 2;
            score += arr[i];
            arr[i + 1] = 0;
        }
    }
    arr = arr.filter(val => val !== 0); // remove merged zeros
    while (arr.length < 4) arr.push(0); // fill with zeros
    return arr;
}

// Check if game is over
function checkGameOver() {
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (grid[row][col] === 0) return; // game not over if empty cell exists
            if (col < 3 && grid[row][col] === grid[row][col + 1]) return;
            if (row < 3 && grid[row][col] === grid[row + 1][col]) return;
        }
    }
    messageDisplay.textContent = "Game Over!";
}

let startX, startY, endX, endY;

function detectSwipe() {
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, false);

    document.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        handleGesture();
    }, false);
}

function handleGesture() {
    let diffX = endX - startX;
    let diffY = endY - startY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Swipe was horizontal
        if (diffX > 0) {
            // Right swipe
            moveRight();
        } else {
            // Left swipe
            moveLeft();
        }
    } else {
        // Swipe was vertical
        if (diffY > 0) {
            // Down swipe
            moveDown();
        } else {
            // Up swipe
            moveUp();
        }
    }
}

// Initialize the touch gesture detection
detectSwipe();

// Initialize the game
initializeGrid();
