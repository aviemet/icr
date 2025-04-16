class CreateCalendarEvents < ActiveRecord::Migration[7.0]
  def change
    create_table :calendar_events, id: :uuid do |t|
      t.string :name
      t.datetime :starts_at
      t.datetime :ends_at
      t.boolean :all_day, null: false, default: false

      # Reference to original event for repeating event exception
      t.belongs_to :parent, type: :uuid, null: true, foreign_key: { to_table: :calendar_events }

      t.belongs_to :created_by, type: :uuid, null: true, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end
