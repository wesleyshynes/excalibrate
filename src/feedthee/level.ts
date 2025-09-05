import { Engine, Scene } from "excalibur";
import { Player } from "./player";
import { Wall } from "./wall";

const gameWidth = 800;
const gameHeight = 600;

export class Level extends Scene {

    player = new Player()

    walls = [
        new Wall(gameWidth / 2, 10, gameWidth, 20),    // Top wall
        new Wall(gameWidth / 2, gameHeight - 10, gameWidth, 20), // Bottom wall
        new Wall(10, gameHeight / 2, 20, gameHeight),   // Left wall
        new Wall(gameWidth - 10, gameHeight / 2, 20, gameHeight) // Right wall
    ]
        
    onInitialize(engine: Engine): void {
        this.add(this.player);
        this.walls.forEach(wall => this.add(wall));
    }
}