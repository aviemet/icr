// TypesFromSerializers CacheKey 55928ae00740fd1e9931dbb2b6c0251c
//
// DO NOT MODIFY: This file was automatically generated by TypesFromSerializers.
import type Person from '../Person'

declare global {
  namespace Schema {
    interface UsersEdit {
      id: unknown
      active: boolean
      created_at: string | Date
      email: string
      person: Person
      updated_at: string | Date
    }
  }
}
