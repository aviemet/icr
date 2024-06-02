class CreateMedications < ActiveRecord::Migration[7.1]
  def change
    create_table :medications do |t|
      t.string :name
      t.string :generic_name
      t.text :notes

      t.timestamps
    end
  end
end
