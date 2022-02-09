class CreateShifts < ActiveRecord::Migration[7.0]
  def change
    create_table :shifts do |t|
      t.datetime :starts_at
      t.datetime :ends_at
      t.references :recurring_pattern, null: true, foreign_key: true
      t.references :employee, null: true, foreign_key: { to_table: :people }
			t.references :created_by, null: false, foreign_key: { to_table: :users }
			t.references :parent, null: true, foreign_key: { to_table: :shifts }

      t.timestamps
    end
  end
end
