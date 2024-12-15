class CreateIncidentTypes < ActiveRecord::Migration[7.1]
  def change
    create_table :incident_types, id: :uuid do |t|
      t.string :name, null: false

      t.belongs_to :category, type: :uuid, null: true, foreign_key: true

      t.timestamps
    end
  end
end
