// TypesFromSerializers CacheKey 5499e785b0f975a08a368c8708a2a39a
//
// DO NOT MODIFY: This file was automatically generated by TypesFromSerializers.
import type JobTitle from '../JobTitle'
import type PeoplePersisted from '../People/Persisted'

declare global {
  namespace Schema {
    interface EmployeesShow {
      id: unknown
      active_at: unknown
      color: unknown
      color_mappings: unknown
      created_at: unknown
      inactive_at: unknown
      job_title: JobTitle
      number: unknown
      person: PeoplePersisted
      person_id: unknown
      slug: unknown
      updated_at: unknown
    }
  }
}
