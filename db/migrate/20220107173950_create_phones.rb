class CreatePhones < ActiveRecord::Migration[7.0]
  def change
    create_table :phones do |t|
      t.string :title
      t.string :number, null: false
      t.string :extension
      t.text :notes
      t.references :contact, null: false, foreign_key: true
      t.references :category, null: false, foreign_key: true

      t.timestamps
    end

    add_reference :contacts, :primary_phone, null: true, foreign_key: { to_table: :phones }
  end
end
