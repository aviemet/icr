class CreateVendors < ActiveRecord::Migration[7.1]
  def change
    create_table :vendors do |t|
      t.references :category, null: false, foreign_key: true
      t.string :name
      t.text :notes

      t.timestamps
    end
  end
end
