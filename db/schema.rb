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

ActiveRecord::Schema[7.1].define(version: 2024_06_04_063031) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_trgm"
  enable_extension "plpgsql"
  enable_extension "unaccent"

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

  create_table "addresses", force: :cascade do |t|
    t.string "title"
    t.string "address"
    t.string "address_2"
    t.string "city"
    t.string "region"
    t.integer "country"
    t.string "postal"
    t.text "notes"
    t.bigint "contact_id", null: false
    t.bigint "category_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_addresses_on_category_id"
    t.index ["contact_id"], name: "index_addresses_on_contact_id"
  end

  create_table "calendar_event_exceptions", force: :cascade do |t|
    t.bigint "calendar_event_id", null: false
    t.datetime "rescheduled", precision: nil
    t.datetime "cancelled", precision: nil
    t.datetime "starts_at"
    t.datetime "ends_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["calendar_event_id"], name: "index_calendar_event_exceptions_on_calendar_event_id"
  end

  create_table "calendar_events", force: :cascade do |t|
    t.datetime "starts_at"
    t.datetime "ends_at"
    t.bigint "parent_id"
    t.bigint "recurring_pattern_id"
    t.bigint "created_by_id", null: false
    t.string "schedulable_type"
    t.bigint "schedulable_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_by_id"], name: "index_calendar_events_on_created_by_id"
    t.index ["parent_id"], name: "index_calendar_events_on_parent_id"
    t.index ["recurring_pattern_id"], name: "index_calendar_events_on_recurring_pattern_id"
    t.index ["schedulable_type", "schedulable_id"], name: "index_calendar_events_on_schedulable"
  end

  create_table "categories", force: :cascade do |t|
    t.string "categorizable_type", null: false
    t.string "name"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name", "categorizable_type"], name: "index_categories_on_name_and_categorizable_type", unique: true
  end

  create_table "clients", force: :cascade do |t|
    t.bigint "person_id", null: false
    t.date "active_at"
    t.date "inactive_at"
    t.string "number"
    t.string "color"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["person_id"], name: "index_clients_on_person_id"
  end

  create_table "contacts", force: :cascade do |t|
    t.text "notes"
    t.string "contactable_type", null: false
    t.bigint "contactable_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "primary_address_id"
    t.bigint "primary_email_id"
    t.bigint "primary_phone_id"
    t.index ["contactable_type", "contactable_id"], name: "index_contacts_on_contactable"
    t.index ["primary_address_id"], name: "index_contacts_on_primary_address_id"
    t.index ["primary_email_id"], name: "index_contacts_on_primary_email_id"
    t.index ["primary_phone_id"], name: "index_contacts_on_primary_phone_id"
  end

  create_table "doctors", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "doctors_clients", force: :cascade do |t|
    t.bigint "doctor_id", null: false
    t.bigint "client_id", null: false
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["client_id"], name: "index_doctors_clients_on_client_id"
    t.index ["doctor_id"], name: "index_doctors_clients_on_doctor_id"
  end

  create_table "dosages", force: :cascade do |t|
    t.decimal "amount"
    t.integer "amount_unit"
    t.decimal "freq_amount"
    t.integer "freq_period"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "emails", force: :cascade do |t|
    t.string "title"
    t.string "email"
    t.text "notes"
    t.bigint "contact_id", null: false
    t.bigint "category_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_emails_on_category_id"
    t.index ["contact_id"], name: "index_emails_on_contact_id"
  end

  create_table "employee_pay_rates", force: :cascade do |t|
    t.date "starts_at"
    t.date "ends_at"
    t.bigint "employee_id", null: false
    t.bigint "pay_rate_id", null: false
    t.bigint "shift_type_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["employee_id"], name: "index_employee_pay_rates_on_employee_id"
    t.index ["pay_rate_id"], name: "index_employee_pay_rates_on_pay_rate_id"
    t.index ["shift_type_id"], name: "index_employee_pay_rates_on_shift_type_id"
  end

  create_table "employees", force: :cascade do |t|
    t.bigint "person_id", null: false
    t.date "active_at"
    t.date "inactive_at"
    t.string "number"
    t.string "color"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["person_id"], name: "index_employees_on_person_id"
  end

  create_table "employees_job_titles", force: :cascade do |t|
    t.date "starts_at", null: false
    t.date "ends_at"
    t.bigint "employee_id", null: false
    t.bigint "job_title_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["employee_id"], name: "index_employees_job_titles_on_employee_id"
    t.index ["job_title_id"], name: "index_employees_job_titles_on_job_title_id"
  end

  create_table "households", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "households_clients", force: :cascade do |t|
    t.bigint "household_id", null: false
    t.bigint "client_id", null: false
    t.date "starts_at"
    t.date "ends_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["client_id"], name: "index_households_clients_on_client_id"
    t.index ["household_id"], name: "index_households_clients_on_household_id"
  end

  create_table "identifications", force: :cascade do |t|
    t.string "identificationable_type", null: false
    t.bigint "identificationable_id", null: false
    t.integer "type"
    t.integer "number"
    t.text "notes"
    t.date "issued_at"
    t.date "expires_at"
    t.jsonb "extra_fields"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["identificationable_type", "identificationable_id"], name: "index_identifications_on_identificationable"
  end

  create_table "incident_reports", force: :cascade do |t|
    t.datetime "occurred_at"
    t.datetime "reported_at"
    t.datetime "agency_notified_at"
    t.string "location"
    t.text "description"
    t.bigint "incident_type_id", null: false
    t.bigint "client_id", null: false
    t.bigint "reported_to_id", null: false
    t.bigint "reported_by_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["client_id"], name: "index_incident_reports_on_client_id"
    t.index ["incident_type_id"], name: "index_incident_reports_on_incident_type_id"
    t.index ["reported_by_id"], name: "index_incident_reports_on_reported_by_id"
    t.index ["reported_to_id"], name: "index_incident_reports_on_reported_to_id"
  end

  create_table "incident_types", force: :cascade do |t|
    t.bigint "category_id", null: false
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_incident_types_on_category_id"
  end

  create_table "job_titles", force: :cascade do |t|
    t.string "title", null: false
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "medications", force: :cascade do |t|
    t.string "name"
    t.string "generic_name"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "pay_rates", force: :cascade do |t|
    t.string "title"
    t.integer "rate_cents", default: 0, null: false
    t.string "rate_currency", default: "USD", null: false
    t.integer "period", null: false
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "people", force: :cascade do |t|
    t.string "first_name"
    t.string "middle_name"
    t.string "last_name"
    t.string "nick_name"
    t.date "dob"
    t.jsonb "characterstics"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_people_on_user_id"
  end

  create_table "pg_search_documents", force: :cascade do |t|
    t.text "content"
    t.text "label"
    t.string "searchable_type"
    t.bigint "searchable_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["searchable_type", "searchable_id"], name: "index_pg_search_documents_on_searchable"
  end

  create_table "phones", force: :cascade do |t|
    t.string "title"
    t.string "number", null: false
    t.string "extension"
    t.text "notes"
    t.bigint "contact_id", null: false
    t.bigint "category_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_phones_on_category_id"
    t.index ["contact_id"], name: "index_phones_on_contact_id"
  end

  create_table "prescriptions", force: :cascade do |t|
    t.bigint "medication_id", null: false
    t.bigint "client_id", null: false
    t.date "start_at"
    t.date "ends_at"
    t.bigint "doctor_id", null: false
    t.bigint "dosage_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["client_id"], name: "index_prescriptions_on_client_id"
    t.index ["doctor_id"], name: "index_prescriptions_on_doctor_id"
    t.index ["dosage_id"], name: "index_prescriptions_on_dosage_id"
    t.index ["medication_id"], name: "index_prescriptions_on_medication_id"
  end

  create_table "recurring_patterns", force: :cascade do |t|
    t.integer "recurring_type", null: false
    t.integer "offset", default: 1, null: false
    t.integer "max_occurances"
    t.integer "end_date"
    t.integer "day_of_week"
    t.integer "week_of_month"
    t.integer "day_of_month"
    t.integer "month_of_year"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "roles", force: :cascade do |t|
    t.string "name"
    t.string "resource_type"
    t.bigint "resource_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name", "resource_type", "resource_id"], name: "index_roles_on_name_and_resource_type_and_resource_id"
    t.index ["resource_type", "resource_id"], name: "index_roles_on_resource"
  end

  create_table "shift_types", force: :cascade do |t|
    t.string "title"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "shifts", force: :cascade do |t|
    t.bigint "employee_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["employee_id"], name: "index_shifts_on_employee_id"
  end

  create_table "shifts_shiftables", force: :cascade do |t|
    t.bigint "shift_id", null: false
    t.string "shiftable_type", null: false
    t.bigint "shiftable_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["shift_id"], name: "index_shifts_shiftables_on_shift_id"
    t.index ["shiftable_type", "shiftable_id"], name: "index_shifts_shiftables_on_shiftable"
  end

  create_table "users", force: :cascade do |t|
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
    t.bigint "invited_by_id"
    t.integer "invitations_count", default: 0
    t.boolean "active", default: true, null: false
    t.string "time_zone", default: "America/Los_Angeles"
    t.jsonb "table_preferences", default: {}
    t.jsonb "user_preferences", default: {}
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["invitation_token"], name: "index_users_on_invitation_token", unique: true
    t.index ["invited_by_id"], name: "index_users_on_invited_by_id"
    t.index ["invited_by_type", "invited_by_id"], name: "index_users_on_invited_by"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["table_preferences"], name: "index_users_on_table_preferences", using: :gin
    t.index ["unlock_token"], name: "index_users_on_unlock_token", unique: true
    t.index ["user_preferences"], name: "index_users_on_user_preferences", using: :gin
  end

  create_table "users_roles", id: false, force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "role_id"
    t.index ["role_id"], name: "index_users_roles_on_role_id"
    t.index ["user_id", "role_id"], name: "index_users_roles_on_user_id_and_role_id"
    t.index ["user_id"], name: "index_users_roles_on_user_id"
  end

  create_table "vendors", force: :cascade do |t|
    t.bigint "category_id", null: false
    t.string "name"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_vendors_on_category_id"
  end

  add_foreign_key "addresses", "categories"
  add_foreign_key "addresses", "contacts"
  add_foreign_key "calendar_event_exceptions", "calendar_events"
  add_foreign_key "calendar_events", "calendar_events", column: "parent_id"
  add_foreign_key "calendar_events", "recurring_patterns"
  add_foreign_key "calendar_events", "users", column: "created_by_id"
  add_foreign_key "clients", "people"
  add_foreign_key "contacts", "addresses", column: "primary_address_id"
  add_foreign_key "contacts", "emails", column: "primary_email_id"
  add_foreign_key "contacts", "phones", column: "primary_phone_id"
  add_foreign_key "doctors_clients", "clients"
  add_foreign_key "doctors_clients", "doctors"
  add_foreign_key "emails", "categories"
  add_foreign_key "emails", "contacts"
  add_foreign_key "employee_pay_rates", "employees"
  add_foreign_key "employee_pay_rates", "pay_rates"
  add_foreign_key "employee_pay_rates", "shift_types"
  add_foreign_key "employees", "people"
  add_foreign_key "employees_job_titles", "employees"
  add_foreign_key "employees_job_titles", "job_titles"
  add_foreign_key "households_clients", "clients"
  add_foreign_key "households_clients", "households"
  add_foreign_key "incident_reports", "clients"
  add_foreign_key "incident_reports", "incident_types"
  add_foreign_key "incident_reports", "people", column: "reported_by_id"
  add_foreign_key "incident_reports", "people", column: "reported_to_id"
  add_foreign_key "incident_types", "categories"
  add_foreign_key "people", "users"
  add_foreign_key "phones", "categories"
  add_foreign_key "phones", "contacts"
  add_foreign_key "prescriptions", "clients"
  add_foreign_key "prescriptions", "doctors"
  add_foreign_key "prescriptions", "dosages"
  add_foreign_key "prescriptions", "medications"
  add_foreign_key "shifts", "employees"
  add_foreign_key "shifts_shiftables", "shifts"
  add_foreign_key "vendors", "categories"
end
