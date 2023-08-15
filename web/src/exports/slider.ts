import { withInstall } from '../utils/install';
import { Variables } from '../constants/vars';
import Slider from 'components/slider/index.vue';

const XGanttSlider = withInstall<any, any, any>(
  Variables.name.slider,
  Slider
);

export default XGanttSlider;
