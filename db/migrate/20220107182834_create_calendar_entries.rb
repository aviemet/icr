class CreateCalendarEntries < ActiveRecord::Migration[7.0]
  def change
    create_table :calendar_entries, id: :uuid do |t|
      t.datetime :starts_at
      t.datetime :ends_at

      # Reference to original entry for repeating entry exception
      t.belongs_to :parent, type: :uuid, null: true, foreign_key: { to_table: :calendar_entries }
      t.belongs_to :calendar_recurring_pattern, type: :uuid, null: true, foreign_key: true

      t.belongs_to :created_by, type: :uuid, null: false, foreign_key: { to_table: :users }

      # t.belongs_to :schedulable, polymorphic: true, index: true

      t.timestamps
    end
  end
end
