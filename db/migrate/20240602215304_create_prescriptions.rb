class CreatePrescriptions < ActiveRecord::Migration[7.1]
  def change
    create_table :prescriptions, id: :uuid do |t|
      t.belongs_to :medication, type: :uuid, null: false, foreign_key: true
      t.belongs_to :client, type: :uuid, null: false, foreign_key: true
      t.date :start_at
      t.date :ends_at
      t.belongs_to :doctor, type: :uuid, null: false, foreign_key: true
      t.belongs_to :dosage, type: :uuid, null: false, foreign_key: true

      t.timestamps
    end
  end
end
