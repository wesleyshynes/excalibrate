import { Actor, Animation, AnimationStrategy, Collider, CollisionContact, CollisionType, Color, Engine, Side, SpriteSheet, vec } from "excalibur";
import { Player } from "./player";
import { Resources } from "../resources";
import { EnemySensor } from "./enemySensor";

export class Enemy extends Actor {
    engineRef: Engine | undefined;

    health: number = 100;
    enemyLabel: string = '';

    lastDirection = 'down';
    lastXDirection = 0
    lastYDirection = 1

    enemySensor: EnemySensor | undefined;

    followTarget: Player | null = null;
    followRange: number = 300; // Distance within which the enemy will start following the player

    idleSprite: SpriteSheet | undefined;
    runSprite: SpriteSheet | undefined
    walkSprite: SpriteSheet | undefined;

    constructor(name: string = 'enemy', options?: {
        pos?: { x: number, y: number },
        color?: Color
    }) {
        super({
            pos: vec(options?.pos?.x || 300, options?.pos?.y || 200), // Starting position of the enemy
            radius: 8,
            color: options?.color || Color.Red,
            collisionType: CollisionType.Active,
            name: name
        });
    }

    onInitialize(engine: Engine): void {
        // Initialize enemy specific properties or animations here
        this.engineRef = engine;

        this.enemySensor = new EnemySensor(this);
        this.addChild(this.enemySensor);
        this.enemySensor.pos = vec(0, 0);

        this.setupGraphics();
    }

    onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {

        if (self.owner instanceof Enemy && other.owner instanceof Player) {
            const playerLastSpeed = (other.owner as Player).lastSpeed;
            self.owner.setVelocity(playerLastSpeed.x, playerLastSpeed.y);
            if (other.owner.updatePlayerLabel) {
                other.owner.updatePlayerLabel('Ouch!');
                // gameData.updateHealth(-10);
                other.owner.takeDamage(10);
            }
        }

    }

    setVelocity(x: number, y: number) {
        this.vel.x = x;
        this.vel.y = y;
    }

    takeDamage(amount: number) {
        this.health -= amount;

        const redTint = Color.fromHex('#FF000050');

        if (this.idleSprite) {
            this.idleSprite.sprites.forEach(sprite => {
                sprite.tint = redTint;
            });
        }
        if (this.runSprite) {
            this.runSprite.sprites.forEach(sprite => {
                sprite.tint = redTint;
            });
        }
        if (this.walkSprite) {
            this.walkSprite.sprites.forEach(sprite => {
                sprite.tint = redTint;
            });
        }

        setTimeout(() => {
            if (this.idleSprite) {
                this.idleSprite.sprites.forEach(sprite => {
                    sprite.tint = Color.White;
                });
            }
            if (this.runSprite) {
                this.runSprite.sprites.forEach(sprite => {
                    sprite.tint = Color.White;
                });
            }
            if (this.walkSprite) {
                this.walkSprite.sprites.forEach(sprite => {
                    sprite.tint = Color.White;
                });
            }
        }, 200);

        if (this.health <= 0) {
            this.kill();
        }
    }

    reset() {
        this.health = 100;
    }

    onPostUpdate(engine: Engine, delta: number): void {
        let maxVelocity = 100;

        let moveX = 0;
        let moveY = 0;

        const speedDelta = 80 * delta / 1000;

        let xDirection = '';
        let yDirection = '';

        if (this.followTarget) {
            const targetX = this.followTarget.pos.x;
            const targetY = this.followTarget.pos.y;
            const distanceToTarget = this.pos.distance(this.followTarget.pos);
            if (distanceToTarget < this.followRange) {
                // Move towards the player
                if (Math.abs(targetX - this.pos.x) > 1) {
                    moveX = targetX > this.pos.x ? 1 : -1;
                    // Update animation key based on movement direction
                    xDirection = moveX === 1 ? 'right' : 'left';
                    this.vel.x += moveX * speedDelta; // Accelerate towards the player
                }
                if (Math.abs(targetY - this.pos.y) > 1) {
                    moveY = targetY > this.pos.y ? 1 : -1;
                    yDirection = moveY === 1 ? 'down' : 'up';
                    this.vel.y += moveY * speedDelta; // Accelerate towards the player
                }

            } else {
                this.followTarget = null; // Stop following if out of range
            }
        }

        if (moveX !== 0) {
            this.lastXDirection = moveX;
        }
        if (moveY !== 0) {
            this.lastYDirection = moveY;
        }

        // Limit the maximum velocity
        const absoluteVelocity = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);
        if (absoluteVelocity > maxVelocity) {
            const scale = maxVelocity / absoluteVelocity;
            this.vel.x *= scale;
            this.vel.y *= scale;
        }

        let animationStringBase = 'idle';
        if (absoluteVelocity > 80) {
            animationStringBase = 'run';
        } else if (absoluteVelocity > 2) {
            animationStringBase = 'walk';
        }

        let animationDirection = '';
        if (xDirection) {
            animationDirection = xDirection;
        }
        if (yDirection) {
            // animationDirection = animationDirection ? (animationDirection + '-' + yDirection) : yDirection;
            // if the y speed is greater than the x speed then use the y direction
            if (Math.abs(this.vel.y) > Math.abs(this.vel.x)) {
                animationDirection = yDirection;
            }
        }

        if (animationDirection) {
            // If there is a direction change, use the new direction
            this.lastDirection = animationDirection;
            this.lastXDirection = xDirection === 'left' ? -1 : (xDirection === 'right' ? 1 : 0);
            this.lastYDirection = yDirection === 'up' ? -1 : (yDirection === 'down' ? 1 : 0);
        }

