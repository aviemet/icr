class CreateIncidentReports < ActiveRecord::Migration[7.1]
  def change
    create_table :incident_reports, id: :uuid do |t|
      t.datetime :occurred_at
      t.datetime :reported_at
      t.datetime :agency_notified_at
      t.string :location
      t.text :description

      t.belongs_to :client, type: :uuid, null: false, foreign_key: true
      t.belongs_to :reported_to, type: :uuid, null: false, foreign_key: { to_table: :people }
      t.belongs_to :reported_by, type: :uuid, null: false, foreign_key: { to_table: :people }
      t.belongs_to :category, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
