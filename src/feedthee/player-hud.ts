import { Color, Font, Label, ScreenElement, vec } from "excalibur";
import { gameData } from "./game-data";

export class PlayerHUD extends ScreenElement {

    gameDataRef: any;

    scoreLabel: Label | undefined;    
    healthLabel: Label | undefined;

    constructor() {
        super({
            pos: vec(10, 10),
            width: 200,
            height: 50,
            color: Color.Black,
            opacity: 0.5,
            z: 1000 // Ensure HUD is on top
        });
    }

    onInitialize() {
        this.anchor = vec(0, 0);
        // Initialize HUD elements here, e.g., score, health bars
        this.gameDataRef = gameData;
        this.scoreLabel = new Label({
            text: `Score: ${this.gameDataRef.score}`,
            pos: vec(5, 5),
            color: Color.White,
            font: new Font({
                size: 16,
                family: "Arial",
            })
        });
        this.healthLabel = new Label({
            text: `Health: ${this.gameDataRef.health}`,
            pos: vec(5, 25),
            color: Color.White,
            font: new Font({
                size: 16,
                family: "Arial",
            })
        });
        this.addChild(this.scoreLabel);
        this.addChild(this.healthLabel);
    }

    onPostUpdate() {
        // Update HUD elements based on game state
        if (this.scoreLabel) {
            this.scoreLabel.text = `Score: ${this.gameDataRef.score}`;
        }
        if (this.healthLabel) {
            this.healthLabel.text = `Health: ${this.gameDataRef.health}`;
        }
    }

}