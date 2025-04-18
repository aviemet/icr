class CreateEmployeeTrainings < ActiveRecord::Migration[7.2]
  def change
    create_table :employee_trainings, id: :uuid do |t|
      t.references :employee, null: false, foreign_key: true, type: :uuid
      t.references :training, null: false, foreign_key: true, type: :uuid
      t.datetime :completed_at

      t.timestamps
    end

    add_index :employee_trainings, [:employee_id, :training_id], unique: true
  end
end
