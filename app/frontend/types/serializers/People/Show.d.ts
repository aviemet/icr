// TypesFromSerializers CacheKey 6f6e7fb3c951e0bae72dcb37e183fadb
//
// DO NOT MODIFY: This file was automatically generated by TypesFromSerializers.
import type ContactsPersisted from '../Contacts/Persisted'

declare global {
  namespace Schema {
    interface PeopleShow {
      id: string
      contact: ContactsPersisted
      created_at: Date
      first_name?: string
      last_name?: string
      middle_name?: string
      name: string
      nick_name?: string
      slug: string
      updated_at: Date
      user_id?: string
    }
  }
}
