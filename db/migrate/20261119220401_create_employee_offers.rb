class CreateEmployeeOffers < ActiveRecord::Migration[8.0]
  def change
    create_table :employee_offers, id: :uuid do |t|
      t.references :employee, null: false, foreign_key: true, type: :uuid
      t.references :job_title, null: false, foreign_key: true, type: :uuid
      t.date :proposed_start_on
      t.integer :rate_cents, null: false, default: 0
      t.string :rate_currency, null: false, default: "USD"
      t.integer :period, null: false, default: 0
      t.string :employee_number
      t.integer :status, null: false, default: 0
      t.text :notes

      t.timestamps
    end

    add_index :employee_offers, [:employee_id, :status]
  end
end
