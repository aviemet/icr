class CreateClientLifeDetails < ActiveRecord::Migration[8.0]
  def change
    create_table :client_life_details, id: :uuid do |t|
      t.references :client, null: false, foreign_key: true, type: :uuid, index: { unique: true }
      t.text :adls
      t.text :adaptive_supports
      t.text :behavior_supports
      t.text :routines
      t.text :risk_flags
      t.timestamps
    end
  end
end
