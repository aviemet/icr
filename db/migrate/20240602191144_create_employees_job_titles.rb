class CreateEmployeesJobTitles < ActiveRecord::Migration[7.1]
  def change
    create_table :employees_job_titles, id: :uuid do |t|
      t.date :starts_at, null: false
      t.date :ends_at

      t.belongs_to :employee, type: :uuid, null: false, foreign_key: true
      t.belongs_to :job_title, type: :uuid, null: false, foreign_key: true

      t.timestamps
    end

    add_index :employees_job_titles, [:employee_id, :starts_at, :ends_at],
      where: "ends_at IS NULL",
      unique: true,
      name: "index_ensure_single_active_job_title"

    add_check_constraint :employees_job_titles,
      "ends_at IS NULL OR ends_at > starts_at",
      name: "ensure_valid_job_title_dates"
  end
end
