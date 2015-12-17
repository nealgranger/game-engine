import Pixi from 'pixi.js';
import { createElement } from 'react';

import createStore from './create-store';
import reducer from './reducers';
import { storeFrameDuration, frameCount } from './actions/stats';
import Root from './components/root';
import loop from './loop';
import Accumulator from './accumulator';

import render from './render';
import integrate from './integrator';

const dt = 1000 / 60;
const accumulator = new Accumulator();

const store = createStore(reducer);

loop((frameDuration) => {
  store.dispatch(storeFrameDuration(frameDuration));
  store.dispatch(frameCount());

  const iterations = accumulator.run(dt, frameDuration);

  for (let i = 0; i < iterations; i++) {
    const state = store.getState();
    const actions = integrate(dt, state);
    actions.map(store.dispatch);
  }

  store.notify();
});

render(<Root store={store}/>);