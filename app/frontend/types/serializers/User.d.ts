// TypesFromSerializers CacheKey 88652ba5ee206883f23d2e48f04340a4
//
// DO NOT MODIFY: This file was automatically generated by TypesFromSerializers.
import type Person from './Person'

declare global {
  namespace Schema {
    interface User {
      id?: number
      active: boolean
      email: string
      person: Person
    }
  }
}
