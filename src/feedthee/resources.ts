// resources.ts

import { ImageSource } from "excalibur";


export const Resources = {
    // Player sheets
    PlayerIdle: new ImageSource('./images/16x16-Idle-Sheet.png'),
    PlayerRun: new ImageSource('./images/16x16-Run-Cycle-Sheet.png'),
    PlayerWalk: new ImageSource('./images/16x16-Walk-Cycle-Sheet.png'),

    // Slash Sprite
    SlashSprite: new ImageSource('./images/slash-sprite-32x16.png'),

    // Slime sprites
    SlimeIdle: new ImageSource('./images/slime/Slime1_Idle_body.png'),
    SlimeRun: new ImageSource('./images/slime/Slime1_Run_body.png'),
    SlimeWalk: new ImageSource('./images/slime/Slime1_Walk_body.png'),

    // TileSheet
    TileSheet: new ImageSource('./images/RPGpack_sheet.png'),

    CoinImage: new ImageSource('./images/coin_gold.png'),
    // Relative to /public in vite
    // BirdImage: new ex.ImageSource('./images/bird.png'),
    // PipeImage: new ex.ImageSource('./images/pipe.png', {
    //     wrapping: ex.ImageWrapping.Clamp
    // }),
    // GroundImage: new ex.ImageSource('./images/ground.png', {
    //     wrapping: ex.ImageWrapping.Repeat
    // }),

    // Sounds
    // FlapSound: new ex.Sound('./sounds/flap.wav'),
    // FailSound: new ex.Sound('./sounds/fail.wav'),
    // ScoreSound: new ex.Sound('./sounds/score.wav'),

    // Music
    // BackgroundMusic: new ex.Sound('./sounds/two_left_socks.ogg')
} as const;