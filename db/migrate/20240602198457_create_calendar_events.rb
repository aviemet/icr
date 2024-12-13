class CreateCalendarEvents < ActiveRecord::Migration[7.0]
  def change
    create_table :calendar_events, id: :uuid do |t|
      t.string :name, null: false
      t.datetime :starts_at
      t.datetime :ends_at

      # Reference to original event for repeating event exception
      t.belongs_to :parent, type: :uuid, null: true, foreign_key: { to_table: :calendar_events }

      t.belongs_to :employee, type: :uuid, null: true, foreign_key: true
      t.belongs_to :category, type: :uuid, null: false, foreign_key: true

      t.belongs_to :created_by, type: :uuid, null: false, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end