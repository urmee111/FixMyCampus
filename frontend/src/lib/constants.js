// `label` is the exact value the backend uses (Electrical, Water, ...). `id` is only used to pick an icon.
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

// Open = blue, In Progress = amber, Resolved = green (text and background pairs checked for WCAG AA)
export const STATUS_CONFIG = {
  [STATUSES.OPEN]: {
    label: 'Open',
    variant: 'open',
    dotClass: 'bg-blue-600',
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
    icon: 'CircleDot',
  },
  [STATUSES.IN_PROGRESS]: {
    label: 'In Progress',
    variant: 'inProgress',
    dotClass: 'bg-amber-600',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
    icon: 'Clock',
  },
  [STATUSES.RESOLVED]: {
    label: 'Resolved',
    variant: 'resolved',
    dotClass: 'bg-green-600',
    badgeClass: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-800',
    icon: 'CheckCircle2',
  },
}

export const PRIORITIES = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
}

// High = red, Medium = orange, Low = slate
export const PRIORITY_CONFIG = {
  [PRIORITIES.HIGH]: {
    label: 'High Priority',
    variant: 'high',
    badgeClass: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800',
    indicatorClass: 'bg-red-600',
  },
  [PRIORITIES.MEDIUM]: {
    label: 'Medium Priority',
    variant: 'medium',
    badgeClass: 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800',
    indicatorClass: 'bg-orange-600',
  },
  [PRIORITIES.LOW]: {
    label: 'Low Priority',
    variant: 'low',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    indicatorClass: 'bg-slate-500',
  },
}

export const USER_ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
}

// The ONLY list of campus locations (the report form, edit form, filters, duplicate check and QR generator all import it).
// The backend stores a location as "Building" or "Building, Spot" (for example "Library, 2nd floor") and uses
// the text before the first comma as the building when it looks for duplicates,
// so a building name must never contain a comma.
export const CAMPUS_LOCATIONS = [
  'Plaza',
  'Canteen',
  'Redex',
  'Lab',
  'Classroom',
  'Washroom',
  'Library',
  'Girls Common Room',
  'Study Room',
]

export const MAX_SPOT_LENGTH = 60 // the optional "Spot / details" box next to the location dropdown

export const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024 // 2MB
export const ALLOWED_IMAGE_FORMATS = ['image/jpeg', 'image/png', 'image/webp']

// Limits that match the backend validators
export const LIMITS = {
  title: { min: 5, max: 120 },
  description: { min: 10, max: 2000 },
  comment: { max: 500 },
  note: { max: 300 },
  password: { min: 6, max: 72 },
}
