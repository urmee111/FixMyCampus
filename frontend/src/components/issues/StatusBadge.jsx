// Colored pill for an issue status: Open = blue, In Progress = amber, Resolved = green.
//   <StatusBadge status={issue.status} />

import Badge from '../ui/Badge';
import { STATUS_COLORS } from '../../utils/constants';

export default function StatusBadge({ status }) {
  return <Badge color={STATUS_COLORS[status]}>{status}</Badge>;
}
