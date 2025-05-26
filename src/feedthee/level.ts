import { Engine, Scene } from "excalibur";
import { Player } from "./player";

export class Level extends Scene {

    player = new Player()
        
    onInitialize(engine: Engine): void {
        this.add(this.player);
    }
}