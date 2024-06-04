class CreateCalEventExceptions < ActiveRecord::Migration[7.0]
  def change
    create_table :calendar_event_exceptions do |t|
      t.references :calendar_event, null: false, foreign_key: true
      t.timestamp :rescheduled
      t.timestamp :cancelled
      t.datetime :starts_at
      t.datetime :ends_at

      t.timestamps
    end
  end
end
