class CreateAddresses < ActiveRecord::Migration[7.0]
  def change
    create_table :addresses do |t|
      t.string :title
      t.string :address
      t.string :address_2
      t.string :city
      t.string :region
      t.string :country
      t.string :postal
      t.text :notes
      t.references :contact, null: false, foreign_key: true

      t.timestamps
    end
  end
end
