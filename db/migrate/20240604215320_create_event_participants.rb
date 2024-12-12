class CreateEventParticipants < ActiveRecord::Migration[7.1]
  def change
    create_table :event_participants, id: :uuid do |t|
      # :event can be of type Shift of EventDetail
      t.belongs_to :event, type: :uuid, polymorphic: true, null: false
      t.belongs_to :participant, type: :uuid, polymorphic: true, null: false

      t.timestamps
    end
  end
end
