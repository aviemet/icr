// TypesFromSerializers CacheKey 3e1a3482e96f7880002946c680112d62
//
// DO NOT MODIFY: This file was automatically generated by TypesFromSerializers.
import type PeoplePersisted from '../People/Persisted'

declare global {
  namespace Schema {
    interface ClientsIndex {
      id: string
      active_at?: string | Date
      created_at: string | Date
      inactive_at?: string | Date
      number?: string
      person: PeoplePersisted
      person_id: string
      slug: string
      updated_at: string | Date
    }
  }
}
