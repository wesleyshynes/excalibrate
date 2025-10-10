import { BaseAlign, Color, Engine, Font, Label, Rectangle, ScreenElement, TextAlign, vec } from "excalibur";

export class Button extends ScreenElement {

    onClick: () => void = () => { };

    buttonText: string = "Button";

    buttonLabel: Label | undefined;

    constructor({ text, pos, onClick }: { text: string; pos: { x: number; y: number }; onClick: () => void }) {
        super({
            pos: vec(pos.x, pos.y),
            width: 150,
            height: 50,
            color: Color.DarkGray,
            // z: 1000 // Ensure button is on top
        });
        this.buttonText = text;
        this.onClick = onClick;
        this.anchor = vec(0.5, 0.5);
    }


    onInitialize(engine: Engine): void {

        const rectangleIdleGraphic = new Rectangle({
            width: this.width,
            height: this.height,
            color: Color.DarkGray,
        })
        this.graphics.add('idle', rectangleIdleGraphic);
        this.graphics.use('idle');

        const rectangleHoverGraphic = new Rectangle({
            width: this.width,
            height: this.height,
            color: Color.Gray,
        })
        this.graphics.add('hover', rectangleHoverGraphic);

        this.buttonLabel = new Label({
            text: this.buttonText,
            // pos: vec(this.width / 2, this.height / 2),
            color: Color.White,
            font: new Font({
                size: 20,
                family: "Arial",
                textAlign: TextAlign.Center,
                baseAlign: BaseAlign.Middle
            })
        });
        this.addChild(this.buttonLabel);

        this.on('pointerup', (evt) => {
            this.onClick();
        });

        this.on('pointerenter', () => {
            this.graphics.use('hover')
            if (!this.buttonLabel) return;
            this.buttonLabel.text = `> ${this.buttonText} <`
        })
        this.on('pointerleave', () => {
            this.graphics.use('idle')
            if (!this.buttonLabel) return;
            this.buttonLabel.text = this.buttonText;
        })
    }
}