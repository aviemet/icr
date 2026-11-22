class CreateClientHospitalVisits < ActiveRecord::Migration[8.0]
  def change
    create_table :client_hospital_visits, id: :uuid do |t|
      t.references :client, type: :uuid, null: false, foreign_key: true
      t.references :doctor, type: :uuid, null: true, foreign_key: true
      t.references :incident_report, type: :uuid, null: true, foreign_key: true
      t.string :hospital_name, null: false
      t.datetime :admitted_at
      t.datetime :discharged_at
      t.string :reason
      t.text :notes
      t.timestamps
    end
  end
end
