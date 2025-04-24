class CreateEmployeesJobTitles < ActiveRecord::Migration[7.1]
  def change
    create_table :employees_job_titles, id: :uuid do |t|
      t.datetime :starts_at
      t.datetime :ends_at

      t.integer :application_type # enum
      t.integer :offer_status # enum

      t.date :proposed_start_date
      t.integer :proposed_salary_period # enum (hourly/annual)
      t.belongs_to :proposed_pay_rate

      t.belongs_to :employee, type: :uuid, null: false, foreign_key: true
      t.belongs_to :job_title, type: :uuid, null: false, foreign_key: true

      t.timestamps
    end

    add_check_constraint :employees_job_titles,
      "ends_at IS NULL OR ends_at > starts_at",
      name: "ensure_valid_job_title_dates"
  end
end
