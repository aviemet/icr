class CreateServiceTypes < ActiveRecord::Migration[8.1]
  def change
    create_table :service_types, id: :uuid do |t|
      t.string :name, null: false
      t.string :slug, null: false
      t.boolean :active, null: false, default: true
      t.boolean :system, null: false, default: false
      t.integer :position, null: false, default: 0
      t.boolean :billable, null: false, default: true
      t.boolean :payable, null: false, default: true
      t.boolean :allows_multi_client, null: false, default: false
      t.boolean :requires_notes, null: false, default: false
      t.boolean :tracks_mileage, null: false, default: false
      t.string :color, null: false, default: "#2F6FED"

      t.timestamps
    end

    add_index :service_types, :slug, unique: true
    add_index :service_types, :name, unique: true
    add_index :service_types, :active
    add_index :service_types, :position

    add_reference :shifts, :service_type, null: false, type: :uuid, foreign_key: true # rubocop:disable Rails/NotNullColumn
    change_column_null :shifts, :category_id, true
  end
end
