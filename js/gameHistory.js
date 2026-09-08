// Completed game history stored locally for this browser
const GameHistory = {
    storageKey: 'bombaaa.gameHistory.v1',

    load() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (!stored) return { version: 1, games: [] };

            const parsed = JSON.parse(stored);
            if (parsed.version !== 1 || !Array.isArray(parsed.games)) {
                return { version: 1, games: [] };
            }
            return parsed;
        } catch (error) {
            console.error('Unable to read game history:', error);
            return { version: 1, games: [] };
        }
    },

    save(history) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(history));
            return true;
        } catch (error) {
            console.error('Unable to save game history:', error);
            return false;
        }
    },

    recordCompletedGame({ players, loser, startingNumber, startedAt, sequence }) {
        const history = this.load();
        const completedAt = new Date().toISOString();
        const gameId = `${completedAt}-${Math.random().toString(36).slice(2, 10)}`;
        const losingRoll = sequence[sequence.length - 1];
        const loserIndex = losingRoll ? (losingRoll.turn - 1) % players.length : players.indexOf(loser);
        const winners = players.filter((name, index) => index !== loserIndex);

        history.games.unshift({
            gameId,
            startedAt,
            completedAt,
            players: [...players],
            winners,
            loser,
            startingNumber,
            sequence: sequence.map(roll => ({ ...roll }))
        });

        return this.save(history);
    },
    getGames() {
        return this.load().games;
    }
};
