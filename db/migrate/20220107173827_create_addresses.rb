class CreateAddresses < ActiveRecord::Migration[7.0]
  def change
    create_table :addresses, id: :uuid do |t|
      t.string :title
      t.string :address
      t.string :address_2
      t.string :city
      t.string :region
      t.integer :country
      t.string :postal
      t.text :notes
      t.references :contact, type: :uuid, null: false, foreign_key: true
      t.references :category, type: :uuid, null: true, foreign_key: true

      t.timestamps
    end

    add_reference :contacts, :primary_address, type: :uuid, null: true, foreign_key: { to_table: :addresses }
  end
end
