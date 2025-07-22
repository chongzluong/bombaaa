// UI management and updates
const UI = {
    elements: {},

    // Initialize UI elements
    init() {
        this.elements = {
            playersScreen: document.querySelector('.players-screen'),
            settingsScreen: document.querySelector('.settings-screen'),
            gameScreen: document.querySelector('.game-screen'),
            playerInputs: document.getElementById('player-inputs'),
            startingNumber: document.getElementById('starting-number'),
            randomizeOrder: document.getElementById('randomize-order'),
            currentNumber: document.getElementById('current-number'),
            maxNumber: document.getElementById('max-number'),
            currentPlayer: document.getElementById('current-player'),
            rollButton: document.getElementById('roll-button'),
            gameOver: document.getElementById('game-over'),
            gameOverText: document.getElementById('game-over-text'),
            loserText: document.getElementById('loser-text'),
            bomb: document.getElementById('bomb'),
            bombMouth: document.getElementById('bomb-mouth'),
            playerInfo: document.getElementById('player-info')
        };
    },

    // Show players screen
    showPlayersScreen() {
        this.elements.playersScreen.classList.add('active');
        this.elements.settingsScreen.classList.remove('active');
        this.elements.gameScreen.classList.remove('active');
    },

    // Show settings screen
    showSettingsScreen() {
        this.elements.playersScreen.classList.remove('active');
        this.elements.settingsScreen.classList.add('active');
        this.elements.gameScreen.classList.remove('active');
        this.updatePlayerNamesDisplay();
    },

    // Update player names display in settings screen
    updatePlayerNamesDisplay() {
        const playerNames = this.getPlayerNames();
        const display = document.getElementById('player-names-display');
        
        display.innerHTML = '';
        playerNames.forEach(name => {
            const tag = document.createElement('span');
            tag.className = 'player-tag';
            tag.textContent = name;
            display.appendChild(tag);
        });
    },

    // Show game screen
    showGameScreen() {
        this.elements.playersScreen.classList.remove('active');
        this.elements.settingsScreen.classList.remove('active');
        this.elements.gameScreen.classList.add('active');
    },

    // Add a new player input field
    addPlayerInput() {
        const playerCount = this.elements.playerInputs.children.length;
        
        const newPlayer = document.createElement('div');
        newPlayer.className = 'player-setup';
        
        // Only add remove button for player 3 and onwards (index 2+)
        const removeButton = playerCount >= 2 ? 
            `<button class="remove-player" onclick="removePlayer(${playerCount})">✕</button>` : '';
        
        newPlayer.innerHTML = `
            <div class="player-header">
                <h3>Player ${playerCount + 1}</h3>
                ${removeButton}
            </div>
            <input type="text" placeholder="Enter name" class="player-name" data-player="${playerCount}">
        `;
        
        this.elements.playerInputs.appendChild(newPlayer);
    },

    // Remove a player input field
    removePlayerInput(index) {
        const players = this.elements.playerInputs.children;
        if (players.length <= 2) {
            alert('You need at least 2 players!');
            return;
        }
        
        players[index].remove();
        this.updatePlayerNumbers();
    },

    // Update player numbers after removal
    updatePlayerNumbers() {
        const players = this.elements.playerInputs.children;
        for (let i = 0; i < players.length; i++) {
            const header = players[i].querySelector('h3');
            const input = players[i].querySelector('.player-name');
            const removeButton = players[i].querySelector('.remove-player');
            
            header.textContent = `Player ${i + 1}`;
            input.setAttribute('data-player', i);
            
            if (removeButton) {
                removeButton.setAttribute('onclick', `removePlayer(${i})`);
            }
        }
    },

    // Store game settings for next game
    storeGameSettings(playerNames, startingNumber, randomizeOrder) {
        this.lastGameSettings = {
            playerNames: [...playerNames],
            startingNumber: startingNumber,
            randomizeOrder: randomizeOrder
        };
    },

    // Restore game settings from previous game
    restoreGameSettings() {
        if (!this.lastGameSettings) return;
        
        const { playerNames, startingNumber, randomizeOrder } = this.lastGameSettings;
        
        // Restore starting number and randomize order
        this.elements.startingNumber.value = startingNumber;
        this.elements.randomizeOrder.checked = randomizeOrder;
        
        // Restore player names and count
        const currentPlayers = this.elements.playerInputs.children;
        
        // Add/remove players to match previous count
        while (currentPlayers.length < playerNames.length) {
            this.addPlayerInput();
        }
        while (currentPlayers.length > playerNames.length && currentPlayers.length > 2) {
            this.elements.playerInputs.removeChild(this.elements.playerInputs.lastChild);
        }
        
        // Set player names
        const nameInputs = document.querySelectorAll('.player-name');
        nameInputs.forEach((input, index) => {
            if (index < playerNames.length) {
                input.value = playerNames[index];
            }
        });
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
        
        // Wait for explosion animation to complete before hiding bomb container
        setTimeout(() => {
            const bombContainer = document.querySelector('.bomb-container');
            bombContainer.style.display = 'none';
            
            // Show game over elements immediately after hiding bomb container
            this.elements.gameOver.classList.add('active');
            this.elements.gameOverText.classList.add('active');
        }, 1000);
    },

    // Reset UI to initial state
    resetUI() {
        // Reset body classes
        document.body.className = '';
        
        // Show players screen
        this.showPlayersScreen();
        this.elements.gameOver.classList.remove('active');
        this.elements.gameOverText.classList.remove('active');
        
        // Show hidden elements
        this.elements.rollButton.style.display = '';
        this.elements.playerInfo.style.display = '';
        this.elements.bomb.style.display = '';
        
        // Show bomb container
        const bombContainer = document.querySelector('.bomb-container');
        bombContainer.style.display = '';
        
        // Remove explosion if it exists
        const explosion = document.querySelector('.explosion');
        if (explosion) {
            explosion.remove();
        }
        
        // Restore previous game settings instead of clearing
        this.restoreGameSettings();
    }
};