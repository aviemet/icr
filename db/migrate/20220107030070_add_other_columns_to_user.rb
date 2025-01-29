class AddOtherColumnsToUser < ActiveRecord::Migration[7.0]
  def change
    change_table :users, bulk: true do |t|
      t.boolean :active, default: true, null: false
      t.string :time_zone, default: "America/Los_Angeles"

      t.jsonb :table_preferences, default: {}
      t.index :table_preferences, using: :gin

      t.jsonb :user_preferences, default: {}
      t.index :user_preferences, using: :gin

      t.string :slug, null: false, index: { unique: true }
    end
  end
end
