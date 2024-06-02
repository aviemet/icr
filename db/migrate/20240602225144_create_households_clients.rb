class CreateHouseholdsClients < ActiveRecord::Migration[7.1]
  def change
    create_table :households_clients do |t|
      t.references :household, null: false, foreign_key: true
      t.references :client, null: false, foreign_key: true
      t.date :starts_at
      t.date :ends_at

      t.timestamps
    end
  end
end
