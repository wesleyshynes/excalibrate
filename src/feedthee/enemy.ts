import { Actor, Collider, CollisionContact, CollisionType, Color, Engine, Side, vec } from "excalibur";
import { Player } from "./player";
import { gameData } from "./game-data";
import { Weapon } from "./weapon";

export class Enemy extends Actor {
    engineRef: Engine | undefined;

    constructor(name: string = 'enemy', options?: {
        pos?: { x: number, y: number },
        width?: number,
        height?: number,
        color?: Color
    }) {
        super({
            pos: vec(options?.pos?.x || 300, options?.pos?.y || 200), // Starting position of the enemy
            width: options?.width || 32,
            height: options?.height || 32,
            color: options?.color || Color.Red,
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
        if (self.owner instanceof Enemy && other.owner instanceof Player) {
            const playerLastSpeed = (other.owner as Player).lastSpeed;
            self.owner.setVelocity(playerLastSpeed.x, playerLastSpeed.y);
            if (other.owner.updatePlayerLabel) {
                other.owner.updatePlayerLabel('Ouch!');
                gameData.updateHealth(-10);
            }
        }

        if (self.owner instanceof Enemy && other.owner instanceof Weapon) {
            console.log('Enemy hit by weapon');
            // console.log(contact.normal, contact.tangent)
            // self.owner.setVelocity(-contact.normal.x * 500, -contact.normal.y * 500);
            const weaponAttackDIR = other.owner.currentAttackDirection;
            self.owner.setVelocity(weaponAttackDIR.x * 500, weaponAttackDIR.y * 500);
        }

    }

    scheduleRemove() {
        this.body.collisionType = CollisionType.PreventCollision
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
        let maxVelocity = 600;
        // Limit the maximum velocity
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