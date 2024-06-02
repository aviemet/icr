class CreateCalEvents < ActiveRecord::Migration[7.0]
  def change
    create_table :cal_events do |t|
      t.datetime :starts_at
      t.datetime :ends_at

      # Reference to original event for repeating event exception
      t.references :parent, null: true, foreign_key: { to_table: :cal_events }
      t.references :recurring_pattern, null: true, foreign_key: true

      t.references :created_by, null: false, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end
