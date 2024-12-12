class CreatePhones < ActiveRecord::Migration[7.0]
  def change
    create_table :phones, id: :uuid do |t|
      t.string :title
      t.string :number, null: false
      t.string :extension
      t.text :notes
      t.belongs_to :contact, type: :uuid, null: false, foreign_key: true
      t.belongs_to :category, type: :uuid, null: false, foreign_key: true

      t.timestamps
    end

    add_reference :contacts, :primary_phone, type: :uuid, null: true, foreign_key: { to_table: :phones }
  end
end
