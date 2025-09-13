import { Color, Engine, Scene, SceneActivationContext, vec } from "excalibur";
import { Player } from "./player";
import { Wall } from "./wall";
import { Enemy } from "./enemy";
import { Door } from "./door";

const gameWidth = 800;
const gameHeight = 600;

export class Level extends Scene {

    player = new Player('player1')

    startingX = 100;
    firstActivation: boolean = false;

    walls = [
        new Wall(gameWidth / 2, 10, gameWidth, 20, Color.Cyan),    // Top wall
        new Wall(gameWidth / 2, gameHeight - 10, gameWidth, 20, Color.Cyan), // Bottom wall
        new Wall(10, gameHeight / 2, 20, gameHeight, Color.Cyan),   // Left wall
        new Wall(gameWidth - 10, gameHeight / 2, 20, gameHeight, Color.Cyan) // Right wall
    ]

    enemy = new Enemy('enemy1')

    exitDoor = new Door(gameWidth - 50, gameHeight / 2, 40, 80, Color.Black, 'Level2')

    onInitialize(engine: Engine): void {
        this.walls.forEach(wall => this.add(wall));
        this.add(this.player);
        this.add(this.enemy);
        this.add(this.exitDoor);
        this.exitDoor.engineRef = engine;

    }

    onActivate(context: SceneActivationContext<any>): void {
        // Reset player position when the level is activated
        this.player.vel = vec(0,0);
        this.player.pos = vec(
            this.firstActivation ? this.exitDoor.pos.x - 60 : this.startingX, 
            gameHeight / 2
        );
        this.firstActivation = true;
    }
}