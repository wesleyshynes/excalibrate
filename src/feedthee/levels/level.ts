import { Color, Engine, Scene, SceneActivationContext, SpriteSheet, TileMap, vec } from "excalibur";
import { Player } from "../entities/player";
import { Enemy } from "../entities/enemy";
import { Door } from "../entities/door";
import { PickUp } from "../entities/pickup";
import { PlayerHUD } from "../player-hud";
import { Resources } from "../resources";
import { gameData } from "../game-data";

export class Level extends Scene {

    player = new Player('player1')

    playerHUD = new PlayerHUD();

    startingX = 100;
    firstActivation: boolean = false;
    activationTime: number = 0;

    enemy = new Enemy('enemy1', {
        pos: { x: 600, y: 300 }
    })

    pickup = new PickUp('pickup1', {
        pos: { x: 400, y: 300 },
    })

    exitDoor = new Door(750, 300, 40, 80, Color.Black, 'Level2')

    onInitialize(engine: Engine): void {
        // this.walls.forEach(wall => this.add(wall));
        this.setupTileMap();
        this.add(this.player);
        this.add(this.enemy);
        this.add(this.enemy);
        this.add(this.exitDoor);
        this.add(this.pickup);
        this.add(this.playerHUD);
        engine.currentScene.camera.strategy.lockToActor(this.player);

        this.firstActivation = true;
    }

    onActivate(context: SceneActivationContext<any>): void {
        if (this.activationTime <= gameData.lastGameStart + 100) {
            this.firstActivation = false;
            if (this.pickup.collected) {
                this.pickup.collected = false;
                this.add(this.pickup);
            }
            this.enemy.reset();
            this.enemy.pos = vec(600, 300);
            this.add(this.enemy);
        }
        // Reset player position when the level is activated
        this.player.vel = vec(0, 0);
        this.player.pos = vec(
            this.firstActivation ? this.exitDoor.pos.x - 60 : this.startingX,
            this.firstActivation ? this.exitDoor.pos.y : 300
        );
        this.firstActivation = true;
        this.activationTime = Date.now();
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