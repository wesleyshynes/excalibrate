// pipe.ts
import * as ex from 'excalibur';
import { Resources } from './resources';

export class Pipe extends ex.Actor {
    constructor(pos: ex.Vector, public type: 'top' | 'bottom') {
        super({
            pos,
            width: 32,
            height: 1000,
            anchor: type === 'bottom' ?
                ex.vec(0, 0) : // bottom anchor from top left
                ex.vec(0, 1), // top anchor from the bottom left
            color: ex.Color.Green,
            vel: ex.vec(-200, 0),
            z: -1 // position the pipe under everything
        })

        this.on('exitviewport', () => this.kill());
    }

    override onInitialize(): void {
        const pipeEnd = Resources.PipeImage.toSprite();
        // Stretch the pipe sprite
        // by default ImageSource use clamp which re-uses the border pixels 
        // when sourceView is larger than the original image
        pipeEnd.sourceView.height = 1000;
        // 
        pipeEnd.destSize.height = 1000;
        // Flip the pipe sprite
        if (this.type === 'top') {
            pipeEnd.flipVertical = true;
        }
        this.graphics.use(pipeEnd);
    }
}