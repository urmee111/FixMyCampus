export const CATEGORIES = [
  { id: 'electrical', label: 'Electrical', icon: 'Zap', description: 'Power cuts, fans, switches, lights, wiring' },
  { id: 'water', label: 'Water', icon: 'Droplets', description: 'Leaks, broken pipes, washroom taps, drinking water' },
  { id: 'cleanliness', label: 'Cleanliness', icon: 'Sparkles', description: 'Unclean washrooms, litter, waste bins, hygiene' },
  { id: 'furniture', label: 'Furniture', icon: 'Armchair', description: 'Broken chairs, desks, podiums, benches' },
  { id: 'internet', label: 'Internet', icon: 'Wifi', description: 'Wi-Fi connectivity, LAN ports, network outages' },
  { id: 'other', label: 'Other', icon: 'Wrench', description: 'General facility or structural maintenance issues' },
]

export const STATUSES = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
}

export const STATUS_CONFIG = {
  [STATUSES.OPEN]: {
    label: 'Open',
    variant: 'open',
    dotClass: 'bg-blue-500',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
    icon: 'CircleDot',
  },
  [STATUSES.IN_PROGRESS]: {
    label: 'In Progress',
    variant: 'inProgress',
    dotClass: 'bg-amber-500',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    icon: 'Clock',
  },
  [STATUSES.RESOLVED]: {
    label: 'Resolved',
    variant: 'resolved',
    dotClass: 'bg-emerald-500',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    icon: 'CheckCircle2',
  },
}

export const PRIORITIES = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
}

export const PRIORITY_CONFIG = {
  [PRIORITIES.HIGH]: {
    label: 'High Priority',
    variant: 'high',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
    indicatorClass: 'bg-rose-500',
  },
  [PRIORITIES.MEDIUM]: {
    label: 'Medium Priority',
    variant: 'medium',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    indicatorClass: 'bg-amber-500',
  },
  [PRIORITIES.LOW]: {
    label: 'Low Priority',
    variant: 'low',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    indicatorClass: 'bg-emerald-500',
  },
}

export const USER_ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
}

export const CAMPUS_LOCATIONS = [
  'Hall 2, Room 214',
  'Library 3rd Floor',
  'CSE Building Washroom',
  'Cafeteria Main Hall',
  'Main Gate Entrance',
  'Academic Building 2, Room 301',
  'Central Auditorium',
  'Software Lab 5',
  'Student Lounge Ground Floor',
  'Central Sports Field',
  'Electrical Engineering Lab 1',
  'Hostel Block B, Corridor 2',
]

export const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024 // 2MB
export const ALLOWED_IMAGE_FORMATS = ['image/jpeg', 'image/png', 'image/webp']
