class AddPrimaryReferenceToContacts < ActiveRecord::Migration[7.0]
  def change
    add_reference :contacts, :primary_address, null: true, foreign_key: { to_table: :addresses }
    add_reference :contacts, :primary_phone, null: true, foreign_key: { to_table: :phones }
    add_reference :contacts, :primary_email, null: true, foreign_key: { to_table: :emails }
  end
end
