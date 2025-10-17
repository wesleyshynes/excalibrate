import { Color, Engine, Scene, SceneActivationContext, vec } from "excalibur";
import { Player } from "../entities/player";
import { Wall } from "../entities/wall";
import { Enemy } from "../entities/enemy";
import { Door } from "../entities/door";
import { PlayerHUD } from "../player-hud";
import { gameData } from "../game-data";

const gameWidth = 800;
const gameHeight = 600;

export class Level2 extends Scene {

    player = new Player('player1')

    playerHUD = new PlayerHUD();

    walls = [
        new Wall(gameWidth / 2, 10, gameWidth, 20),    // Top wall
        new Wall(gameWidth / 2, gameHeight - 10, gameWidth, 20), // Bottom wall
        new Wall(10, gameHeight / 2, 20, gameHeight),   // Left wall
        new Wall(gameWidth - 10, gameHeight / 2, 20, gameHeight) // Right wall
    ]

    enemy = new Enemy('enemy1', {
        pos: { x: 600, y: 300 }
    })

    exitDoor = new Door(50, gameHeight / 2, 40, 80, Color.Black, 'Level')

    activationTime: number = 0;


    onInitialize(engine: Engine): void {
        this.walls.forEach(wall => this.add(wall));
        this.add(this.player);
        this.add(this.enemy);
        this.add(this.exitDoor);
        this.add(this.playerHUD);
        engine.currentScene.camera.strategy.lockToActor(this.player);

        this.activationTime = Date.now();
    }

    onActivate(context: SceneActivationContext<any>): void {
        if (this.activationTime <= gameData.lastGameStart + 100) {
            this.enemy.reset();
            this.enemy.pos = vec(600, 300);
            this.add(this.enemy);
        }
        // Reset player position when the level is activated
        this.player.vel = vec(0, 0);
        this.player.pos = vec(
            this.exitDoor.pos.x + 60,
            gameHeight / 2);
    }
}