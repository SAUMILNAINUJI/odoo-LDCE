import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function useFavorite(entityType, entityId) {
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    api.get('/discovery/favorites').then(({ data }) => {
      if (active) setSaved(data.some(item => item.entity_type === entityType && Number(item.entity_id) === Number(entityId)))
    }).catch(() => {})
    return () => { active = false }
  }, [entityType, entityId])

  const toggleFavorite = async (event) => {
    event?.stopPropagation()
    setSaving(true)
    try {
      const { data } = await api.post('/discovery/favorites', { entity_type: entityType, entity_id: entityId })
      setSaved(data.saved)
    } finally {
      setSaving(false)
    }
  }

  return { saved, saving, toggleFavorite }
}
