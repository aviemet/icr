class CreateHouseholds < ActiveRecord::Migration[7.0]
  def change
    create_table :households, id: :uuid do |t|
      t.string :name, null: false

      t.string :slug, null: false, index: { unique: true }

      t.timestamps
    end
  end
end
