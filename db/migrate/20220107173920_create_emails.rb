class CreateEmails < ActiveRecord::Migration[7.0]
  def change
    create_table :emails, id: :uuid do |t|
      t.string :title
      t.string :email
      t.text :notes
      t.belongs_to :contact, type: :uuid, null: false, foreign_key: true
      t.belongs_to :category, type: :uuid, null: true, foreign_key: true

      t.timestamps
    end

    add_reference :contacts, :primary_email, type: :uuid, null: true, foreign_key: { to_table: :emails }
  end
end
