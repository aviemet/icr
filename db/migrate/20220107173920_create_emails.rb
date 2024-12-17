class CreateEmails < ActiveRecord::Migration[7.0]
  def change
    create_table :emails, id: :uuid do |t|
      t.string :title
      t.string :email, null: false
      t.text :notes

      t.belongs_to :category, type: :uuid, null: true, foreign_key: true

      t.timestamps
    end
  end
end
