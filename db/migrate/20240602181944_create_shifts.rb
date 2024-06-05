class CreateShifts < ActiveRecord::Migration[7.1]
  def change
    create_table :shifts do |t|
      t.references :employee, null: false, foreign_key: true
      t.references :calendar_event, null: false, foreign_key: true

      t.timestamps
    end
  end
end
