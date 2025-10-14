import { Actor, Collider, CollisionContact, CollisionType, Color, Engine, Side, vec } from "excalibur";
import { Player } from "./player";

export class Door extends Actor {

    nextLevel: string | undefined;
    engineRef: Engine | undefined;

    constructor(x: number, y: number, width: number, height: number, color?: Color, nextLevel?: string) {
        super({
            pos: vec(x, y),
            width,
            height,
            color: color || Color.Black,
            collisionType: CollisionType.Passive
        });
        this.nextLevel = nextLevel;
    }

    onInitialize(engine: Engine): void {
        // Initialize door specific properties or animations here
        this.engineRef = engine;
    }

    onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
        // Handle collision start events here

        if (self.owner instanceof Door && other.owner instanceof Player) {
            console.log('Player reached the door! Level Complete!');
            this.engineRef?.goToScene(this.nextLevel)
            // this.engineRef?.goToScene(this.nextLevel, {
            //     sceneActivationData: {
            //         playerStartX: 300,
            //         playerStartY: 300
            //     }
            // });
            // You can trigger level completion logic here
        }
    }
}