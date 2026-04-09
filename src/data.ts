import type { User, Photo, QueueItem, UploadPhoto, DayGroup, TripEntry, Album, LocationPin, AlbumCluster } from './types'

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

export function deleteAlbum(id: string): void {
  const idx = ALBUMS.findIndex(a => a.id === id)
  if (idx !== -1) ALBUMS.splice(idx, 1)
}

export function renameAlbum(id: string, name: string): void {
  const album = ALBUMS.find(a => a.id === id)
  if (album) album.name = name || album.name
}

export function createAlbum(name: string): string {
  const id = `a${Date.now()}`
  ALBUMS.unshift({
    id,
    name: name || 'Untitled Trip',
    coverUrl: `https://picsum.photos/seed/${id}/600/400`,
    photoCount: 0,
    members: [USERS[0]],
    dateLabel: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  })
  return id
}

export const ALBUMS: Album[] = [
  {
    id: 'a1',
    name: 'Pacific Coast Highway',
    coverUrl: 'https://picsum.photos/seed/bigsurredwood/600/400',
    photoCount: 47,
    members: [USERS[0], USERS[1], USERS[2], USERS[3]],
    dateLabel: 'Sep 2024',
    tripId: 'tr1',
  },
  {
    id: 'a2',
    name: 'Sierra Nevada Trek',
    coverUrl: 'https://picsum.photos/seed/sierraforest88/600/400',
    photoCount: 31,
    members: [USERS[0], USERS[1]],
    dateLabel: 'Aug 2023',
    tripId: 'tr1',
  },
  {
    id: 'a3',
    name: 'Bixby Afternoon',
    coverUrl: 'https://picsum.photos/seed/bixbycreek/600/400',
    photoCount: 12,
    members: [USERS[1], USERS[3]],
    dateLabel: 'Sep 2024',
  },
  {
    id: 'a4',
    name: 'Big Sur Solo Run',
    coverUrl: 'https://picsum.photos/seed/bigsurcoast77/600/400',
    photoCount: 19,
    members: [USERS[2]],
    dateLabel: 'Sep 2023',
    tripId: 'tr2',
  },
  {
    id: 'a5',
    name: 'North Sea Island Hopping',
    coverUrl: 'https://picsum.photos/seed/pfeifferbeach/600/400',
    photoCount: 88,
    members: [USERS[0], USERS[1], USERS[3]],
    dateLabel: 'Autumn 2022',
    tripId: 'tr4',
  },
  {
    id: 'a6',
    name: 'Cascades Canoe',
    coverUrl: 'https://picsum.photos/seed/mossytrail/600/400',
    photoCount: 23,
    members: [USERS[2], USERS[3]],
    dateLabel: 'July 2023',
    tripId: 'tr3',
  },
]

// Generates a flat photo list (kept for any legacy usage)
export function getAlbumPhotos(albumId: string, count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `${albumId}-${i}`,
    url: `https://picsum.photos/seed/${albumId}x${i * 13 + 7}/800/600`,
    thumb: `https://picsum.photos/seed/${albumId}x${i * 13 + 7}/400/400`,
    uploader: USERS[i % USERS.length],
  }))
}

export interface AlbumDayGroup {
  dateLabel: string   // e.g. "September 15"
  location: string    // e.g. "BIG SUR COASTLINE"
  photos: { id: string; thumb: string; uploader: (typeof USERS)[number] }[]
}

