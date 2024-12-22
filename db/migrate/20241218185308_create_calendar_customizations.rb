class CreateCalendarCustomizations < ActiveRecord::Migration[7.2]
  def change
    create_table :calendar_customizations, id: :uuid do |t|
      t.references :customizer, polymorphic: true, null: false, type: :uuid
      t.jsonb :color_mappings, null: false, default: {}

      t.timestamps

      t.index :color_mappings, using: :gin
    end
  end
end
