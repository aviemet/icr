class CreateCategories < ActiveRecord::Migration[7.0]
  def change
    create_table :categories, id: :uuid do |t|
      t.string :categorizable_type, null: false
      t.string :name
      t.text :description

      t.index [:name, :categorizable_type], unique: true

      t.string :slug, null: false, index: { unique: true }

      t.timestamps
    end
  end
end
