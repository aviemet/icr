class CreateAppointments < ActiveRecord::Migration[7.1]
  def change
    create_table :appointments, id: :uuid do |t|
      t.string :name, null: false

      t.references :calendar_event, type: :uuid, null: false, foreign_key: true

      t.timestamps
    end
  end
end
