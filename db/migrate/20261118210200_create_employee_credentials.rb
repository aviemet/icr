class CreateEmployeeCredentials < ActiveRecord::Migration[8.0]
  def change
    create_table :employee_credentials, id: :uuid do |t|
      t.references :employee, null: false, foreign_key: true, type: :uuid
      t.string :name, null: false
      t.integer :credential_type, null: false, default: 0
      t.string :number
      t.date :issued_on
      t.date :expires_on
      t.text :notes
      t.timestamps
    end
  end
end
