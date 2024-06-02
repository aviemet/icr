class CreateDoctorsClients < ActiveRecord::Migration[7.1]
  def change
    create_table :doctors_clients do |t|
      t.references :doctor, null: false, foreign_key: true
      t.references :client, null: false, foreign_key: true
      t.text :notes

      t.timestamps
    end
  end
end
