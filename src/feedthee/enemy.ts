import { Actor, Collider, CollisionContact, CollisionType, Color, Engine, Side, vec } from "excalibur";
import { Player } from "./player";

export class Enemy extends Actor {
    engineRef: Engine | undefined;

    constructor(name: string = 'enemy') {
        super({
            pos: vec(300, 200), // Starting position of the enemy
            width: 32,
            height: 32,
            color: Color.Red,
            collisionType: CollisionType.Active,
            name: name
        });
    }

    onInitialize(engine: Engine): void {
        // Initialize enemy specific properties or animations here
        this.engineRef = engine;
    }

    onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
        // Handle collision start events here
        if (other.owner instanceof Player && self.owner instanceof Enemy) {
            console.log('Enemy collided with player!');
            // Simple knockback effect
            console.log(contact.normal)
            // this.vel.x += contact.normal.x * 500;
            // this.vel.y += contact.normal.y * 500;
            this.body.collisionType = CollisionType.PreventCollision
            // set a timer for 3 seconds and remove from game
            this.scheduleRemove();
        }
    }

    scheduleRemove() {
        console.log('Scheduling enemy removal in 3 seconds');
        this.engineRef?.clock.schedule(() => {
            console.log('Enemy removed after collision with player');
            this.kill();
        }, 3000);
    }

    setVelocity(x: number, y: number) {
        this.vel.x = x;
        this.vel.y = y;
    }

    onPostUpdate(engine: Engine) {
        // Simple AI to move towards the player could be implemented here
        // For now, the enemy will just move randomly

        // this.vel.x += (Math.random() - 0.5) * 50; // Random horizontal movement
        // this.vel.y += (Math.random() - 0.5) * 50; // Random vertical movement

        let maxVelocity = 600;

        const absoluteVelocity = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);
        if (absoluteVelocity > maxVelocity) {
            const scale = maxVelocity / absoluteVelocity;
            this.vel.x *= scale;
            this.vel.y *= scale;
        }

        // Apply friction to gradually slow down the enemy
        this.vel.x *= 0.9;
        this.vel.y *= 0.9;
    }
}