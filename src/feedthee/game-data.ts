class GameData {
    score: number = 0;
    health: number = 100;

    farts: boolean = true

    lastGameStart: number = Date.now()

    updateScore(amount: number) {
        this.score += amount;
    }
    
    updateHealth(amount: number) {
        this.health += amount;
        if (this.health < 0) {
            this.health = 0;
        } else if (this.health > 100) {
            this.health = 100;
        }
    }

    reset() {
        this.score = 0;
        this.health = 100;
        this.lastGameStart = Date.now();
    }
}

export const gameData = new GameData();