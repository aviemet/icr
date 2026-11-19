class CreateClientAllergies < ActiveRecord::Migration[8.0]
  def change
    create_table :client_allergies, id: :uuid do |t|
      t.references :client, null: false, foreign_key: true, type: :uuid
      t.string :name, null: false
      t.integer :severity, null: false, default: 0
      t.string :reaction
      t.text :notes
      t.boolean :active, null: false, default: true
      t.timestamps
    end
  end
end
