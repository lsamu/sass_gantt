import { withInstall } from '../utils/install';
import { Variables } from '../constants/vars';
import Column from 'components/column/index.vue';

const XGanttColumn = withInstall<any,any,any>(
  Variables.name.column,
  Column
);

export default XGanttColumn;
