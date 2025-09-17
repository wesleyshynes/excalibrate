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
    Sprite,
    SpriteSheet,
    TextAlign,
    vec,
} from "excalibur";
import { Resources } from "./resources";

export class Player extends Actor {

    lastSpeed = vec(0, 0);

    playerLabel: Label | undefined;

    engineRef: Engine | undefined;

    // idleSprite!: Sprite;
    // walkSprite!: Sprite;
    // runSprite!: Sprite;

    // idleAnimation!: Animation;
    // walkAnimation!: Animation
    // runAnimation!: Animation

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

        const idleSpriteSheet = SpriteSheet.fromImageSource({
            image: Resources.PlayerIdle,
            grid: {
                rows: 5,
                columns: 4,
                spriteWidth: 16,
                spriteHeight: 16,
            },

        });
        const animationSpeed = 60

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

        const idleAnimationRight = Animation.fromSpriteSheet(
            idleSpriteSheet,
            [8, 9, 10, 11], // All frames in order
            animationSpeed // Frame duration in milliseconds
        );
        this.graphics.add('idle-right', idleAnimationRight);

        const idleAnimationRightUp = Animation.fromSpriteSheet(
            idleSpriteSheet,
            [12, 13, 14, 15], // All frames in order
            animationSpeed // Frame duration in milliseconds
        );
        this.graphics.add('idle-right-up', idleAnimationRightUp);

        const idleAnimationUp = Animation.fromSpriteSheet(
            idleSpriteSheet,
            [16, 17, 18, 19], // All frames in order
            animationSpeed // Frame duration in milliseconds
        );
        this.graphics.add('idle-up', idleAnimationUp);



    }

    updatePlayerLabel(text: string) {
        if (this.playerLabel) {
            this.playerLabel.text = text;

            // Remove the label text after a short time
            this.engineRef?.clock.schedule(() => {
                if (this.playerLabel) {
                    this.playerLabel.text = 'Player';
                }
            }, 300);
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

        if (
            engine.input.keyboard.isHeld(Keys.W) ||
            engine.input.keyboard.isHeld(Keys.Up)
        ) {
            this.vel.y += -10; // Move up
            moveY = true;
            this.graphics.use('idle-up');
        }

        if (
            engine.input.keyboard.isHeld(Keys.S) ||
            engine.input.keyboard.isHeld(Keys.Down)
        ) {
            this.vel.y += 10; // Move down
            moveY = true;
            this.graphics.use('idle-down');
        }

        if (
            engine.input.keyboard.isHeld(Keys.A) ||
            engine.input.keyboard.isHeld(Keys.Left)
        ) {
            this.vel.x += -10; // Move left
            moveX = true;
            this.graphics.use('idle-right');
            this.graphics.flipHorizontal = false;
        }

        if (
            engine.input.keyboard.isHeld(Keys.D) ||
            engine.input.keyboard.isHeld(Keys.Right)
        ) {
            this.vel.x += 10; // Move right
            moveX = true;
            this.graphics.use('idle-right');
            this.graphics.flipHorizontal = true;
        }

        let maxVelocity = 400;
        // const maxSpeed = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);

        const absoluteVelocity = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);
        if (absoluteVelocity > maxVelocity) {
            const scale = maxVelocity / absoluteVelocity;
            this.vel.x *= scale;
            this.vel.y *= scale; // Scale down the velocity to maxVelocity
        }

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

}