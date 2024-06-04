class CreateCalEvents < ActiveRecord::Migration[7.0]
  def change
    create_table :calendar_events do |t|
      t.datetime :starts_at
      t.datetime :ends_at

      # Reference to original event for repeating event exception
      t.references :parent, null: true, foreign_key: { to_table: :calendar_events }
      t.references :recurring_pattern, null: true, foreign_key: true

      t.references :created_by, null: false, foreign_key: { to_table: :users }

      t.references :schedulable, polymorphic: true, index: true

      t.timestamps
    end
  end
end
