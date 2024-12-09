class CreateShifts < ActiveRecord::Migration[7.1]
  def change
    create_table :shifts, id: :uuid do |t|
      t.references :employee, type: :uuid, null: false, foreign_key: true
      t.references :calendar_event, type: :uuid, null: false, foreign_key: true

      t.timestamps
    end
  end
end
