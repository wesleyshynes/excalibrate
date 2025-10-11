import { Color, Engine, Font, Keys, Label, Scene, TextAlign, vec } from "excalibur";
import { Button } from "./button";

export class TitleScreen extends Scene {
    titleLabel: Label | undefined;
    startLabel: Label | undefined;

    startButton: Button | undefined;
    optionsButton: Button | undefined;

    onInitialize(engine: Engine): void {
        this.titleLabel = new Label({
            text: "Feed Thee",
            color: Color.White,
            pos: vec(engine.drawWidth / 2, engine.drawHeight / 4),
            font: new Font({
                size: 48,
                family: "Arial",
                textAlign: TextAlign.Center
            })
        });
        this.add(this.titleLabel);

        this.startButton = new Button({
            text: "Start Game",
            pos: { x: engine.drawWidth / 2, y: engine.drawHeight / 2 - 30 },
            onClick: () => {
                engine.goToScene('Level');
            }
        });
        this.add(this.startButton);

        this.optionsButton = new Button({
            text: "Options",
            pos: { x: engine.drawWidth / 2, y: engine.drawHeight / 2 + 30 },
            onClick: () => {
                engine.goToScene('OptionsScreen');
            }
        });
        this.add(this.optionsButton);
    }

    onPostUpdate(engine: Engine, elapsed: number): void {
        if (engine.input.keyboard.wasPressed(Keys.Enter)) {
            engine.goToScene('Level');
        }
    }
}