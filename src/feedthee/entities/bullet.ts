import { Actor, CollisionType, Color, Engine, RotationType, vec } from "excalibur";
import { Gun } from "./gun";

export class Bullet extends Actor {

    _owner: Gun;

    live: boolean = false; 

    lastActiveTime: number = 0;

    lifeDuration: number = 2000; // milliseconds

    constructor(owner: Gun, position: { x: number, y: number } = { x: 0, y: 0 }) {
        console.log("Bullet constructor called");
        super({
            name: "Bullet",
            color: Color.Yellow,
            width: 4,
            height: 8,
            pos: vec(position.x, position.y),
            collisionType: CollisionType.Active,
        });
        this._owner = owner;
    }

    onFinish() {
        this.live = false;
        this._owner.bullets.push(this);
        this.kill();
    }

    shootBullet(position: { x: number, y: number }, velocity: { x: number, y: number }, rotation: number) {
        this.pos = vec(position.x, position.y);
        this.vel = vec(velocity.x, velocity.y);
        this.actions.rotateTo(rotation, 100, RotationType.ShortestPath);
        this.live = true;
        // Add any shooting effects or sounds here
        this.lastActiveTime =this._owner.engineRef?.clock.now() || 0;
    }

    onPostUpdate(engine: Engine, delta: number): void {
        if (this.live && engine.clock.now() - this.lastActiveTime > this.lifeDuration) {
            this.onFinish();
        }
    }

}