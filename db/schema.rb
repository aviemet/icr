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

ActiveRecord::Schema.define(version: 2022_01_30_172147) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "addresses", force: :cascade do |t|
    t.string "title"
    t.string "address"
    t.string "address_2"
    t.string "city"
    t.string "region"
    t.string "country"
    t.string "postal"
    t.text "notes"
    t.bigint "contact_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["contact_id"], name: "index_addresses_on_contact_id"
  end

  create_table "contacts", force: :cascade do |t|
    t.string "contactable_type", null: false
    t.bigint "contactable_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "primary_address_id"
    t.bigint "primary_phone_id"
    t.bigint "primary_email_id"
    t.index ["contactable_type", "contactable_id"], name: "index_contacts_on_contactable"
    t.index ["primary_address_id"], name: "index_contacts_on_primary_address_id"
    t.index ["primary_email_id"], name: "index_contacts_on_primary_email_id"
    t.index ["primary_phone_id"], name: "index_contacts_on_primary_phone_id"
  end

  create_table "emails", force: :cascade do |t|
    t.string "title"
    t.string "email"
    t.text "notes"
    t.bigint "contact_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["contact_id"], name: "index_emails_on_contact_id"
  end

  create_table "people", force: :cascade do |t|
    t.string "f_name"
    t.string "m_name"
    t.string "l_name"
    t.string "slug", null: false
    t.integer "person_type"
    t.bigint "user_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["slug"], name: "index_people_on_slug", unique: true
    t.index ["user_id"], name: "index_people_on_user_id"
  end

  create_table "people_shifts", id: false, force: :cascade do |t|
    t.bigint "shift_id", null: false
    t.bigint "person_id", null: false
    t.index ["person_id"], name: "index_people_shifts_on_person_id"
    t.index ["shift_id"], name: "index_people_shifts_on_shift_id"
  end

  create_table "phones", force: :cascade do |t|
    t.string "title"
    t.string "number"
    t.string "extension"
    t.text "notes"
    t.bigint "contact_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["contact_id"], name: "index_phones_on_contact_id"
  end

  create_table "recurring_patterns", force: :cascade do |t|
    t.bigint "shift_id", null: false
    t.integer "recurring_type"
    t.integer "separation_count"
    t.integer "max_occurances"
    t.integer "day_of_week"
    t.integer "week_of_month"
    t.integer "day_of_month"
    t.integer "month_of_year"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["shift_id"], name: "index_recurring_patterns_on_shift_id"
  end

  create_table "shift_exceptions", force: :cascade do |t|
    t.bigint "shift_id", null: false
    t.datetime "rescheduled"
    t.datetime "cancelled"
    t.datetime "starts_at", precision: 6
    t.datetime "ends_at", precision: 6
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["shift_id"], name: "index_shift_exceptions_on_shift_id"
  end

  create_table "shifts", force: :cascade do |t|
    t.datetime "starts_at", precision: 6
    t.datetime "ends_at", precision: 6
    t.boolean "is_recurring", default: false
    t.bigint "employee_id"
    t.bigint "created_by_id", null: false
    t.bigint "parent_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["created_by_id"], name: "index_shifts_on_created_by_id"
    t.index ["employee_id"], name: "index_shifts_on_employee_id"
    t.index ["parent_id"], name: "index_shifts_on_parent_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "encrypted_password", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at", precision: 6
    t.datetime "remember_created_at", precision: 6
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at", precision: 6
    t.datetime "last_sign_in_at", precision: 6
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.string "confirmation_token"
    t.datetime "confirmed_at", precision: 6
    t.datetime "confirmation_sent_at", precision: 6
    t.string "unconfirmed_email"
    t.integer "failed_attempts", default: 0, null: false
    t.string "unlock_token"
    t.datetime "locked_at", precision: 6
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "active", default: true
    t.string "time_zone", default: "UTC"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["unlock_token"], name: "index_users_on_unlock_token", unique: true
  end

  add_foreign_key "addresses", "contacts"
  add_foreign_key "contacts", "addresses", column: "primary_address_id"
  add_foreign_key "contacts", "emails", column: "primary_email_id"
  add_foreign_key "contacts", "phones", column: "primary_phone_id"
  add_foreign_key "emails", "contacts"
  add_foreign_key "people", "users"
  add_foreign_key "phones", "contacts"
  add_foreign_key "recurring_patterns", "shifts"
  add_foreign_key "shift_exceptions", "shifts"
  add_foreign_key "shifts", "people", column: "employee_id"
  add_foreign_key "shifts", "shifts", column: "parent_id"
  add_foreign_key "shifts", "users", column: "created_by_id"
end
