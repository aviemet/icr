class CreateShiftTypes < ActiveRecord::Migration[7.1]
  def change
    create_table :shift_types do |t|
      t.string :title
      t.text :notes

      t.timestamps
    end
  end
end
