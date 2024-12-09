class CreateEventParticipants < ActiveRecord::Migration[7.1]
  def change
    create_table :event_participants, id: :uuid do |t|
      t.references :event, type: :uuid, polymorphic: true, null: false
      t.references :participant, type: :uuid, polymorphic: true, null: false

      t.timestamps
    end
  end
end
