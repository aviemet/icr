class CreateEmployeesManagers < ActiveRecord::Migration[7.1]
  def change
    create_table :employee_managers, id: :uuid do |t|
      t.belongs_to :manager, type: :uuid, null: false, foreign_key: { to_table: :employees }
      t.belongs_to :employee, type: :uuid, null: false, foreign_key: { to_table: :employees }
      t.date :starts_at, null: false
      t.date :ends_at

      t.timestamps
    end

    add_index :employee_managers, [:manager_id, :employee_id],
      name: "index_employee_managers_unique_relationship",
      unique: true,
      where: "ends_at IS NULL"
  end
end
