// TypesFromSerializers CacheKey 6dc1b4d1018f8a7062ec3ddc54e34211
//
// DO NOT MODIFY: This file was automatically generated by TypesFromSerializers.
import type Category from './Category'

declare global {
  namespace Schema {
    interface Email {
      id?: string
      category: Category
      category_id: string
      contact_id?: string
      email: string
      name?: string
      notes?: string
    }
  }
}
