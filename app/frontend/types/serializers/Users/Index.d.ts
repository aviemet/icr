// TypesFromSerializers CacheKey 46a117aa5cf03d5f392bffaf218a0c07
//
// DO NOT MODIFY: This file was automatically generated by TypesFromSerializers.
import type PeoplePersisted from '../People/Persisted'

declare global {
  namespace Schema {
    interface UsersIndex {
      id: unknown
      active: unknown
      created_at: unknown
      email: unknown
      person: PeoplePersisted
      slug: unknown
      updated_at: unknown
    }
  }
}
