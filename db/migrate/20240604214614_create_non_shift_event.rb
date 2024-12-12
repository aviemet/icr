class CreateNonShiftEvent < ActiveRecord::Migration[7.1]
  def change
    create_table :non_shift_events, id: :uuid do |t|
      t.string :name, null: false

      t.belongs_to :calendar_entry, type: :uuid, null: false, foreign_key: true

      t.timestamps
    end
  end
end
