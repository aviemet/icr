// TypesFromSerializers CacheKey 2867fe26c5b26ae27294a96018e9e7a8
//
// DO NOT MODIFY: This file was automatically generated by TypesFromSerializers.
import type PeoplePersisted from '../People/Persisted'

declare global {
  namespace Schema {
    interface ClientsPersisted {
      id: string
      active_at?: Date
      color?: string
      color_mappings: unknown
      created_at: Date
      inactive_at?: Date
      number?: string
      person: PeoplePersisted
      person_id: string
      slug: string
      updated_at: Date
    }
  }
}
