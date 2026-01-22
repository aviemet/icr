
web    | Started GET "/clients/krissy-wisozk/schedule?date=2026-01-21&view=month" for 127.0.0.1 at 2026-01-21 08:49:52 -0800
web    | Processing by ClientsController#schedule as HTML
web    |   Parameters: {"date"=>"2026-01-21", "view"=>"month", "slug"=>"krissy-wisozk"}
web    |   User Load (0.3ms)  SELECT "users".* FROM "users" WHERE "users"."id" = $1 ORDER BY "users"."created_at" ASC, "users"."id" ASC LIMIT $2  [["id", "c21e4367-1920-4838-a226-9f51b4e35098"], ["LIMIT", 1]]
web    |   HABTM_Roles Load (0.1ms)  SELECT "users_roles".* FROM "users_roles" WHERE "users_roles"."user_id" = $1  [["user_id", "c21e4367-1920-4838-a226-9f51b4e35098"]]
web    |   Role Load (0.1ms)  SELECT "roles".* FROM "roles" WHERE "roles"."id" = $1  [["id", "7b3162dc-843e-4d03-98c3-864bc383826b"]]
web    |   Role Load (0.1ms)  SELECT "roles".* FROM "roles" INNER JOIN "users_roles" ON "roles"."id" = "users_roles"."role_id" WHERE "users_roles"."user_id" = $1 AND (((roles.name = $2) AND (roles.resource_type IS NULL) AND (roles.resource_id IS NULL)))  [["user_id", "c21e4367-1920-4838-a226-9f51b4e35098"], [nil, "admin"]]
web    |   ↳ app/policies/client_policy.rb:5:in `resolve'
web    |   Client Load (0.1ms)  SELECT "clients".* FROM "clients" WHERE "clients"."slug" = $1 LIMIT $2  [["slug", "krissy-wisozk"], ["LIMIT", 1]]
web    |   ↳ app/controllers/clients_controller.rb:59:in `schedule'
web    |   Person Load (0.1ms)  SELECT "people".* FROM "people" WHERE "people"."id" = $1 LIMIT $2  [["id", "7d98fd68-facd-48a9-994c-46b9c130e238"], ["LIMIT", 1]]
web    |   ↳ app/models/concerns/personable.rb:19:in `build_default_person'
web    |   Calendar::Customization Load (0.1ms)  SELECT "calendar_customizations".* FROM "calendar_customizations" WHERE "calendar_customizations"."customizer_type" = $1 AND "calendar_customizations"."customizer_id" = $2  [["customizer_type", "Client"], ["customizer_id", "c54e0a0b-6862-4162-91d9-cad3fff52f2d"]]
web    |   ↳ app/controllers/clients_controller.rb:59:in `schedule'
web    | DEPRECATION WARNING: To comply with the Inertia protocol, an empty errors hash `{errors: {}}` will be included to all responses by default starting with InertiaRails 4.0. To opt-in now, set `config.always_include_errors_hash = true`. To disable this warning, set it to `false`. (called from schedule at /media/avram/Dev/ruby/icr/app/controllers/clients_controller.rb:64)
web    |   Person Load (0.2ms)  SELECT "people".* FROM "people" WHERE "people"."user_id" = $1 LIMIT $2  [["user_id", "c21e4367-1920-4838-a226-9f51b4e35098"], ["LIMIT", 1]]
web    |   ↳ app/policies/application_policy.rb:22:in `initialize'
web    |   Employee Load (0.2ms)  SELECT "employees".* FROM "employees" WHERE "employees"."person_id" = $1 LIMIT $2  [["person_id", "3e7b66eb-1335-48f3-978f-5824b6e740a4"], ["LIMIT", 1]]
web    |   ↳ app/policies/application_policy.rb:23:in `initialize'
web    |   Client Load (0.1ms)  SELECT "clients".* FROM "clients" WHERE "clients"."person_id" = $1 LIMIT $2  [["person_id", "3e7b66eb-1335-48f3-978f-5824b6e740a4"], ["LIMIT", 1]]
web    |   ↳ app/policies/application_policy.rb:25:in `initialize'
web    |   CACHE Role Load (0.0ms)  SELECT "roles".* FROM "roles" INNER JOIN "users_roles" ON "roles"."id" = "users_roles"."role_id" WHERE "users_roles"."user_id" = $1 AND (((roles.name = $2) AND (roles.resource_type IS NULL) AND (roles.resource_id IS NULL)))  [["user_id", "c21e4367-1920-4838-a226-9f51b4e35098"], [nil, "admin"]]
web    |   ↳ app/policies/application_policy.rb:66:in `admin?'
web    |   CACHE Role Load (0.0ms)  SELECT "roles".* FROM "roles" INNER JOIN "users_roles" ON "roles"."id" = "users_roles"."role_id" WHERE "users_roles"."user_id" = $1 AND (((roles.name = $2) AND (roles.resource_type IS NULL) AND (roles.resource_id IS NULL)))  [["user_id", "c21e4367-1920-4838-a226-9f51b4e35098"], [nil, "admin"]]
web    |   ↳ app/policies/client_policy.rb:31:in `index?'
web    |   CACHE Role Load (0.0ms)  SELECT "roles".* FROM "roles" INNER JOIN "users_roles" ON "roles"."id" = "users_roles"."role_id" WHERE "users_roles"."user_id" = $1 AND (((roles.name = $2) AND (roles.resource_type IS NULL) AND (roles.resource_id IS NULL)))  [["user_id", "c21e4367-1920-4838-a226-9f51b4e35098"], [nil, "admin"]]
web    |   ↳ app/policies/client_policy.rb:79:in `new?'
web    |   CACHE Role Load (0.0ms)  SELECT "roles".* FROM "roles" INNER JOIN "users_roles" ON "roles"."id" = "users_roles"."role_id" WHERE "users_roles"."user_id" = $1 AND (((roles.name = $2) AND (roles.resource_type IS NULL) AND (roles.resource_id IS NULL)))  [["user_id", "c21e4367-1920-4838-a226-9f51b4e35098"], [nil, "admin"]]
web    |   ↳ app/policies/client_policy.rb:86:in `edit?'
web    |   CACHE Role Load (0.0ms)  SELECT "roles".* FROM "roles" INNER JOIN "users_roles" ON "roles"."id" = "users_roles"."role_id" WHERE "users_roles"."user_id" = $1 AND (((roles.name = $2) AND (roles.resource_type IS NULL) AND (roles.resource_id IS NULL)))  [["user_id", "c21e4367-1920-4838-a226-9f51b4e35098"], [nil, "admin"]]
web    |   ↳ app/policies/client_policy.rb:79:in `new?'
web    |   CACHE Role Load (0.0ms)  SELECT "roles".* FROM "roles" INNER JOIN "users_roles" ON "roles"."id" = "users_roles"."role_id" WHERE "users_roles"."user_id" = $1 AND (((roles.name = $2) AND (roles.resource_type IS NULL) AND (roles.resource_id IS NULL)))  [["user_id", "c21e4367-1920-4838-a226-9f51b4e35098"], [nil, "admin"]]
web    |   ↳ app/policies/client_policy.rb:86:in `edit?'
web    |   CACHE Role Load (0.0ms)  SELECT "roles".* FROM "roles" INNER JOIN "users_roles" ON "roles"."id" = "users_roles"."role_id" WHERE "users_roles"."user_id" = $1 AND (((roles.name = $2) AND (roles.resource_type IS NULL) AND (roles.resource_id IS NULL)))  [["user_id", "c21e4367-1920-4838-a226-9f51b4e35098"], [nil, "admin"]]
web    |   ↳ app/policies/client_policy.rb:47:in `show?'
web    |   CACHE Role Load (0.0ms)  SELECT "roles".* FROM "roles" INNER JOIN "users_roles" ON "roles"."id" = "users_roles"."role_id" WHERE "users_roles"."user_id" = $1 AND (((roles.name = $2) AND (roles.resource_type IS NULL) AND (roles.resource_id IS NULL)))  [["user_id", "c21e4367-1920-4838-a226-9f51b4e35098"], [nil, "admin"]]
web    |   ↳ app/policies/client_policy.rb:110:in `destroy?'
web    |   CACHE Role Load (0.0ms)  SELECT "roles".* FROM "roles" INNER JOIN "users_roles" ON "roles"."id" = "users_roles"."role_id" WHERE "users_roles"."user_id" = $1 AND (((roles.name = $2) AND (roles.resource_type IS NULL) AND (roles.resource_id IS NULL)))  [["user_id", "c21e4367-1920-4838-a226-9f51b4e35098"], [nil, "admin"]]
web    |   ↳ app/policies/client_policy.rb:63:in `schedule?'
web    |   CACHE Role Load (0.0ms)  SELECT "roles".* FROM "roles" INNER JOIN "users_roles" ON "roles"."id" = "users_roles"."role_id" WHERE "users_roles"."user_id" = $1 AND (((roles.name = $2) AND (roles.resource_type IS NULL) AND (roles.resource_id IS NULL)))  [["user_id", "c21e4367-1920-4838-a226-9f51b4e35098"], [nil, "admin"]]
web    |   ↳ app/policies/application_policy.rb:66:in `admin?'
web    |   CACHE Role Load (0.0ms)  SELECT "roles".* FROM "roles" INNER JOIN "users_roles" ON "roles"."id" = "users_roles"."role_id" WHERE "users_roles"."user_id" = $1 AND (((roles.name = $2) AND (roles.resource_type IS NULL) AND (roles.resource_id IS NULL)))  [["user_id", "c21e4367-1920-4838-a226-9f51b4e35098"], [nil, "admin"]]
web    |   ↳ app/policies/application_policy.rb:66:in `admin?'
web    |   CACHE Role Load (0.0ms)  SELECT "roles".* FROM "roles" INNER JOIN "users_roles" ON "roles"."id" = "users_roles"."role_id" WHERE "users_roles"."user_id" = $1 AND (((roles.name = $2) AND (roles.resource_type IS NULL) AND (roles.resource_id IS NULL)))  [["user_id", "c21e4367-1920-4838-a226-9f51b4e35098"], [nil, "admin"]]
web    |   ↳ app/policies/application_policy.rb:66:in `admin?'
web    |   CACHE Role Load (0.0ms)  SELECT "roles".* FROM "roles" INNER JOIN "users_roles" ON "roles"."id" = "users_roles"."role_id" WHERE "users_roles"."user_id" = $1 AND (((roles.name = $2) AND (roles.resource_type IS NULL) AND (roles.resource_id IS NULL)))  [["user_id", "c21e4367-1920-4838-a226-9f51b4e35098"], [nil, "admin"]]
web    |   ↳ app/policies/application_policy.rb:66:in `admin?'
web    |   CACHE Role Load (0.0ms)  SELECT "roles".* FROM "roles" INNER JOIN "users_roles" ON "roles"."id" = "users_roles"."role_id" WHERE "users_roles"."user_id" = $1 AND (((roles.name = $2) AND (roles.resource_type IS NULL) AND (roles.resource_id IS NULL)))  [["user_id", "c21e4367-1920-4838-a226-9f51b4e35098"], [nil, "admin"]]
web    |   ↳ app/policies/application_policy.rb:66:in `admin?'
web    | Skipping permissions for PayrollPolicy: undefined method `new' for module Payroll
web    |   CACHE Role Load (0.0ms)  SELECT "roles".* FROM "roles" INNER JOIN "users_roles" ON "roles"."id" = "users_roles"."role_id" WHERE "users_roles"."user_id" = $1 AND (((roles.name = $2) AND (roles.resource_type IS NULL) AND (roles.resource_id IS NULL)))  [["user_id", "c21e4367-1920-4838-a226-9f51b4e35098"], [nil, "admin"]]
web    |   ↳ app/policies/application_policy.rb:66:in `admin?'
web    |   CACHE Role Load (0.0ms)  SELECT "roles".* FROM "roles" INNER JOIN "users_roles" ON "roles"."id" = "users_roles"."role_id" WHERE "users_roles"."user_id" = $1 AND (((roles.name = $2) AND (roles.resource_type IS NULL) AND (roles.resource_id IS NULL)))  [["user_id", "c21e4367-1920-4838-a226-9f51b4e35098"], [nil, "admin"]]
web    |   ↳ app/policies/application_policy.rb:66:in `admin?'
web    |   CACHE Role Load (0.0ms)  SELECT "roles".* FROM "roles" INNER JOIN "users_roles" ON "roles"."id" = "users_roles"."role_id" WHERE "users_roles"."user_id" = $1 AND (((roles.name = $2) AND (roles.resource_type IS NULL) AND (roles.resource_id IS NULL)))  [["user_id", "c21e4367-1920-4838-a226-9f51b4e35098"], [nil, "admin"]]
web    |   ↳ app/policies/application_policy.rb:66:in `admin?'
web    |   CACHE Role Load (0.0ms)  SELECT "roles".* FROM "roles" INNER JOIN "users_roles" ON "roles"."id" = "users_roles"."role_id" WHERE "users_roles"."user_id" = $1 AND (((roles.name = $2) AND (roles.resource_type IS NULL) AND (roles.resource_id IS NULL)))  [["user_id", "c21e4367-1920-4838-a226-9f51b4e35098"], [nil, "admin"]]
web    |   ↳ app/policies/application_policy.rb:66:in `admin?'
web    |   CACHE Role Load (0.0ms)  SELECT "roles".* FROM "roles" INNER JOIN "users_roles" ON "roles"."id" = "users_roles"."role_id" WHERE "users_roles"."user_id" = $1 AND (((roles.name = $2) AND (roles.resource_type IS NULL) AND (roles.resource_id IS NULL)))  [["user_id", "c21e4367-1920-4838-a226-9f51b4e35098"], [nil, "admin"]]
web    |   ↳ app/policies/application_policy.rb:66:in `admin?'
web    |   CACHE Role Load (0.0ms)  SELECT "roles".* FROM "roles" INNER JOIN "users_roles" ON "roles"."id" = "users_roles"."role_id" WHERE "users_roles"."user_id" = $1 AND (((roles.name = $2) AND (roles.resource_type IS NULL) AND (roles.resource_id IS NULL)))  [["user_id", "c21e4367-1920-4838-a226-9f51b4e35098"], [nil, "admin"]]
web    |   ↳ app/models/person.rb:67:in `agency_role'
web    |   Employee Load (0.2ms)  SELECT "employees".* FROM "employees" WHERE "employees"."person_id" = $1 LIMIT $2  [["person_id", "7d98fd68-facd-48a9-994c-46b9c130e238"], ["LIMIT", 1]]
web    |   ↳ app/models/person.rb:63:in `agency_role'
web    |   Contact Load (0.2ms)  SELECT "contacts".* FROM "contacts" WHERE "contacts"."contactable_id" = $1 AND "contacts"."contactable_type" = $2 LIMIT $3  [["contactable_id", "7d98fd68-facd-48a9-994c-46b9c130e238"], ["contactable_type", "Person"], ["LIMIT", 1]]
web    |   ↳ lib/renderable.rb:3:in `render'
web    |   Contact::Address Load (0.1ms)  SELECT "addresses".* FROM "addresses" WHERE "addresses"."contact_id" = $1  [["contact_id", "4514d7cc-a5c1-4e7e-b515-eec62ecb3430"]]
web    |   ↳ lib/renderable.rb:3:in `render'
web    |   Category Load (0.1ms)  SELECT "categories".* FROM "categories" WHERE "categories"."id" = $1 LIMIT $2  [["id", "75eef2d4-4c65-45a9-8074-847333ecd482"], ["LIMIT", 1]]
web    |   ↳ lib/renderable.rb:3:in `render'
web    |   Contact::Email Load (0.1ms)  SELECT "emails".* FROM "emails" WHERE "emails"."contact_id" = $1  [["contact_id", "4514d7cc-a5c1-4e7e-b515-eec62ecb3430"]]
web    |   ↳ lib/renderable.rb:3:in `render'
web    |   Category Load (0.1ms)  SELECT "categories".* FROM "categories" WHERE "categories"."id" = $1 LIMIT $2  [["id", "2821ee11-bf16-495d-a788-aafd16038777"], ["LIMIT", 1]]
web    |   ↳ lib/renderable.rb:3:in `render'
web    |   Contact::Phone Load (0.1ms)  SELECT "phones".* FROM "phones" WHERE "phones"."contact_id" = $1  [["contact_id", "4514d7cc-a5c1-4e7e-b515-eec62ecb3430"]]
web    |   ↳ lib/renderable.rb:3:in `render'
web    |   Category Load (0.1ms)  SELECT "categories".* FROM "categories" WHERE "categories"."id" = $1 LIMIT $2  [["id", "47a966c3-4ac5-4a8f-b9f9-0a6c1c57165c"], ["LIMIT", 1]]
web    |   ↳ lib/renderable.rb:3:in `render'
web    |   Calendar::Event Load (0.4ms)  SELECT "calendar_events".* FROM "calendar_events" INNER JOIN "event_participants" ON "calendar_events"."id" = "event_participants"."calendar_event_id" WHERE "event_participants"."participant_id" = $1 AND "event_participants"."participant_type" = $2 AND ((starts_at < $3 AND ends_at > $4) OR (all_day = TRUE AND starts_at < $5 AND ends_at > $6))  [["participant_id", "c54e0a0b-6862-4162-91d9-cad3fff52f2d"], ["participant_type", "Client"], [nil, "2026-02-08 07:59:59.999999"], [nil, "2025-12-28 08:00:00"], [nil, "2026-02-08 07:59:59.999999"], [nil, "2025-12-28 08:00:00"]]
web    |   ↳ lib/renderable.rb:12:in `render'
web    |   Calendar::RecurringPattern Load (0.3ms)  SELECT "calendar_recurring_patterns".* FROM "calendar_recurring_patterns" WHERE "calendar_recurring_patterns"."calendar_event_id" IN ($1, $2)  [["calendar_event_id", "20eab579-91c4-4624-b3bf-f72832255d43"], ["calendar_event_id", "723fb4bd-3128-45cd-98dc-8ede6755d05f"]]
web    |   ↳ lib/renderable.rb:12:in `render'
web    |   EventParticipant Load (0.2ms)  SELECT "event_participants".* FROM "event_participants" WHERE "event_participants"."calendar_event_id" IN ($1, $2)  [["calendar_event_id", "20eab579-91c4-4624-b3bf-f72832255d43"], ["calendar_event_id", "723fb4bd-3128-45cd-98dc-8ede6755d05f"]]
web    |   ↳ lib/renderable.rb:12:in `render'
web    |   Shift Load (0.1ms)  SELECT "shifts".* FROM "shifts" WHERE "shifts"."calendar_event_id" IN ($1, $2)  [["calendar_event_id", "20eab579-91c4-4624-b3bf-f72832255d43"], ["calendar_event_id", "723fb4bd-3128-45cd-98dc-8ede6755d05f"]]
web    |   ↳ lib/renderable.rb:12:in `render'
web    |   Employee Load (0.3ms)  SELECT "employees".* FROM "employees" WHERE "employees"."id" IN ($1, $2)  [["id", "3320fc0b-a89c-4651-a928-625aa7f7c6df"], ["id", "f7556d91-15de-46b2-9b30-afad756fb075"]]
web    |   ↳ lib/renderable.rb:12:in `render'
web    |   Person Load (0.1ms)  SELECT "people".* FROM "people" WHERE "people"."id" = $1 LIMIT $2  [["id", "5c9f8f0e-18ef-4aba-919c-303481dfe612"], ["LIMIT", 1]]
web    |   ↳ app/models/concerns/personable.rb:19:in `build_default_person'
web    |   Person Load (0.1ms)  SELECT "people".* FROM "people" WHERE "people"."id" = $1 LIMIT $2  [["id", "9a88b813-e4df-42f4-ac19-80ffd651f367"], ["LIMIT", 1]]
web    |   ↳ app/models/concerns/personable.rb:19:in `build_default_person'
web    |   Employee::EmployeesJobTitle Load (0.2ms)  SELECT "employees_job_titles".* FROM "employees_job_titles" WHERE (starts_at <= $1 AND (ends_at IS NULL OR ends_at >= $2)) AND "employees_job_titles"."employee_id" IN ($3, $4)  [[nil, "2026-01-21 16:49:53.376100"], [nil, "2026-01-21 16:49:53.376123"], ["employee_id", "f7556d91-15de-46b2-9b30-afad756fb075"], ["employee_id", "3320fc0b-a89c-4651-a928-625aa7f7c6df"]]
web    |   ↳ lib/renderable.rb:12:in `render'
web    |   Calendar::Customization Load (0.1ms)  SELECT "calendar_customizations".* FROM "calendar_customizations" WHERE "calendar_customizations"."customizer_type" = $1 AND "calendar_customizations"."customizer_id" IN ($2, $3)  [["customizer_type", "Employee"], ["customizer_id", "f7556d91-15de-46b2-9b30-afad756fb075"], ["customizer_id", "3320fc0b-a89c-4651-a928-625aa7f7c6df"]]
web    |   ↳ lib/renderable.rb:12:in `render'
web    |   Employee::JobTitle Load (0.1ms)  SELECT "job_titles".* FROM "job_titles" WHERE "job_titles"."id" IN ($1, $2)  [["id", "83b1e38a-1685-42f0-8fd5-2619e2359b93"], ["id", "f59d07c2-0aab-4fdc-9ff3-dee63eeab488"]]
web    |   ↳ lib/renderable.rb:12:in `render'
web    |   User Load (0.1ms)  SELECT "users".* FROM "users" WHERE "users"."id" = $1 LIMIT $2  [["id", "746fafc8-193e-40a2-a926-fe8f7d50105d"], ["LIMIT", 1]]
web    |   ↳ app/models/person.rb:83:in `login_enabled?'
web    |   HABTM_Roles Load (0.1ms)  SELECT "users_roles".* FROM "users_roles" WHERE "users_roles"."user_id" = $1  [["user_id", "746fafc8-193e-40a2-a926-fe8f7d50105d"]]
web    |   ↳ app/models/person.rb:83:in `login_enabled?'
web    |   User Load (0.1ms)  SELECT "users".* FROM "users" WHERE "users"."id" = $1 LIMIT $2  [["id", "6af99844-9fb8-48aa-9c48-c9624975241a"], ["LIMIT", 1]]
web    |   ↳ app/models/person.rb:83:in `login_enabled?'
web    |   HABTM_Roles Load (0.1ms)  SELECT "users_roles".* FROM "users_roles" WHERE "users_roles"."user_id" = $1  [["user_id", "6af99844-9fb8-48aa-9c48-c9624975241a"]]
web    |   ↳ app/models/person.rb:83:in `login_enabled?'
web    |   Rendering layout layouts/application.html.erb
web    |   Rendering /home/avram/.rbenv/versions/3.3.4/lib/ruby/gems/3.3.0/gems/inertia_rails-3.16.0/app/views/inertia.html.erb within layouts/application
web    |   Rendered /home/avram/.rbenv/versions/3.3.4/lib/ruby/gems/3.3.0/gems/inertia_rails-3.16.0/app/views/inertia.html.erb within layouts/application (Duration: 0.6ms | GC: 0.0ms)
web    |   Rendered layout layouts/application.html.erb (Duration: 2.0ms | GC: 0.6ms)
web    | Completed 200 OK in 154ms (Views: 143.8ms | ActiveRecord: 11.6ms (52 queries, 0 cached) | GC: 14.1ms)
web    | 
web    | 
web    | Started GET "/.well-known/appspecific/com.chrome.devtools.json" for 127.0.0.1 at 2026-01-21 08:49:52 -0800
web    |   
web    | ActionController::RoutingError (No route matches [GET] "/.well-known/appspecific/com.chrome.devtools.json"):
web    |   
web    | Started GET "/api/clients/krissy-wisozk/schedule?date=2026-01-21&view=month&timezone=America%2FLos_Angeles" for 127.0.0.1 at 2026-01-21 08:49:54 -0800
web    | Processing by Api::ClientsController#schedule as HTML
web    |   Parameters: {"date"=>"2026-01-21", "view"=>"month", "timezone"=>"America/Los_Angeles", "param"=>:slug, "slug"=>"krissy-wisozk"}
web    |   User Load (0.3ms)  SELECT "users".* FROM "users" WHERE "users"."id" = $1 ORDER BY "users"."created_at" ASC, "users"."id" ASC LIMIT $2  [["id", "c21e4367-1920-4838-a226-9f51b4e35098"], ["LIMIT", 1]]
web    |   HABTM_Roles Load (0.1ms)  SELECT "users_roles".* FROM "users_roles" WHERE "users_roles"."user_id" = $1  [["user_id", "c21e4367-1920-4838-a226-9f51b4e35098"]]
web    |   Role Load (0.1ms)  SELECT "roles".* FROM "roles" WHERE "roles"."id" = $1  [["id", "7b3162dc-843e-4d03-98c3-864bc383826b"]]
web    |   Client Load (0.1ms)  SELECT "clients".* FROM "clients" WHERE "clients"."slug" = $1 LIMIT $2  [["slug", "krissy-wisozk"], ["LIMIT", 1]]
web    |   ↳ app/controllers/api/clients_controller.rb:14:in `schedule'
web    |   Person Load (0.1ms)  SELECT "people".* FROM "people" WHERE "people"."id" = $1 LIMIT $2  [["id", "7d98fd68-facd-48a9-994c-46b9c130e238"], ["LIMIT", 1]]
web    |   ↳ app/models/concerns/personable.rb:19:in `build_default_person'
web    |   Calendar::Event Load (0.4ms)  SELECT "calendar_events".* FROM "calendar_events" INNER JOIN "event_participants" ON "calendar_events"."id" = "event_participants"."calendar_event_id" WHERE "event_participants"."participant_id" = $1 AND "event_participants"."participant_type" = $2 AND ((starts_at < $3 AND ends_at > $4) OR (all_day = TRUE AND starts_at < $5 AND ends_at > $6))  [["participant_id", "c54e0a0b-6862-4162-91d9-cad3fff52f2d"], ["participant_type", "Client"], [nil, "2026-02-08 07:59:59.999999"], [nil, "2025-12-28 08:00:00"], [nil, "2026-02-08 07:59:59.999999"], [nil, "2025-12-28 08:00:00"]]
web    |   ↳ lib/renderable.rb:12:in `render'
web    |   Calendar::RecurringPattern Load (0.2ms)  SELECT "calendar_recurring_patterns".* FROM "calendar_recurring_patterns" WHERE "calendar_recurring_patterns"."calendar_event_id" IN ($1, $2)  [["calendar_event_id", "20eab579-91c4-4624-b3bf-f72832255d43"], ["calendar_event_id", "723fb4bd-3128-45cd-98dc-8ede6755d05f"]]
web    |   ↳ lib/renderable.rb:12:in `render'
web    |   Shift Load (0.2ms)  SELECT "shifts".* FROM "shifts" WHERE "shifts"."calendar_event_id" IN ($1, $2)  [["calendar_event_id", "20eab579-91c4-4624-b3bf-f72832255d43"], ["calendar_event_id", "723fb4bd-3128-45cd-98dc-8ede6755d05f"]]
web    |   ↳ lib/renderable.rb:12:in `render'
web    |   Employee Load (0.1ms)  SELECT "employees".* FROM "employees" WHERE "employees"."id" IN ($1, $2)  [["id", "3320fc0b-a89c-4651-a928-625aa7f7c6df"], ["id", "f7556d91-15de-46b2-9b30-afad756fb075"]]
web    |   ↳ lib/renderable.rb:12:in `render'
web    |   Person Load (0.1ms)  SELECT "people".* FROM "people" WHERE "people"."id" = $1 LIMIT $2  [["id", "5c9f8f0e-18ef-4aba-919c-303481dfe612"], ["LIMIT", 1]]
web    |   ↳ app/models/concerns/personable.rb:19:in `build_default_person'
web    |   Person Load (0.1ms)  SELECT "people".* FROM "people" WHERE "people"."id" = $1 LIMIT $2  [["id", "9a88b813-e4df-42f4-ac19-80ffd651f367"], ["LIMIT", 1]]
web    |   ↳ app/models/concerns/personable.rb:19:in `build_default_person'
web    |   Employee::EmployeesJobTitle Load (0.2ms)  SELECT "employees_job_titles".* FROM "employees_job_titles" WHERE (starts_at <= $1 AND (ends_at IS NULL OR ends_at >= $2)) AND "employees_job_titles"."employee_id" IN ($3, $4)  [[nil, "2026-01-21 16:49:55.298697"], [nil, "2026-01-21 16:49:55.298721"], ["employee_id", "f7556d91-15de-46b2-9b30-afad756fb075"], ["employee_id", "3320fc0b-a89c-4651-a928-625aa7f7c6df"]]
web    |   ↳ lib/renderable.rb:12:in `render'
web    |   Calendar::Customization Load (0.2ms)  SELECT "calendar_customizations".* FROM "calendar_customizations" WHERE "calendar_customizations"."customizer_type" = $1 AND "calendar_customizations"."customizer_id" IN ($2, $3)  [["customizer_type", "Employee"], ["customizer_id", "f7556d91-15de-46b2-9b30-afad756fb075"], ["customizer_id", "3320fc0b-a89c-4651-a928-625aa7f7c6df"]]
web    |   ↳ lib/renderable.rb:12:in `render'
web    |   Employee::JobTitle Load (0.1ms)  SELECT "job_titles".* FROM "job_titles" WHERE "job_titles"."id" IN ($1, $2)  [["id", "83b1e38a-1685-42f0-8fd5-2619e2359b93"], ["id", "f59d07c2-0aab-4fdc-9ff3-dee63eeab488"]]
web    |   ↳ lib/renderable.rb:12:in `render'
web    |   User Load (0.1ms)  SELECT "users".* FROM "users" WHERE "users"."id" = $1 LIMIT $2  [["id", "746fafc8-193e-40a2-a926-fe8f7d50105d"], ["LIMIT", 1]]
web    |   ↳ app/models/person.rb:83:in `login_enabled?'
web    |   HABTM_Roles Load (0.1ms)  SELECT "users_roles".* FROM "users_roles" WHERE "users_roles"."user_id" = $1  [["user_id", "746fafc8-193e-40a2-a926-fe8f7d50105d"]]
web    |   ↳ app/models/person.rb:83:in `login_enabled?'
web    |   EventParticipant Load (0.1ms)  SELECT "event_participants".* FROM "event_participants" WHERE "event_participants"."calendar_event_id" = $1  [["calendar_event_id", "20eab579-91c4-4624-b3bf-f72832255d43"]]
web    |   ↳ lib/renderable.rb:12:in `render'
web    |   User Load (0.1ms)  SELECT "users".* FROM "users" WHERE "users"."id" = $1 LIMIT $2  [["id", "6af99844-9fb8-48aa-9c48-c9624975241a"], ["LIMIT", 1]]
web    |   ↳ app/models/person.rb:83:in `login_enabled?'
web    |   HABTM_Roles Load (0.1ms)  SELECT "users_roles".* FROM "users_roles" WHERE "users_roles"."user_id" = $1  [["user_id", "6af99844-9fb8-48aa-9c48-c9624975241a"]]
web    |   ↳ app/models/person.rb:83:in `login_enabled?'
web    |   EventParticipant Load (0.1ms)  SELECT "event_participants".* FROM "event_participants" WHERE "event_participants"."calendar_event_id" = $1  [["calendar_event_id", "723fb4bd-3128-45cd-98dc-8ede6755d05f"]]
web    |   ↳ lib/renderable.rb:12:in `render'
web    | Completed 200 OK in 26ms (Views: 0.4ms | ActiveRecord: 3.3ms (20 queries, 0 cached) | GC: 0.3ms)
web    | 
web    | 
