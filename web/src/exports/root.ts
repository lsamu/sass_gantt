import { withInstall } from '../utils/install';
import Root from '../components/root/RootWrap.vue';
import { Variables } from '../constants/vars';

const XGantt = withInstall<any, any, any>(
  Variables.name.root,
  Root
);

export default XGantt;
