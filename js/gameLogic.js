// Game logic and mechanics
const GameLogic = {
    // Roll a random number between 1 and max
    rollNumber(max) {
        return Math.floor(Math.random() * max) + 1;
    },

    // Calculate roll percentage for animations
    getRollPercentage(rolled, max) {
        return rolled / max;
    },

    // Check if roll is high (good)
    isHighRoll(rolled, max) {
        return this.getRollPercentage(rolled, max) > 0.7;
    },

    // Check if roll is low (dangerous)
    isLowRoll(rolled, max) {
        return this.getRollPercentage(rolled, max) < 0.3;
    },

    // Check if the game should end (rolled 1)
    isGameOver(rolled) {
        return rolled === 1;
    },

    // Generate a random starting number
    generateRandomStartingNumber(min = 2, max = 10000000) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Validate starting number input
    validateStartingNumber(value, min = 2, max = 10000000) {
        const num = parseInt(value);
        if (isNaN(num) || num < min || num > max) {
            return false;
        }
        return num;
    },

    // Process a player's turn
    processTurn(currentMax) {
        if (!GameState.gameActive) {
            throw new Error('Game is not active');
        }

        const rolled = this.rollNumber(currentMax);
        
        const result = {
            rolled: rolled,
            isGameOver: this.isGameOver(rolled),
            isHighRoll: this.isHighRoll(rolled, currentMax),
            isLowRoll: this.isLowRoll(rolled, currentMax),
            percentage: this.getRollPercentage(rolled, currentMax)
        };

        if (result.isGameOver) {
            GameState.endGame();
        } else {
            GameState.setCurrentMax(rolled);
            GameState.nextPlayer();
            GameState.firstRoll = false;
        }

        return result;
    }
};