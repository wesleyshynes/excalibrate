// resources.ts

import { ImageSource } from "excalibur";


export const Resources = {
    // Player sheets
    PlayerIdle: new ImageSource('./images/16x16-Idle-Sheet.png'),
    PlayerRun: new ImageSource('./images/16x16-Run-Cycle-Sheet.png'),
    PlayerWalk: new ImageSource('./images/16x16-Walk-Cycle-Sheet.png'),

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