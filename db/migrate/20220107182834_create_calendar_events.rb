class CreateCalendarEvents < ActiveRecord::Migration[7.0]
  def change
    create_table :calendar_events, id: :uuid do |t|
      t.datetime :starts_at
      t.datetime :ends_at

      # Reference to original event for repeating event exception
      t.references :parent, type: :uuid, null: true, foreign_key: { to_table: :calendar_events }
      t.references :recurring_pattern, type: :uuid, null: true, foreign_key: true

      t.references :created_by, type: :uuid, null: false, foreign_key: { to_table: :users }

      # t.references :schedulable, polymorphic: true, index: true

      t.timestamps
    end
  end
end