// Returns photos grouped by day for the album timeline view.
// Uses the album's location pins as the source of truth for dates/places.
export function getAlbumDayGroups(albumId: string): AlbumDayGroup[] {
  const locations = ALBUM_LOCATIONS[albumId]
  if (!locations) return []
  const album = ALBUMS.find(a => a.id === albumId)

  // Build a base date from the album's dateLabel (e.g. "Sep 2024")
  const baseDate = album ? new Date(album.dateLabel) : new Date('Sep 2024')
  const baseTime = isNaN(baseDate.getTime()) ? new Date() : baseDate

  return locations.map((loc, dayIndex) => {
    const day = new Date(baseTime)
    day.setDate(1 + dayIndex)
    const dateLabel = day.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
    const location = loc.label.toUpperCase()

    // Use the location's photo thumbnails + pad to at least 3 with generated seeds
    const basePins = loc.photos.map((p, i) => ({
      id: `${albumId}-${loc.id}-${i}`,
      thumb: p.url.replace('/800/600', '/400/400'),
      uploader: p.uploader,
    }))

    const extra = Array.from({ length: Math.max(0, 3 - basePins.length) }, (_, i) => ({
      id: `${albumId}-${loc.id}-extra${i}`,
      thumb: `https://picsum.photos/seed/${albumId}${loc.id}${i * 7}/400/400`,
      uploader: USERS[(dayIndex + i + 1) % USERS.length],
    }))

    return { dateLabel, location, photos: [...basePins, ...extra] }
  })
}

