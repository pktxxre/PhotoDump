import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { UploadedPhoto } from '../lib/uploadPhoto'
import type { AlbumDayGroup } from '../data'

export type { UploadedPhoto }

function groupByDay(photos: UploadedPhoto[]): AlbumDayGroup[] {
  const map = new Map<string, UploadedPhoto[]>()

  for (const photo of photos) {
    const date = photo.dateTaken ?? photo.createdAt
    const key = date.toDateString()
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(photo)
  }

  return Array.from(map.entries()).map(([key, dayPhotos]) => {
    const date = new Date(key)
    const dateLabel = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
    return {
      dateLabel,
      location: '',
      photos: dayPhotos.map(p => ({
        id: p.id,
        thumb: p.url,
        uploader: {
          id: p.uploaderId ?? 'unknown',
          name: p.uploaderName,
          initials: p.uploaderName.slice(0, 2).toUpperCase(),
          color: '#4a6358',
          avatar: `https://i.pravatar.cc/80?u=${p.uploaderId ?? p.id}`,
        },
      })),
    }
  })
}

export function useAlbumPhotos(albumId: string) {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([])
  const [dayGroups, setDayGroups] = useState<AlbumDayGroup[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const { data } = await supabase
      .from('album_photos')
      .select('*')
      .eq('album_id', albumId)
      .order('date_taken', { ascending: true, nullsFirst: false })

    if (data) {
      const mapped: UploadedPhoto[] = data.map(row => ({
        id: row.id,
        url: row.url,
        uploaderName: row.uploader_name ?? 'Unknown',
        uploaderId: row.uploader_id,
        dateTaken: row.date_taken ? new Date(row.date_taken) : null,
        lat: row.lat ?? null,
        lng: row.lng ?? null,
        createdAt: new Date(row.created_at),
      }))
      setPhotos(mapped)
      setDayGroups(groupByDay(mapped))
    }
    setLoading(false)
  }, [albumId])

  useEffect(() => {
    fetch()

    const channel = supabase
      .channel(`album-photos-${albumId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'album_photos',
        filter: `album_id=eq.${albumId}`,
      }, () => fetch())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [albumId, fetch])

  return { photos, dayGroups, loading, refetch: fetch }
}
