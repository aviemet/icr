class CreateShifts < ActiveRecord::Migration[7.0]
  def change
    create_table :shifts do |t|
      t.references :employee, null: true, foreign_key: true
      t.datetime :starts_at
      t.datetime :ends_at

      t.timestamps
    end
  end
end
