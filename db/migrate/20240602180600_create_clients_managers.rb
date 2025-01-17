class CreateClientsManagers < ActiveRecord::Migration[7.2]
  def change
    create_table :clients_managers, id: :uuid do |t|
      t.belongs_to :manager, type: :uuid, null: false, foreign_key: { to_table: :employees }
      t.belongs_to :client, type: :uuid, null: false, foreign_key: true
      t.date :starts_at, null: false
      t.date :ends_at

      t.timestamps
    end

    add_index :clients_managers, [:manager_id, :client_id],
      name: "index_clients_managers_unique_relationship",
      unique: true,
      where: "ends_at IS NULL"
  end
end