// All location pins across every album — spread worldwide
export const ALBUM_LOCATIONS: Record<string, LocationPin[]> = {
  a1: [ // Pacific Coast Highway
    { id: 'a1-sf',       label: 'San Francisco',  lat: 37.773,  lng: -122.431, primaryThumb: 'https://picsum.photos/seed/goldengate21/200/200',  primaryColor: USERS[0].color, photos: [{ url: 'https://picsum.photos/seed/goldengate21/800/600',  caption: 'Crossing the bridge at sunrise.', uploader: USERS[0] }, { url: 'https://picsum.photos/seed/coffeemorning/800/600', caption: 'Morning coffee with the map.', uploader: USERS[1] }] },
    { id: 'a1-bigsur',   label: 'Big Sur',        lat: 36.270,  lng: -121.808, primaryThumb: 'https://picsum.photos/seed/bigsurredwood/200/200', primaryColor: USERS[1].color, photos: [{ url: 'https://picsum.photos/seed/bigsurredwood/800/600', caption: 'Into the redwoods.',            uploader: USERS[1] }, { url: 'https://picsum.photos/seed/bigsurcliff/800/600',   caption: 'Cliffside view at dusk.',      uploader: USERS[2] }] },
    { id: 'a1-bixby',    label: 'Bixby',          lat: 36.371,  lng: -121.904, primaryThumb: 'https://picsum.photos/seed/bixbycreek/200/200',   primaryColor: USERS[2].color, highlight: true, photos: [{ url: 'https://picsum.photos/seed/bixbycreek/800/600', caption: 'Bixby Creek Canyon.', uploader: USERS[2] }, { url: 'https://picsum.photos/seed/bixbybridge/800/600', caption: 'Bridge from below.', uploader: USERS[3] }] },
    { id: 'a1-pfeiffer', label: 'Pfeiffer Beach', lat: 36.195,  lng: -121.773, primaryThumb: 'https://picsum.photos/seed/pfeifferbeach/200/200', primaryColor: USERS[3].color, photos: [{ url: 'https://picsum.photos/seed/pfeifferbeach/800/600', caption: 'Purple sand at sunset.', uploader: USERS[3] }, { url: 'https://picsum.photos/seed/pfeiffersurf/800/600', caption: 'Sea arch.', uploader: USERS[0] }] },
  ],
  a2: [ // Sierra Nevada Trek
    { id: 'a2-yosemite', label: 'Yosemite',    lat: 37.865, lng: -119.538, primaryThumb: 'https://picsum.photos/seed/yosemitevalley/200/200', primaryColor: USERS[0].color, photos: [{ url: 'https://picsum.photos/seed/yosemitevalley/800/600', caption: 'Half Dome at sunrise.', uploader: USERS[0] }, { url: 'https://picsum.photos/seed/yosemitefall/800/600', caption: 'Yosemite Falls.',       uploader: USERS[1] }] },
    { id: 'a2-tahoe',    label: 'Lake Tahoe',  lat: 39.096, lng: -120.032, primaryThumb: 'https://picsum.photos/seed/laketahoe99/200/200',    primaryColor: USERS[1].color, photos: [{ url: 'https://picsum.photos/seed/laketahoe99/800/600',    caption: 'Crystal clear water.',          uploader: USERS[1] }, { url: 'https://picsum.photos/seed/tahoeshore/800/600',   caption: 'Golden hour shore.',          uploader: USERS[0] }] },
    { id: 'a2-whitney',  label: 'Mt Whitney',  lat: 36.578, lng: -118.292, primaryThumb: 'https://picsum.photos/seed/mtwhitney88/200/200',    primaryColor: USERS[0].color, photos: [{ url: 'https://picsum.photos/seed/mtwhitney88/800/600',    caption: 'Summit view.',                  uploader: USERS[0] }] },
  ],
  a3: [ // Bixby Afternoon
    { id: 'a3-bixby2',   label: 'Bixby Bridge', lat: 36.375, lng: -121.901, primaryThumb: 'https://picsum.photos/seed/bixby2thumb/200/200',  primaryColor: USERS[1].color, photos: [{ url: 'https://picsum.photos/seed/bixby2thumb/800/600',  caption: 'Afternoon light on the bridge.', uploader: USERS[1] }] },
    { id: 'a3-carmel',   label: 'Carmel',        lat: 36.555, lng: -121.923, primaryThumb: 'https://picsum.photos/seed/carmelbeach/200/200', primaryColor: USERS[3].color, photos: [{ url: 'https://picsum.photos/seed/carmelbeach/800/600', caption: 'White sand Carmel beach.',        uploader: USERS[3] }, { url: 'https://picsum.photos/seed/carmelmission/800/600', caption: 'Carmel Mission at dusk.', uploader: USERS[1] }] },
  ],
  a4: [ // Big Sur Solo Run
    { id: 'a4-mcway',    label: 'McWay Falls',   lat: 36.158, lng: -121.672, primaryThumb: 'https://picsum.photos/seed/mcwayfalls/200/200',  primaryColor: USERS[2].color, photos: [{ url: 'https://picsum.photos/seed/mcwayfalls/800/600',  caption: 'Falls into the ocean.',           uploader: USERS[2] }] },
    { id: 'a4-julia',    label: 'Julia Pfeiffer', lat: 36.165, lng: -121.669, primaryThumb: 'https://picsum.photos/seed/juliapf/200/200',    primaryColor: USERS[2].color, photos: [{ url: 'https://picsum.photos/seed/juliapf/800/600',    caption: 'Lone cypress at the overlook.',   uploader: USERS[2] }] },
    { id: 'a4-lucia',    label: 'Lucia',          lat: 35.980, lng: -121.538, primaryThumb: 'https://picsum.photos/seed/luciahwy/200/200',   primaryColor: USERS[2].color, photos: [{ url: 'https://picsum.photos/seed/luciahwy/800/600',   caption: 'Empty highway south of Lucia.',   uploader: USERS[2] }] },
  ],
  a5: [ // North Sea Island Hopping
    { id: 'a5-amsterdam', label: 'Amsterdam',    lat: 52.370,  lng: 4.895,   primaryThumb: 'https://picsum.photos/seed/amsterdam77/200/200', primaryColor: USERS[0].color, photos: [{ url: 'https://picsum.photos/seed/amsterdam77/800/600', caption: 'Canals at dawn.',               uploader: USERS[0] }, { url: 'https://picsum.photos/seed/amsterdam2/800/600',  caption: 'Bikes and bridges.',           uploader: USERS[1] }] },
    { id: 'a5-shetland',  label: 'Shetland',     lat: 60.530,  lng: -1.265,  primaryThumb: 'https://picsum.photos/seed/shetland33/200/200',  primaryColor: USERS[1].color, photos: [{ url: 'https://picsum.photos/seed/shetland33/800/600',  caption: 'Cliffs at the edge of Europe.',  uploader: USERS[1] }] },
    { id: 'a5-faroe',     label: 'Faroe Islands', lat: 62.008,  lng: -6.790,  primaryThumb: 'https://picsum.photos/seed/faroe22/200/200',    primaryColor: USERS[3].color, photos: [{ url: 'https://picsum.photos/seed/faroe22/800/600',    caption: 'Grass-roofed village.',          uploader: USERS[3] }, { url: 'https://picsum.photos/seed/faroe2b/800/600',     caption: 'Waterfall into the sea.',      uploader: USERS[0] }] },
    { id: 'a5-bergen',    label: 'Bergen',        lat: 60.391,  lng: 5.322,   primaryThumb: 'https://picsum.photos/seed/bergen55/200/200',   primaryColor: USERS[0].color, photos: [{ url: 'https://picsum.photos/seed/bergen55/800/600',   caption: 'Bryggen wharf at golden hour.', uploader: USERS[0] }] },
    { id: 'a5-edinburgh', label: 'Edinburgh',     lat: 55.953,  lng: -3.188,  primaryThumb: 'https://picsum.photos/seed/edinburgh9/200/200', primaryColor: USERS[1].color, photos: [{ url: 'https://picsum.photos/seed/edinburgh9/800/600', caption: 'Arthur\'s Seat in the mist.',    uploader: USERS[1] }] },
  ],
  a6: [ // Cascades Canoe
    { id: 'a6-crater',   label: 'Crater Lake',   lat: 42.944,  lng: -122.109, primaryThumb: 'https://picsum.photos/seed/craterlake/200/200', primaryColor: USERS[2].color, photos: [{ url: 'https://picsum.photos/seed/craterlake/800/600', caption: 'Deepest blue you\'ve ever seen.', uploader: USERS[2] }, { url: 'https://picsum.photos/seed/craterlake2/800/600', caption: 'Wizard Island sunrise.', uploader: USERS[3] }] },
    { id: 'a6-rainier',  label: 'Mt Rainier',    lat: 46.880,  lng: -121.726, primaryThumb: 'https://picsum.photos/seed/mtrainier/200/200',  primaryColor: USERS[3].color, photos: [{ url: 'https://picsum.photos/seed/mtrainier/800/600',  caption: 'Paradise meadows.',              uploader: USERS[3] }] },
    { id: 'a6-gorge',    label: 'Columbia Gorge', lat: 45.715, lng: -121.519, primaryThumb: 'https://picsum.photos/seed/columbiagorge/200/200', primaryColor: USERS[2].color, photos: [{ url: 'https://picsum.photos/seed/columbiagorge/800/600', caption: 'Multnomah Falls.',           uploader: USERS[2] }] },
    { id: 'a6-hood',     label: 'Mt Hood',        lat: 45.373, lng: -121.696, primaryThumb: 'https://picsum.photos/seed/mthood77/200/200',   primaryColor: USERS[3].color, photos: [{ url: 'https://picsum.photos/seed/mthood77/800/600',   caption: 'Snowfield above the treeline.',  uploader: USERS[3] }] },
  ],
}

export function getAlbumLocations(albumId: string): LocationPin[] {
  return ALBUM_LOCATIONS[albumId] ?? ALBUM_LOCATIONS.a1
}

// Aggregate every pin from every album for the global map
export function getAllLocations(): LocationPin[] {
  return Object.values(ALBUM_LOCATIONS).flat()
}

// One cluster per album — averaged lat/lng, all photos merged
export function getAlbumClusters(): AlbumCluster[] {
  return Object.entries(ALBUM_LOCATIONS).map(([albumId, pins]) => {
    const album = ALBUMS.find(a => a.id === albumId)
    const lat = pins.reduce((s, p) => s + p.lat, 0) / pins.length
    const lng = pins.reduce((s, p) => s + p.lng, 0) / pins.length
    return {
      albumId,
      albumName: album?.name ?? albumId,
      lat,
      lng,
      primaryThumb: pins[0].primaryThumb,
      primaryColor: pins[0].primaryColor,
      photos: pins.flatMap(p => p.photos),
    }
  })
}

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
