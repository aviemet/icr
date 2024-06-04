// TypesFromSerializers CacheKey 8ffc01888d0d44f35f86187907cafdb1
//
// DO NOT MODIFY: This file was automatically generated by TypesFromSerializers.
import type JobTitle from '../JobTitle'
import type Person from '../Person'

declare global {
  namespace Schema {
    interface EmployeesFormData {
      id?: number
      active_at?: string | Date
      inactive_at?: string | Date
      job_title: JobTitle
      number?: string
      person: Person
      person_id: number
    }
  }
}