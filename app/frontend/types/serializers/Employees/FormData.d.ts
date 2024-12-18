// TypesFromSerializers CacheKey 61d80bab7e87bce0ffa5d796f8ff63bf
//
// DO NOT MODIFY: This file was automatically generated by TypesFromSerializers.
import type JobTitle from '../JobTitle'
import type Person from '../Person'

declare global {
  namespace Schema {
    interface EmployeesFormData {
      id?: string
      slug?: string
      active_at?: Date
      color?: string
      color_mappings: unknown
      inactive_at?: Date
      job_title: JobTitle
      number?: string
      person: Person
      person_id: string
    }
  }
}
