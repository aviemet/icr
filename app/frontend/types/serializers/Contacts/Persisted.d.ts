// TypesFromSerializers CacheKey a35f35bd92b74e5ec4e0cfb13a8e2035
//
// DO NOT MODIFY: This file was automatically generated by TypesFromSerializers.
import type Address from '../Address'
import type Email from '../Email'
import type Phone from '../Phone'

declare global {
  namespace Schema {
    interface ContactsPersisted {
      id: string
      addresses: Address[]
      contactable_id: string
      contactable_type: string
      created_at: string | Date
      emails: Email[]
      notes?: string
      phones: Phone[]
      primary_address_id?: string
      primary_email_id?: string
      primary_phone_id?: string
      updated_at: string | Date
    }
  }
}
