import { supabase } from './supabase'

export interface Album {
  id: string
  name: string
  coverUrl: string | null
  photoCount: number
  createdAt: Date
}

export async function fetchAlbums(): Promise<Album[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('albums')
    .select('id, name, cover_url, created_at')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  if (error || !data) return []

  // Get photo counts per album
  const ids = data.map(a => a.id)
  const { data: counts } = await supabase
    .from('album_photos')
    .select('album_id')
    .in('album_id', ids)

  const countMap = new Map<string, number>()
  for (const row of counts ?? []) {
    countMap.set(row.album_id, (countMap.get(row.album_id) ?? 0) + 1)
  }

  return data.map(a => ({
    id: a.id,
    name: a.name,
    coverUrl: a.cover_url ?? null,
    photoCount: countMap.get(a.id) ?? 0,
    createdAt: new Date(a.created_at),
  }))
}

export async function createAlbum(name: string): Promise<{ id: string } | { error: string }> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not logged in' }

  const { data, error } = await supabase
    .from('albums')
    .insert({ name: name || 'Untitled Trip', owner_id: user.id })
    .select('id')
    .single()

  if (error) return { error: error.message }
  if (!data) return { error: 'No data returned' }
  return { id: data.id }
}

export async function deleteAlbum(id: string): Promise<void> {
  await supabase.from('albums').delete().eq('id', id)
}

export async function renameAlbum(id: string, name: string): Promise<void> {
  await supabase.from('albums').update({ name }).eq('id', id)
}

export async function updateAlbumCover(albumId: string, coverUrl: string): Promise<void> {
  await supabase.from('albums').update({ cover_url: coverUrl }).eq('id', albumId)
}

export async function fetchAlbum(id: string): Promise<Album | null> {
  const { data, error } = await supabase
    .from('albums')
    .select('id, name, cover_url, created_at')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return {
    id: data.id,
    name: data.name,
    coverUrl: data.cover_url ?? null,
    photoCount: 0,
    createdAt: new Date(data.created_at),
  }
}
