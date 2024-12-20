class CreateVendors < ActiveRecord::Migration[7.1]
  def change
    create_table :vendors, id: :uuid do |t|
      t.string :name, null: false
      t.text :notes

      t.string :slug, null: false, index: { unique: true }

      t.belongs_to :category, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
