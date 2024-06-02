class CreateEmails < ActiveRecord::Migration[7.0]
  def change
    create_table :emails do |t|
      t.string :title
      t.string :email
      t.text :notes
      t.references :contact, null: false, foreign_key: true
      t.references :category, null: true, foreign_key: true

      t.timestamps
    end

    add_reference :contacts, :primary_email, null: true, foreign_key: { to_table: :emails }
  end
end
