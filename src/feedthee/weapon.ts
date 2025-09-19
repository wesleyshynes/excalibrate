import { Actor, CollisionType, Color, Engine, vec } from "excalibur";

export class Weapon extends Actor {

    _owner: Actor;
    engineRef: Engine | null = null;
    weaponActive: boolean = false;
    initialized: boolean = false;

    constructor(owner: Actor, offset: { x: number, y: number } = { x: 0, y: 0 }) {
        console.log("Weapon constructor called");
        super({
            name: "Weapon",
            color: Color.Red,
            width: 10,
            height: 10,
            pos: vec(offset.x, offset.y),
            collisionType: CollisionType.Passive,
        });
        this._owner = owner;
    }

    onInitialize(engine: Engine) {
        console.log("Weapon initialized");
        this.engineRef = engine;

        this.engineRef?.clock.schedule(() => {
            console.log("Removing weapon after initialization__INIT__");
            this.weaponActive = false;
            this._owner.removeChild(this);
        }, 300);
        this.initialized = true;
    }

    attack(direction: { x: number, y: number }) {
        console.log(this.initialized ? "Weapon already initialized" : "Weapon not initialized yet",
             this.weaponActive,
             this.engineRef ? "Engine reference available" : "No engine reference"
            );
        if (this.weaponActive) {
            console.log("Weapon is already active, attack ignored");
            return; // Prevent overlapping attacks
        }
        this.weaponActive = true;
        // Implement attack logic here
        console.log(`${this._owner.name} attacks in direction: ${JSON.stringify(direction)}`);
        this._owner.addChild(this);
        if (this.initialized && this.engineRef) {
            console.log("Scheduling weapon removal after attack");
            this.engineRef.clock.schedule(() => {
                console.log("Removing weapon after attack");
                this.weaponActive = false;
                this._owner.removeChild(this);
            }, 300);
        }
    }

}