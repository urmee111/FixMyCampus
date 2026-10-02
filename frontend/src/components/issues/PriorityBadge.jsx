// Priority pill: High (red), Medium (orange), Low (green).
//   <PriorityBadge priority={issue.priority} />
// The emoji is decoration; the word is always shown too, so color is never the only signal.

import Badge from '../ui/Badge';
import { PRIORITY_COLORS } from '../../utils/constants';

const EMOJI = { High: '🔴', Medium: '🟠', Low: '🟢' };

export default function PriorityBadge({ priority }) {
  return (
    <Badge color={PRIORITY_COLORS[priority]}>
      <span aria-hidden="true">{EMOJI[priority]}</span>
      {priority}
    </Badge>
  );
}
