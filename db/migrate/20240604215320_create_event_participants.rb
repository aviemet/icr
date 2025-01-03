class CreateEventParticipants < ActiveRecord::Migration[7.1]
  def change
    create_table :event_participants, id: :uuid do |t|
      t.belongs_to :calendar_event, type: :uuid, null: false, foreign_key: true
      t.belongs_to :participant, type: :uuid, polymorphic: true, null: false

      t.timestamps
    end
  end
end
