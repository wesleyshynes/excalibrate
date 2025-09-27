import { Actor, Animation, AnimationStrategy, Collider, CollisionContact, CollisionType, Color, Engine, Side, SpriteSheet, vec } from "excalibur";
import { Player } from "./player";
import { gameData } from "./game-data";
import { Weapon } from "./weapon";
import { Resources } from "./resources";
import { EnemySensor } from "./enemySensor";

export class Enemy extends Actor {
    engineRef: Engine | undefined;

    health: number = 100;
    enemyLabel: string = '';

    idleAnimation: Animation | undefined

    enemySensor: EnemySensor | undefined;

    followTarget: Player | null = null;
    followRange: number = 200; // Distance within which the enemy will start following the player

    constructor(name: string = 'enemy', options?: {
        pos?: { x: number, y: number },
        // width?: number,
        // height?: number,
        color?: Color
    }) {
        super({
            pos: vec(options?.pos?.x || 300, options?.pos?.y || 200), // Starting position of the enemy
            // width: options?.width || 28,
            // height: options?.height || 28,
            radius: 8,
            color: options?.color || Color.Red,
            collisionType: CollisionType.Active,
            name: name
        });
    }

    onInitialize(engine: Engine): void {
        // Initialize enemy specific properties or animations here
        this.engineRef = engine;

        const idleSprite = SpriteSheet.fromImageSource({
            image: Resources.SlimeIdle,
            grid: {
                rows: 4,
                columns: 6,
                spriteWidth: 64,
                spriteHeight: 64,
            },
            // spacing: {
            //     margin: {
            //         x: 8, y: 8
            //     }
            // }
        })
        this.idleAnimation = Animation.fromSpriteSheet(
            idleSprite,
            [0, 1, 2, 3, 4, 5], // All frames in order
            100, // Frame duration in milliseconds
            AnimationStrategy.Loop

        );
        this.graphics.add('idle', this.idleAnimation);
        this.graphics.use('idle');
        this.idleAnimation.reset();

        this.enemySensor = new EnemySensor(this);
        this.addChild(this.enemySensor);
        this.enemySensor.pos = vec(0, 0);
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
            self.owner.health -= 25;
            if (self.owner.health <= 0) {
                self.owner.kill()
            }
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
        // let maxVelocity = 600;
        let maxVelocity = 100;

        let moveX = 0;
        let moveY = 0;
        
        if (this.followTarget) {
            const targetX = this.followTarget.pos.x;
            const targetY = this.followTarget.pos.y;
            const distanceToTarget = this.pos.distance(this.followTarget.pos);
            if (distanceToTarget < this.followRange) {
                // Move towards the player
                if (Math.abs(targetX - this.pos.x) > 5) {
                    moveX = targetX > this.pos.x ? 1 : -1;
                    this.vel.x += moveX * 2; // Accelerate towards the player
                }
                if (Math.abs(targetY - this.pos.y) > 5) {
                    moveY = targetY > this.pos.y ? 1 : -1;
                    this.vel.y += moveY * 2; // Accelerate towards the player
                }
            } else {
                this.followTarget = null; // Stop following if out of range
            }
        }

        // Limit the maximum velocity
        const absoluteVelocity = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);
        if (absoluteVelocity > maxVelocity) {
            const scale = maxVelocity / absoluteVelocity;
            this.vel.x *= scale;
            this.vel.y *= scale;
        }
        // Apply friction to gradually slow down the enemy
        if (moveX === 0) {
            this.vel.x *= 0.9;
        }
        if (moveY === 0) {
            this.vel.y *= 0.9;
        }
    }
}