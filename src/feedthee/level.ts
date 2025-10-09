import { Color, Engine, Scene, SceneActivationContext, SpriteSheet, TileMap, vec } from "excalibur";
import { Player } from "./player";
import { Wall } from "./wall";
import { Enemy } from "./enemy";
import { Door } from "./door";
import { PickUp } from "./pickup";
import { PlayerHUD } from "./player-hud";
import { Resources } from "./resources";

const gameWidth = 800;
const gameHeight = 600;

export class Level extends Scene {

    player = new Player('player1')

    playerHUD = new PlayerHUD();

    startingX = 100;
    firstActivation: boolean = false;

    walls = [
        new Wall(gameWidth / 2, 10, gameWidth, 20, Color.Cyan),    // Top wall
        new Wall(gameWidth / 2, gameHeight - 10, gameWidth, 20, Color.Cyan), // Bottom wall
        new Wall(10, gameHeight / 2, 20, gameHeight, Color.Cyan),   // Left wall
        new Wall(gameWidth - 10, gameHeight / 2, 20, gameHeight, Color.Cyan) // Right wall
    ]

    enemy = new Enemy('enemy1')

    pickup = new PickUp('pickup1', {
        pos: { x: gameWidth / 2, y: gameHeight / 2 },
    })

    exitDoor = new Door(gameWidth - 50, gameHeight / 2, 40, 80, Color.Black, 'Level2')

    onInitialize(engine: Engine): void {
        // this.walls.forEach(wall => this.add(wall));
        this.setupTileMap();
        this.add(this.player);
        this.add(this.enemy);
        this.add(this.exitDoor);
        this.add(this.pickup);
        this.add(this.playerHUD);
        engine.currentScene.camera.strategy.lockToActor(this.player);

    }

    onActivate(context: SceneActivationContext<any>): void {
        // Reset player position when the level is activated
        this.player.vel = vec(0,0);
        this.player.pos = vec(
            this.firstActivation ? this.exitDoor.pos.x - 60 : this.startingX, 
            gameHeight / 2
        );
        this.firstActivation = true;
    }


    setupTileMap() {

        const tileSize = 64

        const landSpriteSheet = SpriteSheet.fromImageSource({
            image: Resources.TileSheet,
            grid: {
                rows: 13,
                columns: 20,
                spriteWidth: tileSize,
                spriteHeight: tileSize
            },
        })

        const levelLength = 20
        const levelHeight = 10

        const tileMap = new TileMap({
            rows: levelHeight,
            columns: levelLength,
            tileWidth: tileSize,
            tileHeight: tileSize
        })

        for (let tile of tileMap.tiles) {

            const tilePosX = tile.pos.x / tileSize
            const tilePosY = tile.pos.y / tileSize
            let spriteX = 1
            let spriteY = 1

            if (tilePosX === 1) {
                spriteX = 0
            }
            if (tilePosY === 1) {
                spriteY = 0
            }
            if (tilePosY === levelHeight - 2) {
                spriteY = 2
            }
            if (tilePosX === levelLength - 2) {
                spriteX = 2
            }

            if (tilePosX <= 0) {
                spriteX = 6
                spriteY = 1
                tile.solid = true
            }            
            if (tilePosX >= levelLength - 1) {
                spriteX = 6
                spriteY = 1
                tile.solid = true
            }            
            if (tilePosY <= 0) {
                spriteY = 1
                spriteX = 6
                tile.solid = true
            }            
            if (tilePosY >= levelHeight - 1) {
                spriteY = 1
                spriteX = 6
                tile.solid = true
            }
            const sprite = landSpriteSheet.getSprite(spriteX, spriteY);
            if (sprite) {
                tile.addGraphic(sprite);
            }
        }

        this.add(tileMap);
    }
}