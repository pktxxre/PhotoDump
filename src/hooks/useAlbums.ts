import { useState, useEffect, useCallback } from 'react'
import { fetchAlbums, deleteAlbum, renameAlbum } from '../lib/albums'
import type { Album } from '../lib/albums'

export type { Album }

export function useAlbums() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await fetchAlbums()
    setAlbums(data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function remove(id: string) {
    setAlbums(prev => prev.filter(a => a.id !== id))
    await deleteAlbum(id)
  }

  async function rename(id: string, name: string) {
    setAlbums(prev => prev.map(a => a.id === id ? { ...a, name } : a))
    await renameAlbum(id, name)
  }

  return { albums, loading, reload: load, remove, rename }
}
