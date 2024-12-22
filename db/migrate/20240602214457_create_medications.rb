class CreateMedications < ActiveRecord::Migration[7.1]
  def change
    create_table :medications, id: :uuid do |t|
      t.string :name, null: false
      t.string :generic_name
      t.text :notes

      t.timestamps
    end
  end
end
