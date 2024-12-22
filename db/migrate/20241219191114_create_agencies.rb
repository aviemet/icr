class CreateAgencies < ActiveRecord::Migration[7.2]
  def change
    create_table :agencies, id: :uuid do |t|
      t.string :name, null: false
      t.jsonb :settings, default: {}

      t.string :slug, null: false, index: { unique: true }

      t.timestamps
    end
  end
end