        const animationToUse = animationStringBase + '-' + this.lastDirection;
        this.graphics.use(animationToUse);
        // Apply friction to gradually slow down the enemy
        if (moveX === 0) {
            this.vel.x *= 0.9;
        }
        if (moveY === 0) {
            this.vel.y *= 0.9;
        }
    }

    setupGraphics() {
        const animationSpeed = 60

        this.idleSprite = SpriteSheet.fromImageSource({
            image: Resources.SlimeIdle,
            grid: {
                rows: 4,
                columns: 6,
                spriteWidth: 64,
                spriteHeight: 64,
            },
        })
        const idleAnimationDown = Animation.fromSpriteSheet(
            this.idleSprite,
            [0, 1, 2, 3, 4, 5], // All frames in order
            animationSpeed, // Frame duration in milliseconds
            AnimationStrategy.Loop
        );
        const idleAnimationRight = Animation.fromSpriteSheet(
            this.idleSprite,
            [6, 7, 8, 9, 10, 11], // All frames in order
            animationSpeed, // Frame duration in milliseconds
            AnimationStrategy.Loop
        );
        const idleAnimationLeft = Animation.fromSpriteSheet(
            this.idleSprite,
            [12, 13, 14, 15, 16, 17], // All frames in order
            animationSpeed, // Frame duration in milliseconds
            AnimationStrategy.Loop
        );
        const idleAnimationUp = Animation.fromSpriteSheet(
            this.idleSprite,
            [18, 19, 20, 21, 22, 23], // All frames in order
            animationSpeed, // Frame duration in milliseconds
            AnimationStrategy.Loop
        );

        this.graphics.add('idle-down', idleAnimationDown);
        this.graphics.add('idle-left', idleAnimationLeft);
        this.graphics.add('idle-right', idleAnimationRight);
        this.graphics.add('idle-up', idleAnimationUp);

        this.graphics.use(idleAnimationDown);

        idleAnimationDown.reset();
        idleAnimationLeft.reset();
        idleAnimationRight.reset();
        idleAnimationUp.reset();

        this.runSprite = SpriteSheet.fromImageSource({
            image: Resources.SlimeRun,
            grid: {
                rows: 4,
                columns: 8,
                spriteWidth: 64,
                spriteHeight: 64,
            },
        })

        const runAnimationDown = Animation.fromSpriteSheet(
            this.runSprite,
            [0, 1, 2, 3, 4, 5, 6, 7], // All frames in order
            animationSpeed, // Frame duration in milliseconds
            AnimationStrategy.Loop
        );
        const runAnimationUp = Animation.fromSpriteSheet(
            this.runSprite,
            [8, 9, 10, 11, 12, 13, 14, 15], // All frames in order
            animationSpeed, // Frame duration in milliseconds
            AnimationStrategy.Loop
        );
        const runAnimationLeft = Animation.fromSpriteSheet(
            this.runSprite,
            [16, 17, 18, 19, 20, 21, 22, 23], // All frames in order
            animationSpeed, // Frame duration in milliseconds
            AnimationStrategy.Loop
        );
        const runAnimationRight = Animation.fromSpriteSheet(
            this.runSprite,
            [24, 25, 26, 27, 28, 29, 30, 31], // All frames in order
            animationSpeed, // Frame duration in milliseconds
            AnimationStrategy.Loop
        );

        this.graphics.add('run-down', runAnimationDown);
        this.graphics.add('run-left', runAnimationLeft);
        this.graphics.add('run-right', runAnimationRight);
        this.graphics.add('run-up', runAnimationUp);

        runAnimationDown.reset();
        runAnimationLeft.reset();
        runAnimationRight.reset();
        runAnimationUp.reset();

        this.walkSprite = SpriteSheet.fromImageSource({
            image: Resources.SlimeWalk,
            grid: {
                rows: 4,
                columns: 8,
                spriteWidth: 64,
                spriteHeight: 64,
            },
        })

        const walkAnimationDown = Animation.fromSpriteSheet(
            this.walkSprite,
            [0, 1, 2, 3, 4, 5, 6, 7], // All frames in order
            animationSpeed, // Frame duration in milliseconds
            AnimationStrategy.Loop
        );
        const walkAnimationUp = Animation.fromSpriteSheet(
            this.walkSprite,
            [8, 9, 10, 11, 12, 13, 14, 15], // All frames in order
            animationSpeed, // Frame duration in milliseconds
            AnimationStrategy.Loop
        );
        const walkAnimationLeft = Animation.fromSpriteSheet(
            this.walkSprite,
            [16, 17, 18, 19, 20, 21, 22, 23], // All frames in order
            animationSpeed, // Frame duration in milliseconds
            AnimationStrategy.Loop
        );
        const walkAnimationRight = Animation.fromSpriteSheet(
            this.walkSprite,
            [24, 25, 26, 27, 28, 29, 30, 31], // All frames in order
            animationSpeed, // Frame duration in milliseconds
            AnimationStrategy.Loop
        );

        this.graphics.add('walk-down', walkAnimationDown);
        this.graphics.add('walk-left', walkAnimationLeft);
        this.graphics.add('walk-right', walkAnimationRight);
        this.graphics.add('walk-up', walkAnimationUp);

        walkAnimationDown.reset();
        walkAnimationLeft.reset();
        walkAnimationRight.reset();
        walkAnimationUp.reset();
    }
}