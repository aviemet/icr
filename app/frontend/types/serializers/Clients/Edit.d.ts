// TypesFromSerializers CacheKey 94dd07db884e93586ec2065d446af261
//
// DO NOT MODIFY: This file was automatically generated by TypesFromSerializers.
import type PeoplePersisted from '../People/Persisted'

declare global {
  namespace Schema {
    interface ClientsEdit {
      id: unknown
      active_at: unknown
      color: unknown
      color_mappings: unknown
      created_at: unknown
      inactive_at: unknown
      number: unknown
      person: PeoplePersisted
      person_id: unknown
      slug: unknown
      updated_at: unknown
    }
  }
}
