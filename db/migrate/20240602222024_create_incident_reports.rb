class CreateIncidentReports < ActiveRecord::Migration[7.1]
  def change
    create_table :incident_reports, id: :uuid do |t|
      t.datetime :occurred_at
      t.datetime :reported_at
      t.datetime :agency_notified_at
      t.string :location
      t.text :description

      t.references :incident_type, type: :uuid, null: false, foreign_key: true
      t.references :client, type: :uuid, null: false, foreign_key: true
      t.references :reported_to, type: :uuid, null: false, foreign_key: { to_table: :people }
      t.references :reported_by, type: :uuid, null: false, foreign_key: { to_table: :people }

      t.timestamps
    end
  end
end
