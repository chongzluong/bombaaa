// Main game controller - connects UI with game logic
document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI elements
    UI.init();
    
    // Initialize game state
    GameState.init();
});

// Add a new player input field
function addPlayer() {
    UI.addPlayerInput();
}

// Remove a player input field
function removePlayer(index) {
    UI.removePlayerInput(index);
}

// Navigate to game settings screen
function goToGameSettings() {
    // Validate minimum players before proceeding
    const playerNames = UI.getPlayerNames();
    if (playerNames.length < 2) {
        alert('You need at least 2 players!');
        return;
    }
    
    UI.showSettingsScreen();
}

// Navigate back to players screen
function goToPlayers() {
    UI.showPlayersScreen();
}

// Generate a random starting number
function randomizeStartingNumber() {
    const randomNumber = GameLogic.generateRandomStartingNumber();
    UI.elements.startingNumber.value = randomNumber;
}

// Start the game
function startGame() {
    try {
        // Get player names
        const playerNames = UI.getPlayerNames();
        
        // Validate minimum players
        if (playerNames.length < 2) {
            alert('You need at least 2 players!');
            return;
        }
        
        // Add players to game state
        GameState.init();
        playerNames.forEach(name => GameState.addPlayer(name));
        
        // Get and validate starting number
        const startingNumberValue = UI.elements.startingNumber.value;
        const startingNumber = GameLogic.validateStartingNumber(startingNumberValue) || 
                             GameLogic.generateRandomStartingNumber();
        
        // Get randomize order setting
        const randomizeOrder = UI.elements.randomizeOrder.checked;
        
        // Start the game
        GameState.startGame(startingNumber, randomizeOrder);
        
        // Update UI
        UI.showGameScreen();
        UI.updateGameDisplay();
        
    } catch (error) {
        alert(error.message);
    }
}

// Roll a number
function rollNumber() {
    if (!GameState.gameActive) return;
    
    try {
        // Process the turn
        const result = GameLogic.processTurn(GameState.currentMax);
        
        // Animate the roll
        UI.animateRoll(result);
        
        // Handle game over
        if (result.isGameOver) {
            UI.showExplosion();
            UI.showGameOver();
        } else {
            // Update display after animation
            setTimeout(() => {
                UI.updateGameDisplay();
            }, 300);
        }
        
    } catch (error) {
        console.error('Error during roll:', error);
    }
}

// Reset the game to initial state
function resetGame() {
    GameState.reset();
    UI.resetUI();
}