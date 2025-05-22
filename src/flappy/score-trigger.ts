import * as ex from "excalibur";
import { Config } from "./config";
import { Level } from "./level";

// score-trigger.ts
export class ScoreTrigger extends ex.Actor {
    constructor(pos: ex.Vector, private level: Level) {
        super({
            pos,
            width: 32,
            height: Config.PipeGap,
            anchor: ex.vec(0, 0),
            vel: ex.vec(-Config.PipeSpeed, 0)
        })

        this.on('exitviewport', () => {
            this.kill();
        });
    }

    override onCollisionStart(): void {
        this.level.incrementScore();
    }
}