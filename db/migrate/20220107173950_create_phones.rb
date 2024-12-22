class CreatePhones < ActiveRecord::Migration[7.0]
  def change
    create_table :phones, id: :uuid do |t|
      t.string :name
      t.string :number, null: false
      t.string :extension
      t.text :notes

      t.belongs_to :category, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
