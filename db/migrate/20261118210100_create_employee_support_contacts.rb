class CreateEmployeeSupportContacts < ActiveRecord::Migration[8.0]
  def change
    create_table :employee_support_contacts, id: :uuid do |t|
      t.references :employee, null: false, foreign_key: true, type: :uuid
      t.belongs_to :person, null: false, foreign_key: true, type: :uuid
      t.integer :relationship, null: false, default: 0
      t.integer :priority, null: false, default: 1
      t.boolean :is_emergency, null: false, default: false
      t.text :notes
      t.timestamps
    end
  end
end
