class CreateSettings < ActiveRecord::Migration[7.2]
  def change
    create_table :settings, id: :uuid do |t|
      t.integer :singleton_guard
      t.jsonb :data, null: false, default: {}

      t.timestamps

      t.index :singleton_guard, unique: true
    end
  end
end
