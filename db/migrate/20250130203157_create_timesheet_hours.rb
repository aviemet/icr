class CreateTimesheetHours < ActiveRecord::Migration[7.2]
  def change
    create_table :timesheet_hours, id: :uuid do |t|
      t.datetime :started_at, null: false
      t.datetime :ended_at, null: false
      t.decimal :hours, null: false, precision: 4, scale: 2

      t.belongs_to :timesheet, null: false, foreign_key: true, type: :uuid
      t.belongs_to :employee, null: false, foreign_key: true, type: :uuid

      t.timestamps

      t.index [:timesheet_id, :employee_id, :started_at], unique: true, name: "idx_timesheet_hours_unique_day"
    end
  end
end
