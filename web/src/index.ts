import type { App, Plugin } from 'vue';
import XGantt from './exports/root';
import XGanttColumn from './exports/column';
import XGanttSlider from './exports/slider';

const components = {
  XGantt,
  XGanttColumn,
  XGanttSlider
};

export { XGantt, XGanttColumn, XGanttSlider };

const install = (app, options) => {
  for (const key of Object.keys(components)) {
    app.use(components[key], options);
  }
};

export default {
  install
};
