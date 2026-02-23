class CreateEventDetails < ActiveRecord::Migration[8.1]
  def change
    create_table :event_details, id: :uuid do |t|
      t.text :description

      t.belongs_to :calendar_event, null: false, foreign_key: true, type: :uuid
      t.belongs_to :address, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
