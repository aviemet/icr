class CreateShifts < ActiveRecord::Migration[7.1]
  def change
    create_table :shifts, id: :uuid do |t|
      t.belongs_to :employee, type: :uuid, null: false, foreign_key: true
      t.belongs_to :calendar_entry, type: :uuid, null: false, foreign_key: true

      t.timestamps
    end
  end
end
