// TypesFromSerializers CacheKey 2fef3d2f57681806ec380eede8262982
//
// DO NOT MODIFY: This file was automatically generated by TypesFromSerializers.
import type TablePreferences from '../../TablePreferences'
import type UserPreferences from '../../UserPreferences'
import type PeoplePersisted from '../People/Persisted'
import type Role from '../Role'

declare global {
  namespace Schema {
    interface UsersInertiaShare {
      id: string
      active: boolean
      created_at: Date
      email: string
      person: PeoplePersisted
      roles: Role[]
      slug: string
      table_preferences: TablePreferences
      updated_at: Date
      user_preferences: UserPreferences
    }
  }
}
