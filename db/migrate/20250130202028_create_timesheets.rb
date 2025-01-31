class CreateTimesheets < ActiveRecord::Migration[7.2]
  def change
    create_table :timesheets, id: :uuid do |t|
      t.date :pay_period_start, null: false
      t.date :pay_period_end, null: false
      t.date :approved_at

      t.belongs_to :employee, null: false, foreign_key: true, type: :uuid
      t.belongs_to :approved_by, null: true, foreign_key: { to_table: :users }, type: :uuid

      t.timestamps
    end
  end
end
