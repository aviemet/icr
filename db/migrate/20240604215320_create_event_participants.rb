class CreateEventParticipants < ActiveRecord::Migration[7.1]
  def change
    create_table :event_participants do |t|
      t.references :event, polymorphic: true, null: false
      t.references :participant, polymorphic: true, null: false

      t.timestamps
    end
  end
end
