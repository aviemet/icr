class CreateHouseholdsClients < ActiveRecord::Migration[7.1]
  def change
    create_table :households_clients, id: :uuid do |t|
      t.references :household, type: :uuid, null: false, foreign_key: true
      t.references :client, type: :uuid, null: false, foreign_key: true
      t.date :starts_at
      t.date :ends_at

      t.timestamps
    end
  end
end
