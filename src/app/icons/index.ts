import ROSE_ICON from './rose.icon';
import ROSES_ICON from './roses.icon';
import ROZA_MYSTICA_OUTLINE_ICON from './roza-mystica-outline.icon';
import ROZA_MYSTICA_ICON from './roza-mystica.icon';
import SUIGINTOU_FEATHER_1_ICON from './suigintou-feather-1.icon';
import SUIGINTOU_FEATHER_2_ICON from './suigintou-feather-2.icon';
import SUIGINTOU_FEATHER_3_ICON from './suigintou-feather-3.icon';
import SUIGINTOU_FEATHER_4_ICON from './suigintou-feather-4.icon';

export type Icon = { width: number, height: number, code: string };

export type IconName = 'rose' | 'roses' | 'roza_mystica_outline' | 'roza_mystica' | 'suigintou_feather_1' | 'suigintou_feather_2'
 | 'suigintou_feather_3' | 'suigintou_feather_4';

export const icons: Record<IconName, Icon> = {
  'rose': ROSE_ICON,
  'roses': ROSES_ICON,
  'roza_mystica_outline': ROZA_MYSTICA_OUTLINE_ICON,
  'roza_mystica': ROZA_MYSTICA_ICON,
  'suigintou_feather_1': SUIGINTOU_FEATHER_1_ICON,
  'suigintou_feather_2': SUIGINTOU_FEATHER_2_ICON,
  'suigintou_feather_3': SUIGINTOU_FEATHER_3_ICON,
  'suigintou_feather_4': SUIGINTOU_FEATHER_4_ICON,
};
