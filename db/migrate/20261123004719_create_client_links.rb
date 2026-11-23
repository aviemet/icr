class CreateClientLinks < ActiveRecord::Migration[8.0]
  def change
    create_table :client_links, id: :uuid do |t|
      t.references :client, null: false, foreign_key: true, type: :uuid
      t.string :title, null: false
      t.string :url, null: false
      t.timestamps
    end
  end
end
