class CreateShiftTemplates < ActiveRecord::Migration[7.2]
  def change
    create_table :shift_templates, id: :uuid do |t|
      t.string :name
      t.belongs_to :client, null: false, foreign_key: true, type: :uuid
      t.belongs_to :created_by, type: :uuid, null: false, foreign_key: { to_table: :users }

      t.date :start_date
      t.date :end_date
      t.integer :frequency
      t.boolean :active, default: false, null: false

      t.timestamps
    end
  end
end
