class CreateRecurringPatterns < ActiveRecord::Migration[7.0]
  def change
    create_table :recurring_patterns, id: :uuid do |t|
      t.integer :recurring_type, null: false
      t.integer :offset, null: false, default: 1
      t.integer :max_occurances
      t.integer :end_date
      t.integer :day_of_week
      t.integer :week_of_month
      t.integer :day_of_month
      t.integer :month_of_year

      t.timestamps
    end
  end
end
