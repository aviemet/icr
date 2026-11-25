class CreateShifts < ActiveRecord::Migration[8.0]
  def change
    create_table :shifts, id: :uuid do |t|
      t.belongs_to :employee, null: true, foreign_key: true, type: :uuid
      t.belongs_to :calendar_event, null: false, foreign_key: true, type: :uuid, index: { unique: true }
      t.belongs_to :timesheet, null: true, foreign_key: true, type: :uuid

      t.date :facilitator_approved_at
      t.boolean :ihss, null: false, default: false
      t.decimal :mileage, precision: 8, scale: 2

      t.belongs_to :category, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
