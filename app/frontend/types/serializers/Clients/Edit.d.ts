// TypesFromSerializers CacheKey 3e770fb00f1a287f0a8c14420fab2b0b
//
// DO NOT MODIFY: This file was automatically generated by TypesFromSerializers.
import type PeoplePersisted from '../People/Persisted'

declare global {
  namespace Schema {
    interface ClientsEdit {
      id: string
      active_at?: Date
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
