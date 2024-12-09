class CreateIncidentTypes < ActiveRecord::Migration[7.1]
  def change
    create_table :incident_types, id: :uuid do |t|
      t.references :category, type: :uuid, null: false, foreign_key: true
      t.string :name

      t.timestamps
    end
  end
end
