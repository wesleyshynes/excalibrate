import { Color, Engine, Scene, SceneActivationContext, vec } from "excalibur";
import { Player } from "./player";
import { Wall } from "./wall";
import { Enemy } from "./enemy";
import { Door } from "./door";

const gameWidth = 800;
const gameHeight = 600;

export class Level2 extends Scene {

    player = new Player('player1')

    walls = [
        new Wall(gameWidth / 2, 10, gameWidth, 20),    // Top wall
        new Wall(gameWidth / 2, gameHeight - 10, gameWidth, 20), // Bottom wall
        new Wall(10, gameHeight / 2, 20, gameHeight),   // Left wall
        new Wall(gameWidth - 10, gameHeight / 2, 20, gameHeight) // Right wall
    ]

    enemy = new Enemy('enemy1')

    exitDoor = new Door(50, gameHeight / 2, 40, 80, Color.Green, 'Level')


    onInitialize(engine: Engine): void {
        this.walls.forEach(wall => this.add(wall));
        this.add(this.player);
        this.add(this.enemy);
        this.add(this.exitDoor);
    }

    onActivate(context: SceneActivationContext<any>): void {
        // Reset player position when the level is activated
        this.player.vel = vec(0,0);
        this.player.pos = vec(
            this.exitDoor.pos.x + 60,
            gameHeight / 2);
    }
}