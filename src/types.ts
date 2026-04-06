export interface User {
  id: string
  name: string
  initials: string
  avatar: string
  color: string
}

export interface PhotoLocation {
  lat: number
  lng: number
  name: string
}

export interface Photo {
  id: string
  url: string
  thumbnail: string
  caption: string
  uploaderId: string
  capturedAt: Date
  location: PhotoLocation
}

export interface DayGroup {
  dateLabel: string
  dayTitle: string
  photos: Photo[]
}

export interface UploadPhoto {
  id: string
  thumbnail: string
}

export interface QueueItem {
  filename: string
  status: 'uploading' | 'queued'
  progress?: number
}
