class CreateIncidentTypes < ActiveRecord::Migration[7.1]
  def change
    create_table :incident_types do |t|
      t.references :category, null: false, foreign_key: true
      t.string :name

      t.timestamps
    end
  end
end
