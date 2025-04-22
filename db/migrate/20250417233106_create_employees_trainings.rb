class CreateEmployeesTrainings < ActiveRecord::Migration[7.2]
  def change
    create_table :employees_trainings, id: :uuid do |t|
      t.references :employee, null: false, type: :uuid, foreign_key: true
      t.references :training, null: false, type: :uuid, foreign_key: true
      t.datetime :started_at
      t.datetime :completed_at

      t.timestamps

      t.index [:employee_id, :training_id], unique: true
    end
  end
end
