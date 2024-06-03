class CreateEmployees < ActiveRecord::Migration[7.1]
  def change
    create_table :employees do |t|
      t.references :person, null: false, foreign_key: true
      t.date :active_at
      t.date :inactive_at
      t.string :number

      t.timestamps
    end
  end
end