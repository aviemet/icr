class CreateShiftTypes < ActiveRecord::Migration[7.1]
  def change
    create_table :shift_types, id: :uuid do |t|
      t.string :name
      t.text :notes

      t.timestamps
    end
  end
end
