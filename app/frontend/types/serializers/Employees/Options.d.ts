// TypesFromSerializers CacheKey 5f5c703d9c22efe2d53bbc8735a7b204
//
// DO NOT MODIFY: This file was automatically generated by TypesFromSerializers.
import type JobTitle from '../JobTitle'
import type PeoplePersisted from '../People/Persisted'

declare global {
  namespace Schema {
    interface EmployeesOptions {
      id: string
      active_at?: Date
      color?: string
      color_mappings: Record<string, Record<string, string>>
      created_at: Date
      first_name: string
      inactive_at?: Date
      job_title: JobTitle
      last_name: string
      name: string
      number?: string
      person: PeoplePersisted
      person_id: string
      slug: string
      updated_at: Date
    }
  }
}
