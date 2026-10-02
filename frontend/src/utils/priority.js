// Priority label from the upvote count (plan Section 8).
// The API already sends `priority` on each issue; this is for places that only have a count
// (e.g. right after an optimistic upvote click).

export function getPriority(upvoteCount) {
  if (upvoteCount >= 10) return 'High';
  if (upvoteCount >= 5) return 'Medium';
  return 'Low';
}
