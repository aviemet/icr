class CreateDoctors < ActiveRecord::Migration[8.0]
  def change
    create_table :doctors, id: :uuid do |t|
      t.belongs_to :person, type: :uuid, null: false, foreign_key: true
      t.string :specialty
      t.string :npi
      t.string :practice_name
      t.text :notes
      t.string :slug, null: false, index: { unique: true }

      t.timestamps
    end
  end
end
