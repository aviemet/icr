// TypesFromSerializers CacheKey 07028bfeaaa4d0aa07809a8666477c17
//
// DO NOT MODIFY: This file was automatically generated by TypesFromSerializers.
import type PeoplePersisted from '../People/Persisted'

declare global {
  namespace Schema {
    interface UsersPersisted {
      id: string
      active: boolean
      created_at: Date
      email: string
      person: PeoplePersisted
      slug: string
      updated_at: Date
    }
  }
}
