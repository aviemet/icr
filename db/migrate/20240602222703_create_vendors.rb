class CreateVendors < ActiveRecord::Migration[7.1]
  def change
    create_table :vendors, id: :uuid do |t|
      t.references :category, type: :uuid, null: false, foreign_key: true
      t.string :name
      t.text :notes

      t.string :slug, null: false, index: { unique: true }

      t.timestamps
    end
  end
end
