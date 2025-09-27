import { Actor, Collider, CollisionContact, CollisionType, Engine, Side, vec } from "excalibur";
import { Enemy } from "./enemy";
import { Player } from "./player";

export class EnemySensor extends Actor {

    _owner: Actor;

    constructor(owner: Actor) {
        super({
            pos: vec(0, 0),
            radius: 100,
            collisionType: CollisionType.Passive
        });
        this._owner = owner;
    }


    onInitialize(engine: Engine): void {
        // Initialize sensor specific properties or behaviors here
    }

    onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
        // Handle collision start events here
        if (this._owner && this._owner instanceof Enemy && other.owner instanceof Player) {
            console.log("EnemySensor detected Player");
            this._owner.followTarget = other.owner;
        }
    }
    onPostUpdate(engine: Engine): void {
        // Update sensor position or check for player within range
    }
}