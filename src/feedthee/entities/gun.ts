import { Actor, CollisionType, Color, RotationType, vec } from "excalibur";
import { rotationMatrixRad } from "../utilities/rotationStuff";
import { Bullet } from "./bullet";


export class Gun extends Actor {
    _owner: Actor;

    engineRef: any = null;
    gunActive: boolean = false;
    initialized: boolean = false;

    // bullet: Bullet | null = null;
    maxLiveBullets: number = 3;
    shotCooldown: number = 200; // milliseconds
    bullets: Bullet[] = [];
    bulletSpeed: number = 300

    lastShotTime: number = 0;


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

        for (let i = 0; i < this.maxLiveBullets; i++) {
            const bullet = new Bullet(this);
            this.bullets.push(bullet);
        }

        // put animation and graphics here if needed

        this.initialized = true;

    }

    shoot(direction: { x: number, y: number }) {
        if (this.gunActive) {
            return; // Gun is already active, do not shoot again
        }
        if (this.bullets.length === 0) {
            console.error("No bullets available to shoot.");
            return;
        }
        this.gunActive = true;

        const bulletToShoot = this.bullets.shift();
        if (!bulletToShoot) {
            console.error("No bullet found to shoot.");
            this.gunActive = false;
            return;
        }

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

        bulletToShoot.shootBullet(
            { x: this._owner.pos.x + bulletX, y: this._owner.pos.y + bulletY },
            { x: this.currentAttackDirection.x, y: this.currentAttackDirection.y},
            bulletRotation
        )
        this.engineRef.currentScene.add(bulletToShoot);

        // Schedule to reset gunActive after 500 milliseconds
        if (this.initialized && this.engineRef) {
            this.engineRef?.clock.schedule(() => {
                this.gunActive = false;
                this._owner.removeChild(this);
            }, this.shotCooldown);
        }
    }
    
}