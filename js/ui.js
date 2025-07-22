// UI management and updates
const UI = {
    elements: {},

    // Initialize UI elements
    init() {
        this.elements = {
            setupScreen: document.querySelector('.setup-screen'),
            gameScreen: document.querySelector('.game-screen'),
            playerInputs: document.getElementById('player-inputs'),
            startingNumber: document.getElementById('starting-number'),
            randomizeOrder: document.getElementById('randomize-order'),
            currentNumber: document.getElementById('current-number'),
            maxNumber: document.getElementById('max-number'),
            currentPlayer: document.getElementById('current-player'),
            rollButton: document.getElementById('roll-button'),
            gameOver: document.getElementById('game-over'),
            loserText: document.getElementById('loser-text'),
            bomb: document.getElementById('bomb'),
            bombMouth: document.getElementById('bomb-mouth'),
            playerInfo: document.getElementById('player-info')
        };
    },

    // Show setup screen
    showSetupScreen() {
        this.elements.setupScreen.classList.add('active');
        this.elements.gameScreen.classList.remove('active');
    },

    // Show game screen
    showGameScreen() {
        this.elements.setupScreen.classList.remove('active');
        this.elements.gameScreen.classList.add('active');
    },

    // Add a new player input field
    addPlayerInput() {
        const playerCount = this.elements.playerInputs.children.length;
        
        const newPlayer = document.createElement('div');
        newPlayer.className = 'player-setup';
        newPlayer.innerHTML = `
            <h3>Player ${playerCount + 1}</h3>
            <input type="text" placeholder="Enter name" class="player-name" data-player="${playerCount}">
        `;
        
        this.elements.playerInputs.appendChild(newPlayer);
    },

    // Get all player names from inputs
    getPlayerNames() {
        const nameInputs = document.querySelectorAll('.player-name');
        const names = [];
        
        for (let i = 0; i < nameInputs.length; i++) {
            const name = nameInputs[i].value || `Player ${i + 1}`;
            names.push(name);
        }
        
        return names;
    },

    // Update the main game display
    updateGameDisplay() {
        this.elements.currentNumber.textContent = GameState.currentMax.toLocaleString();
        this.elements.maxNumber.textContent = GameState.currentMax.toLocaleString();
        this.elements.currentPlayer.textContent = `${GameState.getCurrentPlayer().name}'s Turn`;
        
        this.updateDangerLevel();
    },

    // Update danger level styling
    updateDangerLevel() {
        const body = document.body;
        const bomb = this.elements.bomb;
        const mouth = this.elements.bombMouth;
        const dangerLevel = GameState.getDangerLevel();
        
        // Reset classes
        body.className = '';
        bomb.className = 'bomb';
        mouth.className = 'mouth';
        
        // Apply danger level styling
        switch (dangerLevel) {
            case 'critical':
                body.classList.add('danger-critical');
                bomb.classList.add('flashing-critical', 'shaking', 'terrified');
                mouth.classList.add('terrified');
                break;
            case 'high':
                body.classList.add('danger-high');
                bomb.classList.add('flashing-faster', 'shaking', 'worried');
                mouth.classList.add('worried');
                break;
            case 'medium':
                body.classList.add('danger-medium');
                bomb.classList.add('flashing-fast', 'nervous');
                mouth.classList.add('neutral');
                break;
            case 'low':
                body.classList.add('danger-low');
                bomb.classList.add('flashing');
                mouth.classList.add('neutral');
                break;
            default:
                bomb.classList.add('flashing');
                mouth.classList.add('smile');
                break;
        }
    },

    // Animate number roll
    animateRoll(result) {
        const numberDisplay = this.elements.currentNumber;
        
        // Remove existing animation classes
        numberDisplay.classList.remove('roll-animation', 'high-roll', 'low-roll');
        void numberDisplay.offsetWidth; // Trigger reflow
        
        // Add roll animation
        numberDisplay.classList.add('roll-animation');
        
        // Add result-based styling
        if (result.isHighRoll) {
            numberDisplay.classList.add('high-roll');
        } else if (result.isLowRoll) {
            numberDisplay.classList.add('low-roll');
        }
        
        // Update number after animation delay
        setTimeout(() => {
            numberDisplay.textContent = result.rolled.toLocaleString();
        }, 250);
    },

    // Show explosion animation
    showExplosion() {
        const bombContainer = document.querySelector('.bomb-container');
        const explosion = document.createElement('div');
        explosion.className = 'explosion';
        bombContainer.appendChild(explosion);
        
        this.elements.bomb.style.display = 'none';
    },

    // Show game over screen
    showGameOver() {
        this.elements.loserText.textContent = `${GameState.getCurrentPlayer().name} hit 1 and lost!`;
        this.elements.rollButton.style.display = 'none';
        this.elements.playerInfo.style.display = 'none';
        
        setTimeout(() => {
            this.elements.gameOver.classList.add('active');
        }, 500);
    },

    // Reset UI to initial state
    resetUI() {
        // Reset body classes
        document.body.className = '';
        
        // Show setup screen
        this.showSetupScreen();
        this.elements.gameOver.classList.remove('active');
        
        // Show hidden elements
        this.elements.rollButton.style.display = '';
        this.elements.playerInfo.style.display = '';
        this.elements.bomb.style.display = '';
        
        // Remove explosion if it exists
        const explosion = document.querySelector('.explosion');
        if (explosion) {
            explosion.remove();
        }
        
        // Clear player inputs
        const nameInputs = document.querySelectorAll('.player-name');
        nameInputs.forEach(input => input.value = '');
        
        // Keep only first two player inputs
        while (this.elements.playerInputs.children.length > 2) {
            this.elements.playerInputs.removeChild(this.elements.playerInputs.lastChild);
        }
        
        // Reset starting number input
        this.elements.startingNumber.value = '';
    }
};