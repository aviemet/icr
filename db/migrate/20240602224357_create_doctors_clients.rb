class CreateDoctorsClients < ActiveRecord::Migration[8.0]
  def change
    create_table :doctors_clients, id: :uuid do |t|
      t.belongs_to :doctor, type: :uuid, null: false, foreign_key: true
      t.belongs_to :client, type: :uuid, null: false, foreign_key: true
      t.text :notes

      t.timestamps
    end

    add_index :doctors_clients, [:doctor_id, :client_id], unique: true, name: "index_doctors_clients_on_doctor_and_client"
  end
end
