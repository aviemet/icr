class CreateShifts < ActiveRecord::Migration[7.2]
  def change
    create_table :shifts, id: :uuid do |t|
      t.belongs_to :employee, null: false, foreign_key: true, type: :uuid
      t.belongs_to :calendar_event, null: false, foreign_key: true, type: :uuid, index: { unique: true }
      t.belongs_to :timesheet, null: true, foreign_key: true, type: :uuid

      t.belongs_to :category, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
