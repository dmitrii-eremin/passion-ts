import './style.css'
import { Passion } from './passion/passion'
import { Game } from './game/game'

document.addEventListener('DOMContentLoaded', () => {

  const app = document.getElementById('app') as HTMLCanvasElement | null;
  if (app) {
    const passion = new Passion(app);

    const game = new Game(passion);
    passion.system.run(
      (dt: number) => game.update(dt),
      () => game.draw()
    );
  }
});
