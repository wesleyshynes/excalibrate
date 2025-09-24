import {
    Actor,
    Animation,
    Collider,
    CollisionContact,
    CollisionType,
    Color,
    Engine,
    Font,
    Keys,
    Label,
    Side,
    SpriteSheet,
    TextAlign,
    vec,
} from "excalibur";
import { Resources } from "./resources";
import { Weapon } from "./weapon";

export class Player extends Actor {

    lastSpeed = vec(0, 0);
    lastDirection = 'down';
    lastXDirection = 0
    lastYDirection = 1

    playerLabel: Label | undefined;

    engineRef: Engine | undefined;

    weapon: Weapon | undefined;

    constructor(name: string = 'player') {
        super({
            pos: vec(100, 100), // Starting position of the player
            width: 16,
            height: 16,
            color: Color.Yellow,
            collisionType: CollisionType.Active,
            name: name
        });
    }

    onInitialize(engine: Engine): void {
        // Initialize player specific properties or animations here
        this.engineRef = engine;
        console.log(this)

        const playerLabel = new Label({
            text: 'Player',
            pos: vec(0, -20),
            color: Color.Black,
            z: 1,
            font: new Font({
                size: 10,
                family: 'Arial',
                textAlign: TextAlign.Center,
                color: Color.Black
            })
        });
        this.playerLabel = playerLabel;
        this.updatePlayerLabel('Player');
        this.addChild(playerLabel);

        this.weapon = new Weapon(this, { x: 0, y: 0 });

        this.setupGraphics();
    }

    updatePlayerLabel(text: string) {
        if (this.playerLabel) {
            this.playerLabel.text = text;

            // Remove the label text after a short time
            this.engineRef?.clock.schedule(() => {
                if (this.playerLabel) {
                    this.playerLabel.text = 'Player';
                }
            }, 60);
        }
    }

    onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
        // Handle collision start events here
    }

    onCollisionEnd(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
        // Handle collision end events here
    }

    onPostUpdate(engine: Engine) {

        let moveX = false
        let moveY = false

        const accelerationIncrement = 5;

        let xDirection = ''
        let yDirection = ''

        if (
            engine.input.keyboard.isHeld(Keys.W) ||
            engine.input.keyboard.isHeld(Keys.Up)
        ) {
            this.vel.y += -accelerationIncrement; // Move up
            moveY = true;
            yDirection = 'up'
        }

        if (
            engine.input.keyboard.isHeld(Keys.S) ||
            engine.input.keyboard.isHeld(Keys.Down)
        ) {
            this.vel.y += accelerationIncrement; // Move down
            moveY = true;
            yDirection = 'down'
        }

        if (
            engine.input.keyboard.isHeld(Keys.A) ||
            engine.input.keyboard.isHeld(Keys.Left)
        ) {
            this.vel.x += -accelerationIncrement; // Move left
            moveX = true;
            xDirection = 'left'
            this.graphics.flipHorizontal = false;
        }

        if (
            engine.input.keyboard.isHeld(Keys.D) ||
            engine.input.keyboard.isHeld(Keys.Right)
        ) {
            this.vel.x += accelerationIncrement; // Move right
            moveX = true;
            xDirection = 'right'
            this.graphics.flipHorizontal = true;
        }

        let maxVelocity = 400;
        // const maxSpeed = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);

        // if holding shift cap the max speed
        if (engine.input.keyboard.isHeld(Keys.ShiftRight) || engine.input.keyboard.isHeld(Keys.ShiftLeft)) {
            maxVelocity = 200;
        }

        const absoluteVelocity = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);
        if (absoluteVelocity > maxVelocity) {
            const scale = maxVelocity / absoluteVelocity;
            this.vel.x *= scale;
            this.vel.y *= scale; // Scale down the velocity to maxVelocity
        }

        let animationStringBase = 'idle';
        if (absoluteVelocity > 220) {
            animationStringBase = 'run';
        } else if (absoluteVelocity > 20) {
            animationStringBase = 'walk';
        } else {
            animationStringBase = 'idle';
        }

        let animationDirection = '';
        if (xDirection) {
            animationDirection = xDirection;
        }
        if (yDirection) {
            animationDirection = animationDirection ? (animationDirection + '-' + yDirection) : yDirection;
        }

        if (animationDirection) {
            // If there is a direction change, use the new direction
            this.lastDirection = animationDirection;
            this.lastXDirection = xDirection === 'left' ? -1 : (xDirection === 'right' ? 1 : 0);
            this.lastYDirection = yDirection === 'up' ? -1 : (yDirection === 'down' ? 1 : 0);
        }

        const animationToUse = animationStringBase + '-' + this.lastDirection;
        this.graphics.use(animationToUse);

        if (this.weapon) {
            if (engine.input.keyboard.wasPressed(Keys.Space)) {
                const weaponXDir = this.lastXDirection;
                const weaponYDir = this.lastYDirection;
                // console.log(`Attacking with direction x:${weaponXDir}, y:${weaponYDir}`);
                this.weapon.attack({ x: weaponXDir, y: weaponYDir });
            }
        }

        this.updatePlayerLabel(Math.floor(absoluteVelocity) + ' px/s');

        // this.vel.x = clamp(this.vel.x, -400, 400); // Limit horizontal speed
        // this.vel.y = clamp(this.vel.y, -400, 400); // Limit vertical speed

        if (moveY === false) {
            this.vel.y *= 0.9; // Stop moving if no button is pressed
        }
        if (moveX === false) {
            this.vel.x *= 0.9; // Stop moving if no button is pressed
        }

        this.lastSpeed = vec(this.vel.x, this.vel.y);
    }


    setupGraphics() {
        const animationSpeed = 60

        // IDLE ANIMATIONS
        const idleSpriteSheet = SpriteSheet.fromImageSource({
            image: Resources.PlayerIdle,
            grid: {
                rows: 5,
                columns: 4,
                spriteWidth: 16,
                spriteHeight: 16,
            },

        });

        const idleAnimationDown = Animation.fromSpriteSheet(
            idleSpriteSheet,
            [0, 1, 2, 3], // All frames in order
            animationSpeed // Frame duration in milliseconds
        );
        this.graphics.add('idle-down', idleAnimationDown);
        this.graphics.use('idle-down');

        const idleAnimationRightDown = Animation.fromSpriteSheet(
            idleSpriteSheet,
            [4, 5, 6, 7], // All frames in order
            animationSpeed // Frame duration in milliseconds
        );
        this.graphics.add('idle-right-down', idleAnimationRightDown);
        this.graphics.add('idle-left-down', idleAnimationRightDown); // Use the same animation for left, will flip horizontally

        const idleAnimationRight = Animation.fromSpriteSheet(
            idleSpriteSheet,
            [8, 9, 10, 11], // All frames in order
            animationSpeed // Frame duration in milliseconds
        );
        this.graphics.add('idle-right', idleAnimationRight);
        this.graphics.add('idle-left', idleAnimationRight); // Use the same animation for left, will flip horizontally

        const idleAnimationRightUp = Animation.fromSpriteSheet(
            idleSpriteSheet,
            [12, 13, 14, 15], // All frames in order
            animationSpeed // Frame duration in milliseconds
        );
        this.graphics.add('idle-right-up', idleAnimationRightUp);
        this.graphics.add('idle-left-up', idleAnimationRightUp); // Use the same animation for left, will flip horizontally

        const idleAnimationUp = Animation.fromSpriteSheet(
            idleSpriteSheet,
            [16, 17, 18, 19], // All frames in order
            animationSpeed // Frame duration in milliseconds
        );
        this.graphics.add('idle-up', idleAnimationUp);

        // WALK ANIMATIONS
        const walkSpriteSheet = SpriteSheet.fromImageSource({
            image: Resources.PlayerWalk,
            grid: {
                rows: 5,
                columns: 4,
                spriteWidth: 20,
                spriteHeight: 19,
            },

        });
        const walkAnimationDown = Animation.fromSpriteSheet(
            walkSpriteSheet,
            [0, 1, 2, 3], // All frames in order
            animationSpeed // Frame duration in milliseconds
        );
        this.graphics.add('walk-down', walkAnimationDown);

        const walkAnimationRightDown = Animation.fromSpriteSheet(
            walkSpriteSheet,
            [4, 5, 6, 7], // All frames in order
            animationSpeed // Frame duration in milliseconds
        );
        this.graphics.add('walk-right-down', walkAnimationRightDown);
        this.graphics.add('walk-left-down', walkAnimationRightDown); // Use the same animation for left, will flip horizontally

        const walkAnimationRight = Animation.fromSpriteSheet(
            walkSpriteSheet,
            [8, 9, 10, 11], // All frames in order
            animationSpeed // Frame duration in milliseconds
        );
        this.graphics.add('walk-right', walkAnimationRight);
        this.graphics.add('walk-left', walkAnimationRight); // Use the same animation for left, will flip horizontally

        const walkAnimationRightUp = Animation.fromSpriteSheet(
            walkSpriteSheet,
            [12, 13, 14, 15], // All frames in order
            animationSpeed // Frame duration in milliseconds
        );
        this.graphics.add('walk-right-up', walkAnimationRightUp);
        this.graphics.add('walk-left-up', walkAnimationRightUp); // Use the same animation for left, will flip horizontally

        const walkAnimationUp = Animation.fromSpriteSheet(
            walkSpriteSheet,
            [16, 17, 18, 19], // All frames in order
            animationSpeed // Frame duration in milliseconds
        );
        this.graphics.add('walk-up', walkAnimationUp);

        // RUN ANIMATIONS
        const runSpriteSheet = SpriteSheet.fromImageSource({
            image: Resources.PlayerRun,
            grid: {
                rows: 5,
                columns: 6,
                spriteWidth: 20,
                spriteHeight: 20,
            },
        });
        const runAnimationDown = Animation.fromSpriteSheet(
            runSpriteSheet,
            [0, 1, 2, 3, 4, 5], // All frames in order
            animationSpeed // Frame duration in milliseconds
        );
        this.graphics.add('run-down', runAnimationDown);

        const runAnimationRightDown = Animation.fromSpriteSheet(
            runSpriteSheet,
            [6, 7, 8, 9, 10, 11], // All frames in order
            animationSpeed // Frame duration in milliseconds
        );
        this.graphics.add('run-right-down', runAnimationRightDown);
        this.graphics.add('run-left-down', runAnimationRightDown); // Use the same animation for left, will flip horizontally

        const runAnimationRight = Animation.fromSpriteSheet(
            runSpriteSheet,
            [12, 13, 14, 15, 16, 17], // All frames in order
            animationSpeed // Frame duration in milliseconds
        );
        this.graphics.add('run-right', runAnimationRight);
        this.graphics.add('run-left', runAnimationRight); // Use the same animation for left, will flip horizontally

        const runAnimationRightUp = Animation.fromSpriteSheet(
            runSpriteSheet,
            [18, 19, 20, 21, 22, 23], // All frames in order
            animationSpeed // Frame duration in milliseconds
        );
        this.graphics.add('run-right-up', runAnimationRightUp);
        this.graphics.add('run-left-up', runAnimationRightUp); // Use the same animation for left, will flip horizontally

        const runAnimationUp = Animation.fromSpriteSheet(
            runSpriteSheet,
            [24, 25, 26, 27, 28, 29], // All frames in order
            animationSpeed // Frame duration in milliseconds
        );
        this.graphics.add('run-up', runAnimationUp);
    }

}