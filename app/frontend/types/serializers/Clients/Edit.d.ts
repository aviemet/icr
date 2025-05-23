// TypesFromSerializers CacheKey ced8c38d4da5b11e8f3bdae6e0d7fda5
//
// DO NOT MODIFY: This file was automatically generated by TypesFromSerializers.
import type PeoplePersisted from '../People/Persisted'

declare global {
  namespace Schema {
    interface ClientsEdit {
      id: string
      active_at?: Date
      color?: string
      color_mappings: Record<string, Record<string, string>>
      created_at: Date
      first_name: string
      full_name: string
      inactive_at?: Date
      last_name: string
      name: string
      number?: string
      person: PeoplePersisted
      person_id: string
      slug: string
      updated_at: Date
    }
  }
}
