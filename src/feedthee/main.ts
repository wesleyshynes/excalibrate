// main.ts
// https://github.com/excaliburjs/sample-excalibird/tree/main/src
import { Color, DisplayMode, Engine, Loader } from 'excalibur';
import { Level } from './level';

// import { Resources } from './resources';
// import { initMuteButton } from './ui';

// const positionUI = (game: ex.Engine) => {
//   const ui = document.getElementsByClassName("ui")[0] as HTMLElement;
//   if (ui) {
//     const topLeft = game.screen.screenToPageCoordinates(ex.vec(10, 500 - 40));
//     ui.style.visibility = 'visible';
//     ui.style.left = topLeft.x + 'px';
//     ui.style.top = topLeft.y + 'px';
//   }
// }

const game = new Engine({
  width: 800,
  height: 600,
  backgroundColor: Color.fromHex("#54C0CA"),
  pixelArt: true,
  pixelRatio: 2,
  displayMode: DisplayMode.FitScreen,
  scenes: { 
    Level: Level
  }
});

const loader = new Loader();
// const loader = new ex.Loader(Object.values(Resources));
loader.playButtonText = 'Click to Play';
loader.logo = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAWtJREFUWEfdl9ERwyAIhnWBTpZx7QIdqQukh1c8RBAwNg/tU5tY/g8UhJzWPufkbzliMrJ4JqppmvbNBSmlFWEOpOpYAKL4+e7t54cr6KIWPOQiuLB7zkVR0ineln+/NNsaQFugCS8CtFCBXYCXALpFWnCfr9K9Oo7DtQ+wiDqlAlieU4CI+ABQSjm5AUt8R/jBBjiRAQB+UIhfAqBtjOB2gG5/hfQUAawtoKnmFYCoSik6AEiVziMiHUJp6zjENgDJwwgArUxDufVEYAeAWog8ALP9pRVJ2wJ0wKz7mtBtADzUGB3tEvJEjxayIQKeIjS7B24B0HLccxtxwKUIXAGglxFmQX2G9J4t+BuA6ghvkfh9Tb1d7AWHo2E2JDMheHelG1rqiCK3YTgTZn2/50AGu+Kh35w2pdJ54B4uAFTNVlG9k8/GuaCmvAfA1TEHItAyDmcCTENp/KJj1O7ZkNrLUh3Q5sUVEGv2TB+ttdz9PrN49gAAAABJRU5ErkJggg==`;
loader.logoWidth = 32;
loader.logoHeight = 32;
loader.backgroundColor = '#333';

game.start(loader).then(() => {
  game.goToScene('Level');
//   positionUI(game);
//   initMuteButton()
});