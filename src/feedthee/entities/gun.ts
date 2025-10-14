import { Actor, CollisionType, Color, RotationType, vec } from "excalibur";
import { rotationMatrixRad } from "../utilities/rotationStuff";


export class Gun extends Actor {
    _owner: Actor;

    engineRef: any = null;
    gunActive: boolean = false;
    initialized: boolean = false;

    bullet: Actor | null = null;
    bulletSpeed: number = 300
    currentAttackDirection: { x: number, y: number } = { x: 0, y: 1 };

    constructor(owner: Actor, offset: { x: number, y: number } = { x: 0, y: 0 }) {
        console.log("Gun constructor called");
        super({
            name: "Gun",
            color: Color.Red,
            width: 16,
            height: 16,
            pos: vec(offset.x, offset.y),
            collisionType: CollisionType.Passive,
        });
        this._owner = owner;
    }

    onInitialize(engine: any) {
        console.log("Gun initialized");
        this.engineRef = engine;

        this.bullet = new Actor({
            name: "Bullet",
            color: Color.Yellow,
            // radius: 4,
            width: 4,
            height: 8,
            pos: vec(this._owner.pos.x, this._owner.pos.y),
            collisionType: CollisionType.Active,
        });

        // put animation and graphics here if needed

        this.initialized = true;

    }

    shoot(direction: { x: number, y: number }) {
        if (this.gunActive) {
            return; // Gun is already active, do not shoot again
        }
        this.gunActive = true;

        let bulletX = 0;
        let bulletY = 0;
        let bulletOffset = 20;
        let bulletRotation = 0;

        if (direction.x === 0 && direction.y === 0) {
            // nothing to see here
        } else {
            this.currentAttackDirection = direction;
            const targetAngle = rotationMatrixRad[direction.y + 1][direction.x + 1];
            let weaponOffset = 14
            if (Math.abs(direction.x) + Math.abs(direction.y) === 2) {
                weaponOffset = 10
                bulletOffset = 16
            }
            this.pos = vec(direction.x * weaponOffset, direction.y * weaponOffset);
            bulletX = direction.x * bulletOffset;
            bulletY = direction.y * bulletOffset;
            bulletRotation = targetAngle
            if (this.rotation !== targetAngle) {
                this.actions.rotateTo(targetAngle, 100, RotationType.ShortestPath);
            }
        }

        this._owner.addChild(this);
        if (!this.bullet) {
            console.error("Bullet actor is not initialized.");
            return;
        }
        this.bullet.pos = vec(
            this._owner.pos.x + bulletX, 
            this._owner.pos.y + bulletY
        );
        if (this.bullet.rotation !== bulletRotation) {
            this.bullet.actions.rotateTo(bulletRotation, 100, RotationType.ShortestPath);
        }
        this.engineRef.currentScene.add(this.bullet);
        this.bullet.vel.x = this.currentAttackDirection.x * this.bulletSpeed;
        this.bullet.vel.y = this.currentAttackDirection.y * this.bulletSpeed;

        // Schedule to reset gunActive after 500 milliseconds
        if (this.initialized && this.engineRef) {
            this.engineRef?.clock.schedule(() => {
                this.gunActive = false;
                this._owner.removeChild(this);
                if (!this.bullet) {
                    console.error("Bullet actor is not initialized.");
                    return;
                }
                this.engineRef.currentScene.remove(this.bullet);
            }, 500);
        }
    }
    
}