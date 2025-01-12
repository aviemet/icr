class CreateShiftTemplateEntries < ActiveRecord::Migration[7.2]
  def change
    create_table :shift_template_entries, id: :uuid do |t|
      t.belongs_to :shift_template, null: false, foreign_key: true, type: :uuid
      t.belongs_to :employee, null: false, foreign_key: true, type: :uuid
      t.integer :day_of_week
      t.time :starts_at
      t.time :ends_at

      t.timestamps
    end
  end
end
