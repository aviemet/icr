class CreateShifts < ActiveRecord::Migration[7.0]
  def change
    create_table :shifts do |t|
      t.datetime :starts_at
      t.datetime :ends_at
      t.references :client, null: true, foreign_key: { to_table: :people }
      t.references :employee, null: true, foreign_key: { to_table: :people }

      t.timestamps
    end
  end
end
