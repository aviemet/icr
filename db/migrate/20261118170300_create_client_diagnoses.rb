class CreateClientDiagnoses < ActiveRecord::Migration[8.0]
  def change
    create_table :client_diagnoses, id: :uuid do |t|
      t.references :client, null: false, foreign_key: true, type: :uuid
      t.string :name, null: false
      t.string :code
      t.date :diagnosed_on
      t.text :notes
      t.boolean :active, null: false, default: true
      t.timestamps
    end
  end
end
