import type { User, Photo, QueueItem, UploadPhoto, DayGroup, TripEntry } from './types'

export const USERS: User[] = [
  { id: 'u1', name: 'Alex', initials: 'AB', color: '#9B4132', avatar: 'https://i.pravatar.cc/80?img=3' },
  { id: 'u2', name: 'Sarah', initials: 'SK', color: '#2E7D6A', avatar: 'https://i.pravatar.cc/80?img=5' },
  { id: 'u3', name: 'Maya', initials: 'MR', color: '#8B6914', avatar: 'https://i.pravatar.cc/80?img=9' },
  { id: 'u4', name: 'Jordan', initials: 'JL', color: '#5B4A8C', avatar: 'https://i.pravatar.cc/80?img=11' },
]

export const PHOTOS: Photo[] = [
  {
    id: 'p1',
    url: 'https://picsum.photos/seed/goldengate21/800/500',
    thumbnail: 'https://picsum.photos/seed/goldengate21/200/200',
    caption: 'Crossing the bridge at sunrise.',
    uploaderId: 'u1',
    capturedAt: new Date('2024-09-14T06:23:00'),
    location: { lat: 37.819, lng: -122.478, name: 'Golden Gate' },
  },
  {
    id: 'p2',
    url: 'https://picsum.photos/seed/coffeemorning/800/500',
    thumbnail: 'https://picsum.photos/seed/coffeemorning/200/200',
    caption: 'San Francisco, CA',
    uploaderId: 'u2',
    capturedAt: new Date('2024-09-14T08:15:00'),
    location: { lat: 37.773, lng: -122.431, name: 'San Francisco' },
  },
  {
    id: 'p3',
    url: 'https://picsum.photos/seed/pacificacoast/800/500',
    thumbnail: 'https://picsum.photos/seed/pacificacoast/200/200',
    caption: 'Pacifica Coastline',
    uploaderId: 'u3',
    capturedAt: new Date('2024-09-14T10:45:00'),
    location: { lat: 37.610, lng: -122.489, name: 'Pacifica' },
  },
  {
    id: 'p4',
    url: 'https://picsum.photos/seed/bigsurredwood/800/500',
    thumbnail: 'https://picsum.photos/seed/bigsurredwood/200/200',
    caption: 'Into the redwoods.',
    uploaderId: 'u1',
    capturedAt: new Date('2024-09-15T09:30:00'),
    location: { lat: 36.270, lng: -121.808, name: 'Big Sur' },
  },
  {
    id: 'p5',
    url: 'https://picsum.photos/seed/bixbycreek/800/500',
    thumbnail: 'https://picsum.photos/seed/bixbycreek/200/200',
    caption: 'Bixby Creek Canyon.',
    uploaderId: 'u2',
    capturedAt: new Date('2024-09-15T11:15:00'),
    location: { lat: 36.371, lng: -121.904, name: 'Bixby' },
  },
  {
    id: 'p6',
    url: 'https://picsum.photos/seed/pfeifferbeach/800/500',
    thumbnail: 'https://picsum.photos/seed/pfeifferbeach/200/200',
    caption: 'Pfeiffer Beach',
    uploaderId: 'u4',
    capturedAt: new Date('2024-09-15T14:20:00'),
    location: { lat: 36.195, lng: -121.773, name: 'Pfeiffer' },
  },
  {
    id: 'p7',
    url: 'https://picsum.photos/seed/sansimsunset/800/500',
    thumbnail: 'https://picsum.photos/seed/sansimsunset/200/200',
    caption: 'Last light on the highway.',
    uploaderId: 'u3',
    capturedAt: new Date('2024-09-16T19:05:00'),
    location: { lat: 35.660, lng: -121.145, name: 'San Simeon' },
  },
]

export const DAY_GROUPS: DayGroup[] = [
  {
    dateLabel: 'SEPTEMBER 14',
    dayTitle: 'Day 1: Leaving SF',
    photos: PHOTOS.slice(0, 3),
  },
  {
    dateLabel: 'SEPTEMBER 15',
    dayTitle: 'Day 2: Big Sur',
    photos: PHOTOS.slice(3, 6),
  },
  {
    dateLabel: 'SEPTEMBER 16',
    dayTitle: 'Day 3: Heading South',
    photos: PHOTOS.slice(6),
  },
]

export const UPLOAD_PHOTOS: UploadPhoto[] = [
  { id: 'up1', thumbnail: 'https://picsum.photos/seed/mistforest/400/400' },
  { id: 'up2', thumbnail: 'https://picsum.photos/seed/alpinelake/400/400' },
  { id: 'up3', thumbnail: 'https://picsum.photos/seed/campermug/400/400' },
  { id: 'up4', thumbnail: 'https://picsum.photos/seed/goldenfield/400/400' },
  { id: 'up5', thumbnail: 'https://picsum.photos/seed/mossytrail/400/400' },
  { id: 'up6', thumbnail: 'https://picsum.photos/seed/aerialroad/400/400' },
]

export const QUEUE_ITEMS: QueueItem[] = [
  { filename: 'Coastal_Vista_01.jpg', status: 'uploading', progress: 82 },
  { filename: 'Mountain_Pass.jpg', status: 'queued' },
]

export const TRIPS: TripEntry[] = [
  {
    id: 'tr1',
    name: 'Sierra Nevada Trek',
    location: 'California, USA',
    dateLabel: 'AUG 2023',
    cover: {
      type: 'photo',
      url: 'https://picsum.photos/seed/sierraforest88/800/420',
      dateBadge: 'AUG 2023',
      label: 'LIREK',
    },
    members: [USERS[0], USERS[1]],
    route: '/journal',
  },
  {
    id: 'tr2',
    name: 'Big Sur Solo Run',
    dateLabel: 'SEPTEMBER 2023',
    isSolo: true,
    cover: {
      type: 'photo',
      url: 'https://picsum.photos/seed/bigsurcoast77/800/420',
      dateBadge: 'SEPTEMBER 2023',
    },
    members: [USERS[2]],
    route: '/journal',
  },
  {
    id: 'tr3',
    name: 'Cascades Canoe',
    dateLabel: 'July 2023',
    durationLabel: '4 days',
    cover: {
      type: 'illustrated',
      gradient: 'linear-gradient(160deg, #1a2e1a 0%, #2d4a1e 35%, #c85a1a 70%, #8b3a0a 100%)',
      label: 'CASCADES',
      sublabel: 'SAFE WORK',
      icon: '🛶',
    },
    members: [USERS[2], USERS[3]],
    route: '/explore',
  },
  {
    id: 'tr4',
    name: 'North Sea Island Hopping',
    dateLabel: 'AUTUMN 2022',
    description: 'Exploring the rugged edges of the archipelago, chasing lighthouses and the scent of salt.',
    cover: {
      type: 'illustrated',
      gradient: 'linear-gradient(170deg, #0d1f2d 0%, #1a3a4a 40%, #0f4a4a 70%, #163d3d 100%)',
      label: 'ISLAND HOPPING',
      icon: '⛵',
    },
    members: [USERS[0], USERS[1]],
    otherCount: 5,
    route: '/explore',
  },
]

export const TRIP = {
  name: 'Pacific Coast Highway',
  dateStart: new Date('2024-09-14'),
  dateEnd: new Date('2024-09-17'),
  totalDistanceMi: 452,
  parksVisited: 3,
  members: USERS,
  photos: PHOTOS,
  inviteCode: 'ROUTE-99-MIST',
}
