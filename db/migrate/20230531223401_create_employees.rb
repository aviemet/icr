class CreateEmployees < ActiveRecord::Migration[7.0]
  def change
    create_table :employees do |t|
      t.integer :number
      t.belongs_to :person
      t.jsonb :settings, default: {}

      t.timestamps
    end
  end
end
