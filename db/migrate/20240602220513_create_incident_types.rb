class CreateIncidentTypes < ActiveRecord::Migration[7.1]
  def change
    create_table :incident_types, id: :uuid do |t|
      t.belongs_to :category, type: :uuid, null: true, foreign_key: true
      t.string :name

      t.timestamps
    end
  end
end
