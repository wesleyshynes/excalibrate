import { Actor, Collider, CollisionContact, CollisionType, Color, Engine, RotationType, Side, TileMap, vec } from "excalibur";
import { Gun } from "./gun";
import { Enemy } from "./enemy";

export class Bullet extends Actor {

    _owner: Gun;

    live: boolean = false;

    lastActiveTime: number = 0;

    lifeDuration: number = 2000; // milliseconds

    speed: number = 300;

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

    onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {

        console.log('Bullet collision detected');

        if (other.owner instanceof TileMap) {
            console.log('Bullet hit a wall or obstacle');
            this.onFinish();
        }

        if (self.owner instanceof Bullet && other.owner instanceof Enemy) {
            console.log('Weapon hit enemy');
            other.owner.setVelocity(self.owner.vel.x * 500, self.owner.vel.y * 500);
            other.owner.takeDamage(25);
            this.onFinish();
        }

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
        this.lastActiveTime = this._owner.engineRef?.clock.now() || 0;

        this.vel.x = this.speed * velocity.x;
        this.vel.y = this.speed * velocity.y;

         // Limit the maximum velocity
        const absoluteVelocity = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);
        if (absoluteVelocity > this.speed) {
            const scale = this.speed / absoluteVelocity;
            this.vel.x *= scale;
            this.vel.y *= scale;
        }
    }

    onPostUpdate(engine: Engine, delta: number): void {
        if (this.live && engine.clock.now() - this.lastActiveTime > this.lifeDuration) {
            this.onFinish();
        }
    }

}