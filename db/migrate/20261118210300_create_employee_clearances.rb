class CreateEmployeeClearances < ActiveRecord::Migration[8.0]
  def change
    create_table :employee_clearances, id: :uuid do |t|
      t.references :employee, null: false, foreign_key: true, type: :uuid
      t.integer :clearance_type, null: false, default: 0
      t.integer :status, null: false, default: 0
      t.date :cleared_on
      t.date :expires_on
      t.text :notes
      t.timestamps
    end
  end
end
