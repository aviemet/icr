class CreateDoctorsClients < ActiveRecord::Migration[7.1]
  def change
    create_table :doctors_clients, id: :uuid do |t|
      t.belongs_to :doctor, type: :uuid, null: false, foreign_key: true
      t.belongs_to :client, type: :uuid, null: false, foreign_key: true
      t.text :notes

      t.timestamps
    end
  end
end
