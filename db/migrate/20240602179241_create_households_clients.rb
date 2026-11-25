class CreateHouseholdsClients < ActiveRecord::Migration[8.0]
  def change
    create_table :households_clients, id: :uuid do |t|
      t.belongs_to :household, type: :uuid, null: false, foreign_key: true
      t.belongs_to :client, type: :uuid, null: false, foreign_key: true
      t.date :starts_at, null: false
      t.date :ends_at

      t.timestamps
    end

    add_index :households_clients,
      :client_id,
      unique: true,
      where: "ends_at IS NULL",
      name: "index_households_clients_one_open_per_client"
  end
end
