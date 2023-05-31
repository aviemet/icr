class CreateClients < ActiveRecord::Migration[7.0]
  def change
    create_table :clients do |t|
      t.integer :number
      t.references :person, null: false, foreign_key: true

      t.timestamps
    end
  end
end
