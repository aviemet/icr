class CreateEmployees < ActiveRecord::Migration[7.1]
  def change
    create_table :employees, id: :uuid do |t|
      t.belongs_to :person, type: :uuid, null: false, foreign_key: true
      t.date :active_at
      t.date :inactive_at
      t.string :number
      t.string :color
      t.integer :status
      t.boolean :eligible_for_hire, default: true, null: false
      t.text :ineligibility_reason

      t.string :slug, null: false, index: { unique: true }

      t.timestamps
    end
  end
end
