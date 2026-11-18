class CreatePayrollAdjustments < ActiveRecord::Migration[8.0]
  def change
    create_table :payroll_adjustments, id: :uuid do |t|
      t.references :pay_period, null: false, foreign_key: true, type: :uuid
      t.references :employee, null: true, foreign_key: true, type: :uuid
      t.references :timesheet, null: true, foreign_key: true, type: :uuid
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.text :reason, null: false
      t.jsonb :change_set, null: false, default: {}

      t.timestamps
    end
  end
end
