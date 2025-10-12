import { Color, Engine, Font, Keys, Label, Scene, TextAlign, vec } from "excalibur";
import { Button } from "../button";
import { gameData } from "../game-data";

export class OptionsScreen extends Scene {
    titleLabel: Label | undefined;
    fartToggleButton: Button | undefined;
    backButton: Button | undefined;

    onInitialize(engine: Engine): void {
        this.titleLabel = new Label({
            text: "Options",
            color: Color.White,
            pos: vec(engine.drawWidth / 2, engine.drawHeight / 4),
            font: new Font({
                size: 48,
                family: "Arial",
                textAlign: TextAlign.Center
            })
        });
        this.add(this.titleLabel);

        this.fartToggleButton = new Button({
            text: `Farts: ${gameData.farts ? 'ON' : 'OFF'}`,
            pos: { x: engine.drawWidth / 2, y: engine.drawHeight / 2 - 50 },
            onClick: () => {
                gameData.farts = !gameData.farts;
                if (this.fartToggleButton) {
                    this.fartToggleButton.buttonText = `Farts: ${gameData.farts ? 'ON' : 'OFF'}`;
                    // Update the button label text
                    if (this.fartToggleButton.buttonLabel) {
                        this.fartToggleButton.buttonLabel.text = this.fartToggleButton.buttonText;
                    }
                }
            }
        });
        this.add(this.fartToggleButton);

        this.backButton = new Button({
            text: "Back",
            pos: { x: engine.drawWidth / 2, y: engine.drawHeight / 2 + 50 },
            onClick: () => {
                engine.goToScene('TitleScreen');
            }
        });
        this.add(this.backButton);
    }

    onPostUpdate(engine: Engine, elapsed: number): void {
        if (engine.input.keyboard.wasPressed(Keys.Escape)) {
            engine.goToScene('TitleScreen');
        }
    }
}