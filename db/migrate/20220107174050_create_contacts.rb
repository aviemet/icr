class CreateContacts < ActiveRecord::Migration[7.0]
  def change
    create_table :contacts, id: :uuid do |t|
      t.text :notes
      t.belongs_to :contactable, type: :uuid, polymorphic: true, null: false

      t.belongs_to :primary_address, type: :uuid, null: true, foreign_key: { to_table: :addresses }, on_delete: :nullify
      t.belongs_to :primary_email, type: :uuid, null: true, foreign_key: { to_table: :emails }, on_delete: :nullify
      t.belongs_to :primary_phone, type: :uuid, null: true, foreign_key: { to_table: :phones }, on_delete: :nullify

      t.timestamps
    end

    add_belongs_to :addresses, :contact, type: :uuid, null: true, foreign_key: true
    add_belongs_to :emails, :contact, type: :uuid, null: true, foreign_key: true
    add_belongs_to :phones, :contact, type: :uuid, null: true, foreign_key: true
    add_belongs_to :websites, :contact, type: :uuid, null: true, foreign_key: true
  end
end
