# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2024_12_19_191114) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_trgm"
  enable_extension "pgcrypto"
  enable_extension "plpgsql"
  enable_extension "unaccent"
  enable_extension "uuid-ossp"

  create_table "activities", id: :serial, force: :cascade do |t|
    t.string "trackable_type"
    t.integer "trackable_id"
    t.string "owner_type"
    t.integer "owner_id"
    t.string "key"
    t.jsonb "parameters", default: {}
    t.string "recipient_type"
    t.integer "recipient_id"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["owner_id", "owner_type"], name: "index_activities_on_owner_id_and_owner_type"
    t.index ["owner_type", "owner_id"], name: "index_activities_on_owner_type_and_owner_id"
    t.index ["recipient_id", "recipient_type"], name: "index_activities_on_recipient_id_and_recipient_type"
    t.index ["recipient_type", "recipient_id"], name: "index_activities_on_recipient_type_and_recipient_id"
    t.index ["trackable_id", "trackable_type"], name: "index_activities_on_trackable_id_and_trackable_type"
    t.index ["trackable_type", "trackable_id"], name: "index_activities_on_trackable_type_and_trackable_id"
  end

  create_table "addresses", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.string "address", null: false
    t.string "address_2"
    t.string "city"
    t.string "region"
    t.integer "country"
    t.string "postal"
    t.text "notes"
    t.uuid "category_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "contact_id"
    t.index ["category_id"], name: "index_addresses_on_category_id"
    t.index ["contact_id"], name: "index_addresses_on_contact_id"
  end

  create_table "agencies", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.jsonb "settings", default: {}
    t.string "slug", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["slug"], name: "index_agencies_on_slug", unique: true
  end

  create_table "calendar_customizations", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "customizer_type", null: false
    t.uuid "customizer_id", null: false
    t.jsonb "color_mappings", default: {}, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["color_mappings"], name: "index_calendar_customizations_on_color_mappings", using: :gin
    t.index ["customizer_type", "customizer_id"], name: "index_calendar_customizations_on_customizer"
  end

  create_table "calendar_event_exceptions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "calendar_event_id", null: false
    t.datetime "rescheduled", precision: nil
    t.datetime "cancelled", precision: nil
    t.datetime "starts_at"
    t.datetime "ends_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["calendar_event_id"], name: "index_calendar_event_exceptions_on_calendar_event_id"
  end

  create_table "calendar_events", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.datetime "starts_at"
    t.datetime "ends_at"
    t.uuid "parent_id"
    t.uuid "created_by_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_by_id"], name: "index_calendar_events_on_created_by_id"
    t.index ["parent_id"], name: "index_calendar_events_on_parent_id"
  end

  create_table "calendar_recurring_patterns", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.integer "recurring_type", null: false
    t.integer "offset", default: 1, null: false
    t.integer "max_occurrences"
    t.integer "end_date"
    t.integer "day_of_week"
    t.integer "week_of_month"
    t.integer "day_of_month"
    t.integer "month_of_year"
    t.uuid "calendar_event_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["calendar_event_id"], name: "index_calendar_recurring_patterns_on_calendar_event_id"
  end

  create_table "categories", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.string "categorizable_type", null: false
    t.string "slug", null: false
    t.uuid "parent_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name", "categorizable_type"], name: "index_categories_on_name_and_categorizable_type", unique: true
    t.index ["parent_id"], name: "index_categories_on_parent_id"
    t.index ["slug"], name: "index_categories_on_slug", unique: true
  end

  create_table "clients", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "person_id", null: false
    t.date "active_at"
    t.date "inactive_at"
    t.string "number"
    t.string "color"
    t.string "slug", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["person_id"], name: "index_clients_on_person_id"
    t.index ["slug"], name: "index_clients_on_slug", unique: true
  end

  create_table "contacts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "notes"
    t.string "contactable_type", null: false
    t.uuid "contactable_id", null: false
    t.uuid "primary_address_id"
    t.uuid "primary_email_id"
    t.uuid "primary_phone_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["contactable_type", "contactable_id"], name: "index_contacts_on_contactable"
    t.index ["primary_address_id"], name: "index_contacts_on_primary_address_id"
    t.index ["primary_email_id"], name: "index_contacts_on_primary_email_id"
    t.index ["primary_phone_id"], name: "index_contacts_on_primary_phone_id"
  end

  create_table "doctors", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "person_id", null: false
    t.string "slug", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["person_id"], name: "index_doctors_on_person_id"
    t.index ["slug"], name: "index_doctors_on_slug", unique: true
  end

  create_table "doctors_clients", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "doctor_id", null: false
    t.uuid "client_id", null: false
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["client_id"], name: "index_doctors_clients_on_client_id"
    t.index ["doctor_id"], name: "index_doctors_clients_on_doctor_id"
  end

  create_table "dosages", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.decimal "amount"
    t.integer "amount_unit"
    t.decimal "freq_amount"
    t.integer "freq_period"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "emails", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.string "email", null: false
    t.text "notes"
    t.uuid "category_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "contact_id"
    t.index ["category_id"], name: "index_emails_on_category_id"
    t.index ["contact_id"], name: "index_emails_on_contact_id"
  end

  create_table "employees", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "person_id", null: false
    t.date "active_at"
    t.date "inactive_at"
    t.string "number"
    t.string "color"
    t.string "slug", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["person_id"], name: "index_employees_on_person_id"
    t.index ["slug"], name: "index_employees_on_slug", unique: true
  end

  create_table "employees_job_titles", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.date "starts_at", null: false
    t.date "ends_at"
    t.uuid "employee_id", null: false
    t.uuid "job_title_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["employee_id"], name: "index_employees_job_titles_on_employee_id"
    t.index ["job_title_id"], name: "index_employees_job_titles_on_job_title_id"
  end

  create_table "event_participants", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "calendar_event_id", null: false
    t.string "participant_type", null: false
    t.uuid "participant_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["calendar_event_id"], name: "index_event_participants_on_calendar_event_id"
    t.index ["participant_type", "participant_id"], name: "index_event_participants_on_participant"
  end

  create_table "friendly_id_slugs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "slug", null: false
    t.uuid "sluggable_id", null: false
    t.string "sluggable_type", limit: 50
    t.string "scope"
    t.datetime "created_at"
    t.index ["slug", "sluggable_type", "scope"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope", unique: true
    t.index ["slug", "sluggable_type"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type"
    t.index ["sluggable_type", "sluggable_id"], name: "index_friendly_id_slugs_on_sluggable_type_and_sluggable_id"
  end

  create_table "households", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.string "slug", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["slug"], name: "index_households_on_slug", unique: true
  end

  create_table "households_clients", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "household_id", null: false
    t.uuid "client_id", null: false
    t.date "starts_at"
    t.date "ends_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["client_id"], name: "index_households_clients_on_client_id"
    t.index ["household_id"], name: "index_households_clients_on_household_id"
  end

  create_table "identifications", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "identificationable_type", null: false
    t.uuid "identificationable_id", null: false
    t.integer "type"
    t.integer "number"
    t.text "notes"
    t.date "issued_at"
    t.date "expires_at"
    t.jsonb "extra_fields"
    t.uuid "category_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_identifications_on_category_id"
    t.index ["identificationable_type", "identificationable_id"], name: "index_identifications_on_identificationable"
  end

  create_table "incident_reports", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "occurred_at"
    t.datetime "reported_at"
    t.datetime "agency_notified_at"
    t.string "location"
    t.text "description"
    t.uuid "client_id", null: false
    t.uuid "reported_to_id", null: false
    t.uuid "reported_by_id", null: false
    t.uuid "category_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_incident_reports_on_category_id"
    t.index ["client_id"], name: "index_incident_reports_on_client_id"
    t.index ["reported_by_id"], name: "index_incident_reports_on_reported_by_id"
    t.index ["reported_to_id"], name: "index_incident_reports_on_reported_to_id"
  end

  create_table "job_titles", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.string "slug", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["slug"], name: "index_job_titles_on_slug", unique: true
  end

  create_table "medications", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.string "generic_name"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "pay_rates", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.integer "rate_cents", default: 0, null: false
    t.string "rate_currency", default: "USD", null: false
    t.integer "period", null: false
    t.text "notes"
    t.datetime "starts_at"
    t.datetime "ends_at"
    t.uuid "employee_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["employee_id"], name: "index_pay_rates_on_employee_id"
  end

  create_table "people", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "first_name"
    t.string "middle_name"
    t.string "last_name"
    t.string "nick_name"
    t.date "dob"
    t.jsonb "characteristics"
    t.uuid "user_id"
    t.string "slug", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["slug"], name: "index_people_on_slug", unique: true
    t.index ["user_id"], name: "index_people_on_user_id"
  end

  create_table "pg_search_documents", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "content"
    t.text "label"
    t.string "searchable_type"
    t.uuid "searchable_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["searchable_type", "searchable_id"], name: "index_pg_search_documents_on_searchable"
  end

  create_table "phones", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.string "number", null: false
    t.string "extension"
    t.text "notes"
    t.uuid "category_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "contact_id"
    t.index ["category_id"], name: "index_phones_on_category_id"
    t.index ["contact_id"], name: "index_phones_on_contact_id"
  end

  create_table "prescriptions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "medication_id", null: false
    t.uuid "client_id", null: false
    t.date "starts_at"
    t.date "ends_at"
    t.uuid "doctor_id", null: false
    t.uuid "dosage_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["client_id"], name: "index_prescriptions_on_client_id"
    t.index ["doctor_id"], name: "index_prescriptions_on_doctor_id"
    t.index ["dosage_id"], name: "index_prescriptions_on_dosage_id"
    t.index ["medication_id"], name: "index_prescriptions_on_medication_id"
  end

  create_table "roles", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.string "resource_type"
    t.uuid "resource_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name", "resource_type", "resource_id"], name: "index_roles_on_name_and_resource_type_and_resource_id"
    t.index ["resource_type", "resource_id"], name: "index_roles_on_resource"
  end

  create_table "shifts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "employee_id", null: false
    t.uuid "calendar_event_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["calendar_event_id"], name: "index_shifts_on_calendar_event_id"
    t.index ["employee_id"], name: "index_shifts_on_employee_id"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "email", null: false
    t.string "encrypted_password", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.integer "failed_attempts", default: 0, null: false
    t.string "unlock_token"
    t.datetime "locked_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "invitation_token"
    t.datetime "invitation_created_at"
    t.datetime "invitation_sent_at"
    t.datetime "invitation_accepted_at"
    t.integer "invitation_limit"
    t.string "invited_by_type"
    t.uuid "invited_by_id"
    t.integer "invitations_count", default: 0
    t.boolean "active", default: true, null: false
    t.string "time_zone", default: "America/Los_Angeles"
    t.jsonb "table_preferences", default: {}
    t.jsonb "user_preferences", default: {}
    t.string "slug", null: false
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["invitation_token"], name: "index_users_on_invitation_token", unique: true
    t.index ["invited_by_id"], name: "index_users_on_invited_by_id"
    t.index ["invited_by_type", "invited_by_id"], name: "index_users_on_invited_by"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["slug"], name: "index_users_on_slug", unique: true
    t.index ["table_preferences"], name: "index_users_on_table_preferences", using: :gin
    t.index ["unlock_token"], name: "index_users_on_unlock_token", unique: true
    t.index ["user_preferences"], name: "index_users_on_user_preferences", using: :gin
  end

  create_table "users_roles", id: false, force: :cascade do |t|
    t.uuid "user_id"
    t.uuid "role_id"
    t.index ["role_id"], name: "index_users_roles_on_role_id"
    t.index ["user_id", "role_id"], name: "index_users_roles_on_user_id_and_role_id"
    t.index ["user_id"], name: "index_users_roles_on_user_id"
  end

  create_table "vendors", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.text "notes"
    t.string "slug", null: false
    t.uuid "category_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_vendors_on_category_id"
    t.index ["slug"], name: "index_vendors_on_slug", unique: true
  end

  create_table "websites", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.string "url", null: false
    t.uuid "category_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "contact_id"
    t.index ["category_id"], name: "index_websites_on_category_id"
    t.index ["contact_id"], name: "index_websites_on_contact_id"
  end

  add_foreign_key "addresses", "categories"
  add_foreign_key "addresses", "contacts"
  add_foreign_key "calendar_event_exceptions", "calendar_events"
  add_foreign_key "calendar_events", "calendar_events", column: "parent_id"
  add_foreign_key "calendar_events", "users", column: "created_by_id"
  add_foreign_key "calendar_recurring_patterns", "calendar_events"
  add_foreign_key "categories", "categories", column: "parent_id"
  add_foreign_key "clients", "people"
  add_foreign_key "contacts", "addresses", column: "primary_address_id"
  add_foreign_key "contacts", "emails", column: "primary_email_id"
  add_foreign_key "contacts", "phones", column: "primary_phone_id"
  add_foreign_key "doctors", "people"
  add_foreign_key "doctors_clients", "clients"
  add_foreign_key "doctors_clients", "doctors"
  add_foreign_key "emails", "categories"
  add_foreign_key "emails", "contacts"
  add_foreign_key "employees", "people"
  add_foreign_key "employees_job_titles", "employees"
  add_foreign_key "employees_job_titles", "job_titles"
  add_foreign_key "event_participants", "calendar_events"
  add_foreign_key "households_clients", "clients"
  add_foreign_key "households_clients", "households"
  add_foreign_key "identifications", "categories"
  add_foreign_key "incident_reports", "categories"
  add_foreign_key "incident_reports", "clients"
  add_foreign_key "incident_reports", "people", column: "reported_by_id"
  add_foreign_key "incident_reports", "people", column: "reported_to_id"
  add_foreign_key "pay_rates", "employees"
  add_foreign_key "people", "users"
  add_foreign_key "phones", "categories"
  add_foreign_key "phones", "contacts"
  add_foreign_key "prescriptions", "clients"
  add_foreign_key "prescriptions", "doctors"
  add_foreign_key "prescriptions", "dosages"
  add_foreign_key "prescriptions", "medications"
  add_foreign_key "shifts", "calendar_events"
  add_foreign_key "shifts", "employees"
  add_foreign_key "vendors", "categories"
  add_foreign_key "websites", "categories"
  add_foreign_key "websites", "contacts"
end
