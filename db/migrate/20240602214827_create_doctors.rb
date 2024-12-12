class CreateDoctors < ActiveRecord::Migration[7.1]
  def change
    create_table :doctors, id: :uuid do |t|
      t.belongs_to :person, type: :uuid, null: false, foreign_key: true

      t.string :slug, null: false, index: { unique: true }

      t.timestamps
    end
  end
end
