class CreatePrescriptions < ActiveRecord::Migration[7.1]
  def change
    create_table :prescriptions, id: :uuid do |t|
      t.references :medication, type: :uuid, null: false, foreign_key: true
      t.references :client, type: :uuid, null: false, foreign_key: true
      t.date :start_at
      t.date :ends_at
      t.references :doctor, type: :uuid, null: false, foreign_key: true
      t.references :dosage, type: :uuid, null: false, foreign_key: true

      t.timestamps
    end
  end
end
