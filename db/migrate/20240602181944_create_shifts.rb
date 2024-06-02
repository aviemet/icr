class CreateShifts < ActiveRecord::Migration[7.1]
  def change
    create_table :shifts do |t|
      t.references :cal_event, foreign_key: true
      t.references :client, foreign_key: true
      t.references :employee, foreign_key: true
      t.references :household, null: false, foreign_key: true

      t.timestamps
    end
  end
end
