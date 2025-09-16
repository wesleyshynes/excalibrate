import { Actor, Collider, CollisionContact, CollisionType, Color, Engine, Side, vec } from "excalibur";
import { Player } from "./player";
import { gameData } from "./game-data";

export class PickUp extends Actor {
    engineRef: Engine | undefined;

    constructor(name: string = 'pickup', options?: {
        pos?: { x: number, y: number },
        radius?: number,
        color?: Color
    }) {
        super({
            pos: vec(options?.pos?.x || 300, options?.pos?.y || 200), // Starting position of the pickup
            radius: options?.radius || 16,
            color: options?.color || Color.Orange,
            collisionType: CollisionType.Passive,
            name: name
        });
    }

    onInitialize(engine: Engine): void {
        // Initialize pickup specific properties or animations here
        this.engineRef = engine;
    }

    onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
        // Handle collision start events here
        if (self.owner instanceof PickUp && other.owner instanceof Player) {
            if (other.owner.updatePlayerLabel) {
                other.owner.updatePlayerLabel('Picked Up!');
            }
            self.owner.setVelocity(0, -1200);
            this.scheduleRemove();
            gameData.updateScore(10);
        }
    }

    scheduleRemove() {
        this.engineRef?.clock.schedule(() => {
            this.kill();
        }, 60);
    }

    setVelocity(x: number, y: number) {
        this.vel.x = x;
        this.vel.y = y;
    }

    onPostUpdate(engine: Engine) {
        let maxVelocity = 1200;
        const absoluteVelocity = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);
        if (absoluteVelocity > maxVelocity) {
            const scale = maxVelocity / absoluteVelocity;
            this.vel.x *= scale;
            this.vel.y *= scale;
        }
        // Apply friction to gradually slow down the pickup
        this.vel.x *= 0.9;
        this.vel.y *= 0.9;
    }
}