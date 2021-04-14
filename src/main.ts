import App from './App';

let isDevelop:Boolean = true;

const game = new App();

if(isDevelop) {
  window['game'] = game;
}