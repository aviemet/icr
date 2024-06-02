class CreatePrescriptions < ActiveRecord::Migration[7.1]
  def change
    create_table :prescriptions do |t|
      t.references :medication, null: false, foreign_key: true
      t.references :client, null: false, foreign_key: true
      t.date :start_at
      t.date :ends_at
      t.references :doctor, null: false, foreign_key: true
      t.references :dosage, null: false, foreign_key: true

      t.timestamps
    end
  end
end
