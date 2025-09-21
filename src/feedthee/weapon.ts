import { Actor, CollisionType, Color, Engine, RotationType, vec } from "excalibur";


const rotationMatrix = [
    [315, 0, 45],
    [270, 0, 90],
    [225, 180, 135],
]

const rotationMatrixRad = rotationMatrix.map(row => row.map(deg => deg * (Math.PI / 180)));

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
            width: 30,
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
        if (direction.x === 0 && direction.y === 0) {
            // this.actions.rotateTo(Math.PI / 2, 100, RotationType.ShortestPath);
        } else {
            const targetAngle = rotationMatrixRad[direction.y + 1][direction.x + 1];
            this.pos = vec(direction.x * 20, direction.y * 20);
            if (this.rotation !== targetAngle) {
                this.actions.rotateTo(targetAngle, 100, RotationType.ShortestPath);
            }
        }
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