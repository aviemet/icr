class CreateEmployeesJobTitles < ActiveRecord::Migration[7.1]
  def change
    create_table :employees_job_titles, id: :uuid do |t|
      t.date :starts_at, null: false
      t.date :ends_at

      t.belongs_to :employee, type: :uuid, null: false, foreign_key: true
      t.belongs_to :job_title, type: :uuid, null: false, foreign_key: true

      t.timestamps
    end
  end
end
