// Game state management
const GameState = {
    players: [],
    currentPlayerIndex: 0,
    currentMax: 1000,
    gameActive: false,
    firstRoll: true,

    // Initialize game state
    init() {
        this.players = [];
        this.currentPlayerIndex = 0;
        this.currentMax = 1000;
        this.gameActive = false;
        this.firstRoll = true;
    },

    // Add a player to the game
    addPlayer(name) {
        this.players.push({ name: name || `Player ${this.players.length + 1}` });
    },

    // Get current player
    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    },

    // Move to next player
    nextPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    },

    // Set the current maximum number
    setCurrentMax(value) {
        this.currentMax = value;
    },

    // Check if game is in a dangerous state
    getDangerLevel() {
        if (this.firstRoll) return 'safe';
        
        if (this.currentMax <= 10) return 'critical';
        if (this.currentMax <= 100) return 'high';
        if (this.currentMax <= 1000) return 'medium';
        if (this.currentMax <= 10000) return 'low';
        return 'safe';
    },

    // Start the game
    startGame(startingNumber, randomizeOrder = true) {
        if (this.players.length < 2) {
            throw new Error('You need at least 2 players!');
        }

        this.currentMax = startingNumber;
        
        if (randomizeOrder) {
            this.players.sort(() => Math.random() - 0.5);
        }
        
        this.currentPlayerIndex = 0;
        this.gameActive = true;
        this.firstRoll = true;
    },

    // End the game
    endGame() {
        this.gameActive = false;
    },

    // Reset game state
    reset() {
        this.init();
    }
};