class CreateEmployeesJobTitles < ActiveRecord::Migration[7.1]
  def change
    create_table :employees_job_titles do |t|
      t.date :starts_at, null: false
      t.date :ends_at

      t.references :employee, null: false, foreign_key: true
      t.references :job_title, null: false, foreign_key: true

      t.timestamps
    end
  end
end
