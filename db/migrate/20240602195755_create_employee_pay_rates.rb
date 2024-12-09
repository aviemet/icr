class CreateEmployeePayRates < ActiveRecord::Migration[7.1]
  def change
    create_table :employee_pay_rates, id: :uuid do |t|
      t.date :starts_at
      t.date :ends_at

      t.references :employee, type: :uuid, null: false, foreign_key: true
      t.references :pay_rate, type: :uuid, null: false, foreign_key: true
      t.references :shift_type, type: :uuid, null: false, foreign_key: true

      t.timestamps
    end
  end
end
