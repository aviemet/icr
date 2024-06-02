class CreateIncidentReports < ActiveRecord::Migration[7.1]
  def change
    create_table :incident_reports do |t|
      t.datetime :occured_at
      t.datetime :reported_at
      t.datetime :agency_notified_at
      t.string :location
      t.text :description

      t.references :incident_type, null: false, foreign_key: true
      t.references :client, null: false, foreign_key: true
      t.references :reported_to, null: false, foreign_key: { to_table: :people }
      t.references :reported_by, null: false, foreign_key: { to_table: :people }

      t.timestamps
    end
  end
end
