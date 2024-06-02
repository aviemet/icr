class CreateEmployeePayRates < ActiveRecord::Migration[7.1]
  def change
    create_table :employee_pay_rates do |t|
      t.date :starts_at
      t.date :ends_at

      t.references :employee, null: false, foreign_key: true
      t.references :pay_rate, null: false, foreign_key: true
      t.references :shift_type, null: false, foreign_key: true

      t.timestamps
    end
  end
end
