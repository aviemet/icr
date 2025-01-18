class CreateEmployeesManagers < ActiveRecord::Migration[7.1]
  def change
    create_table :employees_managers, id: :uuid do |t|
      t.belongs_to :manager, type: :uuid, null: false, foreign_key: { to_table: :employees }
      t.belongs_to :employee, type: :uuid, null: false, foreign_key: { to_table: :employees }
      t.datetime :starts_at, null: false
      t.datetime :ends_at
      t.boolean :primary, default: false, null: false

      t.timestamps
    end

    add_index :employees_managers, [:manager_id, :employee_id],
      name: "index_employees_managers_unique_relationship",
      unique: true,
      where: "ends_at IS NULL"
  end
end
