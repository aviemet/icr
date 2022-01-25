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

ActiveRecord::Schema.define(version: 2022_01_07_183230) do

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

  create_table "clients", force: :cascade do |t|
    t.string "f_name", null: false
    t.string "l_name", null: false
    t.string "m_name"
    t.string "slug", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["slug"], name: "index_clients_on_slug", unique: true
  end

  create_table "clients_shifts", force: :cascade do |t|
    t.bigint "shift_id", null: false
    t.bigint "client_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["client_id"], name: "index_clients_shifts_on_client_id"
    t.index ["shift_id"], name: "index_clients_shifts_on_shift_id"
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

  create_table "employees", force: :cascade do |t|
    t.string "f_name", null: false
    t.string "l_name", null: false
    t.string "m_name"
    t.string "slug", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["slug"], name: "index_employees_on_slug", unique: true
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

  create_table "shifts", force: :cascade do |t|
    t.bigint "employee_id"
    t.datetime "starts_at", precision: 6
    t.datetime "ends_at", precision: 6
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["employee_id"], name: "index_shifts_on_employee_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
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
    t.string "f_name", null: false
    t.string "l_name", null: false
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["unlock_token"], name: "index_users_on_unlock_token", unique: true
  end

  add_foreign_key "addresses", "contacts"
  add_foreign_key "clients_shifts", "clients"
  add_foreign_key "clients_shifts", "shifts"
  add_foreign_key "contacts", "addresses", column: "primary_address_id"
  add_foreign_key "contacts", "emails", column: "primary_email_id"
  add_foreign_key "contacts", "phones", column: "primary_phone_id"
  add_foreign_key "emails", "contacts"
  add_foreign_key "phones", "contacts"
  add_foreign_key "shifts", "employees"
end
