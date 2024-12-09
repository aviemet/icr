class CreateDoctors < ActiveRecord::Migration[7.1]
  def change
    create_table :doctors, id: :uuid do |t|
      t.string :first_name
      t.string :last_name
      t.text :notes

      t.string :slug, null: false, index: { unique: true }

      t.timestamps
    end
  end
end
