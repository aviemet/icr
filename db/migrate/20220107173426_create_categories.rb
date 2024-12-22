class CreateCategories < ActiveRecord::Migration[7.0]
  def change
    create_table :categories, id: :uuid do |t|
      t.string :name, null: false
      t.text :description
      t.string :categorizable_type, null: false

      t.index [:name, :categorizable_type], unique: true

      t.string :slug, null: false, index: { unique: true }

      t.belongs_to :parent, type: :uuid, foreign_key: { to_table: :categories }

      t.timestamps
    end
  end
end
