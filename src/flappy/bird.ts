// bird.ts
import * as ex from "excalibur";
import { Ground } from "./ground";
import { Pipe } from "./pipe";
import { Config } from "./config";
import { Level } from "./level";

export class Bird extends ex.Actor {

    jumping = false;
    playing = false;

    constructor(private level: Level) {
        super({
            pos: Config.BirdStartPos,
            // width: 16, // for now we'll use a box so we can see the rotation
            // height: 16, // later we'll use a circle collider
            radius: 8,
            color: ex.Color.Yellow
        })
    }

    override onInitialize(): void {
        this.acc = ex.vec(0, Config.BirdAcceleration); // pixels per second per second
    }

    start() {
        this.playing = true;
        this.pos = Config.BirdStartPos; // starting position
        this.acc = ex.vec(0, Config.BirdAcceleration); // pixels per second per second
    }
    reset() {
        this.pos = Config.BirdStartPos; // starting position
        this.stop();
    }
    stop() {
        this.playing = false;
        this.vel = ex.vec(0, 0);
        this.acc = ex.vec(0, 0);
    }

    override onCollisionStart(_self: ex.Collider, other: ex.Collider): void {
        if (other.owner instanceof Pipe ||
            other.owner instanceof Ground
        ) {
            this.level.triggerGameOver();
        }
    }

    private isInputActive(engine: ex.Engine) {
        // if the space bar or the first pointer was down
        return (engine.input.keyboard.isHeld(ex.Keys.Space) || engine.input.pointers.isDown(0))
    }

    override onPostUpdate(engine: ex.Engine): void {
        if (!this.playing) return;
        
        if (!this.jumping && this.isInputActive(engine)) {
            this.vel.y += Config.BirdJumpVelocity; // negative is UP
            this.jumping = true;
        }
        if (!this.isInputActive(engine)) {
            this.jumping = false;
        }
        // keep velocity from getting too big
        this.vel.y = ex.clamp(this.vel.y, Config.BirdMinVelocity, Config.BirdMaxVelocity);
        // The "speed" the bird will move relative to pipes
        this.rotation = ex.vec(200, this.vel.y).toAngle();
    }
}