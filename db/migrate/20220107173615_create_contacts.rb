class CreateContacts < ActiveRecord::Migration[7.0]
  def change
    create_table :contacts, id: :uuid do |t|
      t.text :notes
      t.references :contactable, type: :uuid, polymorphic: true, null: false

      t.timestamps
    end
  end
end
