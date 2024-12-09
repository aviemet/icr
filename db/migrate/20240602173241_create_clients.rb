class CreateClients < ActiveRecord::Migration[7.1]
  def change
    create_table :clients, id: :uuid do |t|
      t.references :person, type: :uuid, null: false, foreign_key: true
      t.date :active_at
      t.date :inactive_at
      t.string :number
      t.string :color

      t.string :slug, null: false, index: { unique: true }

      t.timestamps
    end
  end
end
