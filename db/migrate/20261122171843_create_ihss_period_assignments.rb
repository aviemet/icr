class CreateIhssPeriodAssignments < ActiveRecord::Migration[8.1]
  def change
    create_table :ihss_period_assignments, id: :uuid do |t|
      t.belongs_to :pay_period, null: false, foreign_key: true, type: :uuid
      t.belongs_to :employee, null: false, foreign_key: true, type: :uuid
      t.belongs_to :client, null: false, foreign_key: true, type: :uuid
      t.decimal :hours, precision: 8, scale: 2, null: false

      t.timestamps
    end

    add_index :ihss_period_assignments,
              [:pay_period_id, :employee_id, :client_id],
              unique: true,
              name: "index_ihss_period_assignments_uniqueness"
  end
end
