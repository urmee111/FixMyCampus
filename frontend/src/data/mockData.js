export const MOCK_USERS = {
  student: {
    id: 1,
    name: 'Tanjim Hossain',
    email: 'tanjim@campus.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80',
    department: 'Computer Science & Engineering',
    studentId: 'CS-2022-084',
  },
  student2: {
    id: 2,
    name: 'Aisha Rahman',
    email: 'aisha.rahman@campus.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80',
    department: 'Electrical & Electronic Engineering',
    studentId: 'EEE-2023-019',
  },
  student3: {
    id: 3,
    name: 'Nabil Hasan',
    email: 'nabil.hasan@campus.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&q=80',
    department: 'Architecture & Design',
    studentId: 'ARC-2021-042',
  },
  student4: {
    id: 4,
    name: 'Sadia Ahmed',
    email: 'sadia.ahmed@campus.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=128&q=80',
    department: 'Civil Engineering',
    studentId: 'CE-2023-055',
  },
  admin: {
    id: 99,
    name: 'Campus Facilities Admin',
    email: 'admin.estate@campus.edu',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80',
    department: 'Facilities & Campus Operations',
    title: 'Senior Estate Maintenance Engineer',
  },
}

export const MOCK_ISSUES = [
  {
    id: 1,
    title: 'Ceiling fan oscillating arm broken and making rattling noise in Room 214',
    description: 'The ceiling fan directly above the second row of desks in Room 214 has a bent oscillating bracket. It makes loud clicking noises and wobbles violently when set to speed 3 or higher. Poses a safety hazard for students sitting underneath.',
    category: 'electrical',
    location: 'Hall 2, Room 214',
    status: 'Open',
    upvotes: 42,
    hasUpvoted: true,
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date(Date.now() - 2.5 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2.5 * 3600 * 1000).toISOString(),
    reporter: {
      id: 1,
      name: 'Tanjim Hossain',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80',
    },
    commentsCount: 8,
    comments: [
      {
        id: 101,
        text: 'Can confirm, had an exam there this morning and the rattling was extremely distracting.',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        author: { id: 3, name: 'Nabil Hasan', role: 'student', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&q=80' }
      },
      {
        id: 102,
        text: 'Maintenance team received ticket #EL-409. Technician assigned for inspection this afternoon.',
        createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
        author: { id: 99, name: 'Campus Facilities Admin', role: 'admin', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80' }
      }
    ],
    timeline: [
      { id: 1, status: 'Open', note: 'Issue reported by Tanjim Hossain', timestamp: new Date(Date.now() - 2.5 * 3600 * 1000).toISOString() }
    ]
  },
  {
    id: 2,
    title: 'Severe water leakage from ceiling tiles near Study Area B',
    description: 'Water has been consistently dripping through two suspended ceiling panels since early morning rain. Two study tables are unusable and water is pooling near floor power conduits.',
    category: 'water',
    location: 'Library 3rd Floor',
    status: 'In Progress',
    upvotes: 27,
    hasUpvoted: false,
    imageUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    reporter: {
      id: 2,
      name: 'Aisha Rahman',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80',
    },
    commentsCount: 5,
    comments: [
      {
        id: 103,
        text: 'Estate plumbing unit has placed buckets and isolated the rooftop drainage valve. Roofing contractors arriving at 4 PM.',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        author: { id: 99, name: 'Campus Facilities Admin', role: 'admin', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80' }
      }
    ],
    timeline: [
      { id: 1, status: 'Open', note: 'Reported by Aisha Rahman', timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString() },
      { id: 2, status: 'In Progress', note: 'Plumbing contractor dispatched to isolate leak', timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString() }
    ]
  },
  {
    id: 3,
    title: 'Unclean washroom facilities & clogged drainage pipe on 2nd Floor',
    description: 'The middle washroom on the second floor has an overflowing floor drain and non-functional soap dispensers. Needs immediate sanitation and high-pressure drain clearing.',
    category: 'cleanliness',
    location: 'CSE Building Washroom',
    status: 'Open',
    upvotes: 19,
    hasUpvoted: true,
    imageUrl: null,
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    reporter: {
      id: 4,
      name: 'Sadia Ahmed',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=128&q=80',
    },
    commentsCount: 3,
    comments: [],
    timeline: [
      { id: 1, status: 'Open', note: 'Issue submitted by Sadia Ahmed', timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString() }
    ]
  },
  {
    id: 4,
    title: 'Access Point roaming failure and zero 5GHz signal in East Wing',
    description: 'Students in Cafeteria East wing lose internet every 2-3 minutes. SSID "Campus-Secure" connects with limited connectivity. IP lease renewal fails repeatedly.',
    category: 'internet',
    location: 'Cafeteria Main Hall',
    status: 'In Progress',
    upvotes: 12,
    hasUpvoted: false,
    imageUrl: null,
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    reporter: {
      id: 3,
      name: 'Nabil Hasan',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&q=80',
    },
    commentsCount: 6,
    comments: [],
    timeline: [
      { id: 1, status: 'Open', note: 'Reported by Nabil Hasan', timestamp: new Date(Date.now() - 14 * 3600 * 1000).toISOString() },
      { id: 2, status: 'In Progress', note: 'Network Operations rebooted switch, testing AP beacon', timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString() }
    ]
  },
  {
    id: 5,
    title: 'Multiple broken auditorium seats in Row G (Seats 12-16)',
    description: 'Five consecutive folding seats have disconnected seatback springs and exposed metal fasteners that tore a student jacket yesterday. Require bolt replacements and cushioning.',
    category: 'furniture',
    location: 'Central Auditorium',
    status: 'Open',
    upvotes: 8,
    hasUpvoted: false,
    imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    reporter: {
      id: 2,
      name: 'Aisha Rahman',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80',
    },
    commentsCount: 2,
    comments: [],
    timeline: [
      { id: 1, status: 'Open', note: 'Reported by Aisha Rahman', timestamp: new Date(Date.now() - 20 * 3600 * 1000).toISOString() }
    ]
  },
  {
    id: 6,
    title: 'Overhead projector bulb burned out before scheduled lecture',
    description: 'The EPSON HDMI projector displays a flashing red lamp warning light and will not ignite. Two midterm presentations had to be postponed.',
    category: 'electrical',
    location: 'Academic Building 2, Room 301',
    status: 'Resolved',
    upvotes: 7,
    hasUpvoted: true,
    imageUrl: null,
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    reporter: {
      id: 1,
      name: 'Tanjim Hossain',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80',
    },
    commentsCount: 4,
    comments: [
      {
        id: 104,
        text: 'New 4000-lumen lamp unit installed and focus calibrated. Confirmed working by Lab Assistant.',
        createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
        author: { id: 99, name: 'Campus Facilities Admin', role: 'admin', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80' }
      }
    ],
    timeline: [
      { id: 1, status: 'Open', note: 'Reported by Tanjim Hossain', timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString() },
      { id: 2, status: 'In Progress', note: 'Replacement lamp requisitioned from inventory', timestamp: new Date(Date.now() - 18 * 3600 * 1000).toISOString() },
      { id: 3, status: 'Resolved', note: 'Replaced bulb and verified projection', timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString() }
    ]
  },
  {
    id: 7,
    title: 'Drinking water dispenser filtration alert active and warm water',
    description: 'Water cooler near Lab 5 has the red "Replace Filter" indicator blinking. Output water is lukewarm and has a slight metallic taste. Needs cartridge renewal.',
    category: 'water',
    location: 'Software Lab 5',
    status: 'Open',
    upvotes: 6,
    hasUpvoted: false,
    imageUrl: null,
    createdAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    reporter: {
      id: 4,
      name: 'Sadia Ahmed',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=128&q=80',
    },
    commentsCount: 1,
    comments: [],
    timeline: [
      { id: 1, status: 'Open', note: 'Submitted by Sadia Ahmed', timestamp: new Date(Date.now() - 28 * 3600 * 1000).toISOString() }
    ]
  },
  {
    id: 8,
    title: 'Damaged main entry turnstile barrier jamming during rush hour',
    description: 'Turnstile gate #3 arm does not retract smoothly when RFID card is tapped, causing long queues and occasional gate jams.',
    category: 'other',
    location: 'Main Gate Entrance',
    status: 'In Progress',
    upvotes: 9,
    hasUpvoted: false,
    imageUrl: null,
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    reporter: {
      id: 3,
      name: 'Nabil Hasan',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&q=80',
    },
    commentsCount: 3,
    comments: [],
    timeline: [
      { id: 1, status: 'Open', note: 'Reported by Nabil Hasan', timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString() },
      { id: 2, status: 'In Progress', note: 'Security hardware vendor technician on-site', timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString() }
    ]
  },
  {
    id: 9,
    title: 'AC unit thermostat in Lounge stuck at maximum cooling (16°C)',
    description: 'Thermostat sensor has failed on the split AC in the Student Lounge. It cannot be adjusted with remote or panel, leading to extreme cold and massive energy waste.',
    category: 'electrical',
    location: 'Student Lounge Ground Floor',
    status: 'Resolved',
    upvotes: 12,
    hasUpvoted: false,
    imageUrl: null,
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    reporter: {
      id: 2,
      name: 'Aisha Rahman',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80',
    },
    commentsCount: 5,
    comments: [],
    timeline: [
      { id: 1, status: 'Open', note: 'Reported by Aisha Rahman', timestamp: new Date(Date.now() - 72 * 3600 * 1000).toISOString() },
      { id: 2, status: 'In Progress', note: 'HVAC technician calibrated control PCB', timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString() },
      { id: 3, status: 'Resolved', note: 'Thermostat set to 24°C standard eco mode', timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString() }
    ]
  },
  {
    id: 10,
    title: 'Floodlight tower 2 tripping circuit breaker during night matches',
    description: 'During evening sports sessions, the second floodlight tower on the northern boundary trips after 10-15 minutes of operation. High moisture ingress suspected in the junction box.',
    category: 'electrical',
    location: 'Central Sports Field',
    status: 'Open',
    upvotes: 5,
    hasUpvoted: false,
    imageUrl: null,
    createdAt: new Date(Date.now() - 50 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 50 * 3600 * 1000).toISOString(),
    reporter: {
      id: 3,
      name: 'Nabil Hasan',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&q=80',
    },
    commentsCount: 0,
    comments: [],
    timeline: [
      { id: 1, status: 'Open', note: 'Reported by Nabil Hasan', timestamp: new Date(Date.now() - 50 * 3600 * 1000).toISOString() }
    ]
  },
  {
    id: 11,
    title: 'Corridor emergency exit door handle jammed shut',
    description: 'Emergency exit push-bar on Hostel Block B second floor is stuck in locked position. In an emergency evacuation, students would be trapped.',
    category: 'other',
    location: 'Hostel Block B, Corridor 2',
    status: 'In Progress',
    upvotes: 19,
    hasUpvoted: true,
    imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    reporter: {
      id: 1,
      name: 'Tanjim Hossain',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80',
    },
    commentsCount: 7,
    comments: [],
    timeline: [
      { id: 1, status: 'Open', note: 'High urgency reported by Tanjim Hossain', timestamp: new Date(Date.now() - 10 * 3600 * 1000).toISOString() },
      { id: 2, status: 'In Progress', note: 'Locksmith and safety officer dispatched immediately', timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString() }
    ]
  },
  {
    id: 12,
    title: 'Low voltage output on Lab 1 test benches causing oscilloscopes to shut down',
    description: 'Benches 4 through 8 have variable AC supply dipping below 190V. Power supplies trip reset fuses repeatedly during experiments.',
    category: 'electrical',
    location: 'Electrical Engineering Lab 1',
    status: 'Open',
    upvotes: 2,
    hasUpvoted: false,
    imageUrl: null,
    createdAt: new Date(Date.now() - 60 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 3600 * 1000).toISOString(),
    reporter: {
      id: 2,
      name: 'Aisha Rahman',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80',
    },
    commentsCount: 2,
    comments: [],
    timeline: [
      { id: 1, status: 'Open', note: 'Reported by Aisha Rahman', timestamp: new Date(Date.now() - 60 * 3600 * 1000).toISOString() }
    ]
  },
  {
    id: 13,
    title: 'Recycling and trash bins overflowing in Cafeteria quadrangle',
    description: 'Food wrappers, coffee cups, and plastic containers are scattered outside the bins. Crows and stray cats are rummaging through the refuse.',
    category: 'cleanliness',
    location: 'Cafeteria Main Hall',
    status: 'Resolved',
    upvotes: 15,
    hasUpvoted: true,
    imageUrl: null,
    createdAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 40 * 3600 * 1000).toISOString(),
    reporter: {
      id: 4,
      name: 'Sadia Ahmed',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=128&q=80',
    },
    commentsCount: 4,
    comments: [],
    timeline: [
      { id: 1, status: 'Open', note: 'Reported by Sadia Ahmed', timestamp: new Date(Date.now() - 96 * 3600 * 1000).toISOString() },
      { id: 2, status: 'Resolved', note: 'Housekeeping cleared quad and added 2 heavy-duty covered bins', timestamp: new Date(Date.now() - 40 * 3600 * 1000).toISOString() }
    ]
  },
  {
    id: 14,
    title: 'Broken window latch allowing rain spray into Library quiet room',
    description: 'West-facing aluminum casement window latch snapped. In heavy winds the window swings open, exposing wooden reading desks to rain.',
    category: 'furniture',
    location: 'Library 3rd Floor',
    status: 'Open',
    upvotes: 0,
    hasUpvoted: false,
    imageUrl: null,
    createdAt: new Date(Date.now() - 15 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 3600 * 1000).toISOString(),
    reporter: {
      id: 3,
      name: 'Nabil Hasan',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&q=80',
    },
    commentsCount: 1,
    comments: [],
    timeline: [
      { id: 1, status: 'Open', note: 'Reported by Nabil Hasan', timestamp: new Date(Date.now() - 15 * 3600 * 1000).toISOString() }
    ]
  },
  {
    id: 15,
    title: 'Broken flush valve causing continuous water running in stall 1',
    description: 'Internal ceramic flush valve seal worn out. Continuous water drainage is wasting hundreds of liters of water per hour.',
    category: 'water',
    location: 'CSE Building Washroom',
    status: 'Resolved',
    upvotes: 8,
    hasUpvoted: false,
    imageUrl: null,
    createdAt: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 52 * 3600 * 1000).toISOString(),
    reporter: {
      id: 1,
      name: 'Tanjim Hossain',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80',
    },
    commentsCount: 2,
    comments: [],
    timeline: [
      { id: 1, status: 'Open', note: 'Reported by Tanjim Hossain', timestamp: new Date(Date.now() - 120 * 3600 * 1000).toISOString() },
      { id: 2, status: 'Resolved', note: 'Replaced dual-flush valve diaphragm and tested pressure', timestamp: new Date(Date.now() - 52 * 3600 * 1000).toISOString() }
    ]
  },
  {
    id: 16,
    title: 'Ethernet wall jacks 3 & 4 physically damaged in Software Lab',
    description: 'The RJ-45 retention clips are broken inside the wall faceplate. Patch cords slide out with the slightest desk vibration, dropping developer SSH sessions.',
    category: 'internet',
    location: 'Software Lab 5',
    status: 'Open',
    upvotes: 5,
    hasUpvoted: false,
    imageUrl: null,
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    reporter: {
      id: 2,
      name: 'Aisha Rahman',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80',
    },
    commentsCount: 2,
    comments: [],
    timeline: [
      { id: 1, status: 'Open', note: 'Reported by Aisha Rahman', timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString() }
    ]
  },
  {
    id: 17,
    title: 'Loose electrical socket cover sparking in Student Lounge',
    description: 'Wall power outlet between couches has a cracked faceplate and sparks when heavy laptop adapters are inserted. Needs immediate isolation before someone gets shocked.',
    category: 'electrical',
    location: 'Student Lounge Ground Floor',
    status: 'In Progress',
    upvotes: 31,
    hasUpvoted: true,
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    reporter: {
      id: 4,
      name: 'Sadia Ahmed',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=128&q=80',
    },
    commentsCount: 9,
    comments: [],
    timeline: [
      { id: 1, status: 'Open', note: 'Emergency electrical hazard reported by Sadia Ahmed', timestamp: new Date(Date.now() - 8 * 3600 * 1000).toISOString() },
      { id: 2, status: 'In Progress', note: 'Duty electrician isolated circuit breaker 4B', timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString() }
    ]
  },
  {
    id: 18,
    title: 'Classroom podium microphone connection loose and hums loudly',
    description: 'XLR connector on podium is loose, creating high 50Hz electrical buzz whenever professors adjust the gooseneck mic during lectures.',
    category: 'other',
    location: 'Academic Building 2, Room 301',
    status: 'Open',
    upvotes: 2,
    hasUpvoted: false,
    imageUrl: null,
    createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    reporter: {
      id: 3,
      name: 'Nabil Hasan',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&q=80',
    },
    commentsCount: 1,
    comments: [],
    timeline: [
      { id: 1, status: 'Open', note: 'Reported by Nabil Hasan', timestamp: new Date(Date.now() - 18 * 3600 * 1000).toISOString() }
    ]
  }
]

export const MOCK_STATS = {
  totalIssues: 18,
  openIssues: 9,
  inProgressIssues: 5,
  resolvedIssues: 4,
  resolutionRate: 74.5,
  avgResolutionHours: 26.2,
  totalUpvotes: 218,
  activeReporters: 54,
  byCategory: [
    { category: 'electrical', count: 6, label: 'Electrical', percentage: 33 },
    { category: 'water', count: 3, label: 'Water', percentage: 17 },
    { category: 'cleanliness', count: 2, label: 'Cleanliness', percentage: 11 },
    { category: 'furniture', count: 2, label: 'Furniture', percentage: 11 },
    { category: 'internet', count: 2, label: 'Internet', percentage: 11 },
    { category: 'other', count: 3, label: 'Other', percentage: 17 },
  ],
  hotspots: [
    { location: 'Hall 2, Room 214', count: 5, activeStatus: 'Open' },
    { location: 'Library 3rd Floor', count: 4, activeStatus: 'In Progress' },
    { location: 'Student Lounge Ground Floor', count: 3, activeStatus: 'In Progress' },
    { location: 'CSE Building Washroom', count: 3, activeStatus: 'Open' },
  ],
}
