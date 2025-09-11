import { Actor, CollisionType, Color, vec } from "excalibur";

export class Wall extends Actor {
    constructor(x: number, y: number, width: number, height: number, color?: Color) {
        super({
            pos: vec(x, y),
            width,
            height,
            color: color || Color.Gray,
            collisionType: CollisionType.Fixed
        });
    }
}