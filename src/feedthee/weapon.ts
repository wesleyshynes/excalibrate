import { Actor, CollisionType, Color, Engine, RotationType, SpriteSheet, vec, Animation, AnimationStrategy } from "excalibur";
import { Resources } from "./resources";
import { rotationMatrixRad } from "./utilities/rotationStuff";


export class Weapon extends Actor {

    _owner: Actor;
    engineRef: Engine | null = null;
    weaponActive: boolean = false;
    initialized: boolean = false;
    slashAnimation: Animation | undefined;
    currentAttackDirection: { x: number, y: number } = { x: 0, y: 1 };

    constructor(owner: Actor, offset: { x: number, y: number } = { x: 0, y: 0 }) {
        console.log("Weapon constructor called");
        super({
            name: "Weapon",
            color: Color.Red,
            width: 16,
            height: 16,
            pos: vec(offset.x, offset.y),
            collisionType: CollisionType.Passive,
        });
        this._owner = owner;
    }

    onInitialize(engine: Engine) {
        console.log("Weapon initialized");
        this.engineRef = engine;

        const animationSpeed = 30; // Duration of each frame in milliseconds

        const slashSprite = SpriteSheet.fromImageSource({
            image: Resources.SlashSprite,
            grid: {
                rows: 5,
                columns: 2,
                spriteWidth: 16,
                spriteHeight: 16,
            }
        });

        this.slashAnimation = Animation.fromSpriteSheet(
            slashSprite,
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], // All frames in order
            animationSpeed, // Frame duration in milliseconds
            AnimationStrategy.Loop
        );
        this.graphics.add('slash', this.slashAnimation);
        this.graphics.use('slash');
        this.slashAnimation.reset();

        const closeAnimation = Animation.fromSpriteSheet(
            slashSprite,
            [9, 8, 7, 6, 5, 4, 3, 2, 1, 0], // All frames in reverse order
            animationSpeed,// Frame duration in milliseconds
            AnimationStrategy.Loop
        );
        this.graphics.add('close', closeAnimation);
        // this.graphics.use('slash');

        this.weaponActive = false;
        this.initialized = true;
    }

    attack(direction: { x: number, y: number }) {
        if (this.weaponActive) {
            return; // Prevent overlapping attacks
        }
        this.graphics.use('slash');
        this.slashAnimation?.reset();
        this.weaponActive = true;
        // Implement attack logic here
        // console.log(`${this._owner.name} attacks in direction: ${JSON.stringify(direction)}`);
        if (direction.x === 0 && direction.y === 0) {
            // this.actions.rotateTo(Math.PI / 2, 100, RotationType.ShortestPath);
        } else {
            this.currentAttackDirection = direction;
            const targetAngle = rotationMatrixRad[direction.y + 1][direction.x + 1];
            let weaponOffset = 14
            if (Math.abs(direction.x) + Math.abs(direction.y) === 2) {
                weaponOffset = 10
            }
            this.pos = vec(direction.x * weaponOffset, direction.y * weaponOffset);
            if (this.rotation !== targetAngle) {
                this.actions.rotateTo(targetAngle, 100, RotationType.ShortestPath);
            }
        }
        this._owner.addChild(this);
        if (this.initialized && this.engineRef) {
            this.engineRef.clock.schedule(() => {
                this.weaponActive = false;
                this.graphics.use('close');
                this._owner.removeChild(this);
            }, 300);
        }
    }

}