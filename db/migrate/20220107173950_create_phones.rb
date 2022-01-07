class CreatePhones < ActiveRecord::Migration[7.0]
  def change
    create_table :phones do |t|
      t.string :title
      t.string :number
      t.string :extension
      t.text :notes
      t.references :contact, null: false, foreign_key: true

      t.timestamps
    end
  end
end
