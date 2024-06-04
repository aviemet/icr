class CreateShiftsShiftables < ActiveRecord::Migration[7.1]
  def change
    create_table :shifts_shiftables do |t|
      t.references :shift, null: false, foreign_key: true
      t.references :shiftable, null: false, polymorphic: true

      t.timestamps
    end
  end
end
