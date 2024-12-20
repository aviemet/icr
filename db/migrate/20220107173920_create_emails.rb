class CreateEmails < ActiveRecord::Migration[7.0]
  def change
    create_table :emails, id: :uuid do |t|
      t.string :name
      t.string :email, null: false
      t.text :notes

      t.belongs_to :category, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
