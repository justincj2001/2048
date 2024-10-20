// Game variables
let grid = [];
let score = 0;
let startX, startY, endX, endY;

// Initialize the grid and add two random tiles
function initializeGrid() {
    for (let i = 0; i < 4; i++) {
        grid[i] = [];
        for (let j = 0; j < 4; j++) {
            grid[i][j] = 0;
        }
    }
    addRandomTile();
    addRandomTile();
}

// Add a random tile (2 or 4) to the grid
function addRandomTile() {
    let available = [];
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (grid[row][col] === 0) {
                available.push({ row, col });
            }
        }
    }
    if (available.length > 0) {
        let randomIndex = Math.floor(Math.random() * available.length);
        let { row, col } = available[randomIndex];
        grid[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
}

// Update the grid display
function updateGrid() {
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            let cell = document.getElementById(`cell-${row}-${col}`);
            let value = grid[row][col];
            cell.textContent = value === 0 ? "" : value;
            cell.setAttribute('data-value', value); // To handle color changes
        }
    }
    document.getElementById("score").textContent = `Score: ${score}`;
}

// Move the tiles in the specified direction
function moveLeft() {
    let moved = false;
    for (let row = 0; row < 4; row++) {
        let newRow = grid[row].filter(value => value !== 0);
        for (let i = 0; i < newRow.length - 1; i++) {
            if (newRow[i] === newRow[i + 1]) {
                newRow[i] *= 2;
                score += newRow[i];
                newRow[i + 1] = 0;
            }
        }
        newRow = newRow.filter(value => value !== 0);
        while (newRow.length < 4) newRow.push(0);
        if (!arraysEqual(grid[row], newRow)) {
            grid[row] = newRow;
            moved = true;
        }
    }
    if (moved) {
        addRandomTile();
        updateGrid();
        if (checkGameOver()) {
            displayGameOver();
        }
    }
}

function moveRight() {
    rotateGrid(2);
    moveLeft();
    rotateGrid(2);
}

function moveUp() {
    rotateGrid(1);
    moveLeft();
    rotateGrid(3);
}

function moveDown() {
    rotateGrid(3);
    moveLeft();
    rotateGrid(1);
}

// Rotate the grid clockwise (1 = 90°, 2 = 180°, 3 = 270°)
function rotateGrid(times) {
    for (let t = 0; t < times; t++) {
        let newGrid = [];
        for (let row = 0; row < 4; row++) {
            newGrid[row] = [];
            for (let col = 0; col < 4; col++) {
                newGrid[row][col] = grid[3 - col][row];
            }
        }
        grid = newGrid;
    }
}

// Check if two arrays are equal
function arraysEqual(a, b) {
    return a.length === b.length && a.every((val, index) => val === b[index]);
}

// Check if the game is over (no moves left)
function checkGameOver() {
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (grid[row][col] === 0) return false;
            if (col < 3 && grid[row][col] === grid[row][col + 1]) return false;
            if (row < 3 && grid[row][col] === grid[row + 1][col]) return false;
        }
    }
    return true;
}

// Display the game over message
function displayGameOver() {
    document.getElementById("game-message").textContent = "Game Over!";
}

// Detect touch gestures (swipe for mobile)
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

// Handle swipe gestures (determine direction)
function handleGesture() {
    let diffX = endX - startX;
    let diffY = endY - startY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0) {
            moveRight();
        } else {
            moveLeft();
        }
    } else {
        // Vertical swipe
        if (diffY > 0) {
            moveDown();
        } else {
            moveUp();
        }
    }
}

// Initialize the game
function startGame() {
    initializeGrid();
    updateGrid();
    detectSwipe();
}

window.onload = function() {
    startGame();
};
