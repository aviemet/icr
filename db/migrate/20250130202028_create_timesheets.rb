class CreateTimesheets < ActiveRecord::Migration[7.2]
  def change
    create_table :timesheets, id: :uuid do |t|
      t.integer :status

      t.decimal :total_regular_hours
      t.decimal :total_ot_hours
      t.decimal :total_pto_hours
      t.decimal :total_sick_hours

      t.jsonb :approval_snapshot, null: false, default: {}

      t.date :approved_at
      t.belongs_to :approved_by, null: true, foreign_key: { to_table: :users }, type: :uuid

      t.belongs_to :pay_period, null: false, foreign_key: true, type: :uuid
      t.belongs_to :employee, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
