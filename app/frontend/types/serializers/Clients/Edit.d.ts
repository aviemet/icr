// TypesFromSerializers CacheKey 06aff3aea78a054e00101ff860def6c4
//
// DO NOT MODIFY: This file was automatically generated by TypesFromSerializers.
import type PeoplePersisted from '../People/Persisted'

declare global {
  namespace Schema {
    interface ClientsEdit {
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
