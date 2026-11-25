class HardenHouseholdsClientsMembership < ActiveRecord::Migration[8.0]
  def up
    execute <<~SQL.squish
      UPDATE households_clients
      SET starts_at = COALESCE(starts_at, created_at::date, CURRENT_DATE)
      WHERE starts_at IS NULL
    SQL

    change_column_null :households_clients, :starts_at, false

    add_index :households_clients,
      :client_id,
      unique: true,
      where: "ends_at IS NULL",
      name: "index_households_clients_one_open_per_client"
  end

  def down
    remove_index :households_clients, name: "index_households_clients_one_open_per_client"
    change_column_null :households_clients, :starts_at, true
  end
end
