class CreateAddresses < ActiveRecord::Migration[7.0]
  def change
    create_table :addresses, id: :uuid do |t|
      t.string :title
      t.string :address, null: false
      t.string :address_2
      t.string :city
      t.string :region
      t.integer :country
      t.string :postal
      t.text :notes

      t.belongs_to :category, type: :uuid, null: true, foreign_key: true

      t.timestamps
    end
  end
end
