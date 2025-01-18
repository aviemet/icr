class CreateClientsAttendants < ActiveRecord::Migration[7.2]
  def change
    create_table :clients_attendants, id: :uuid do |t|
      t.belongs_to :attendant, type: :uuid, null: false, foreign_key: { to_table: :employees }
      t.belongs_to :client, null: false, foreign_key: true, type: :uuid
      t.datetime :starts_at
      t.datetime :ends_at

      t.timestamps
    end

    add_index :clients_attendants, [:attendant_id, :client_id],
      name: "index_clients_attendants_unique_relationship",
      unique: true,
      where: "ends_at IS NULL"
  end
end
