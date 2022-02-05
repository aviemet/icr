class CreateRecurringPatterns < ActiveRecord::Migration[7.0]
  def change
    create_table :recurring_patterns do |t|
      t.references :shift, null: false, foreign_key: true
      t.integer :recurring_type
      t.integer :offset
      t.integer :max_occurances
      t.integer :day_of_week
      t.integer :week_of_month
      t.integer :day_of_month
      t.integer :month_of_year

      t.timestamps
    end
  end
end
