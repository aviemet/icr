// TypesFromSerializers CacheKey 566b1c4f996072f7a002b5e8ab85770f
//
// DO NOT MODIFY: This file was automatically generated by TypesFromSerializers.
import type PeopleShow from '../People/Show'

declare global {
  namespace Schema {
    interface ClientsShow {
      id: string
      active_at?: Date
      created_at: Date
      inactive_at?: Date
      number?: string
      person: PeopleShow
      person_id: string
      slug: string
      updated_at: Date
    }
  }
}
