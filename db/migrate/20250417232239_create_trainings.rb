class CreateTrainings < ActiveRecord::Migration[8.0]
  def change
    create_table :trainings, id: :uuid do |t|
      t.string :name
      t.text :description
      t.integer :estimated_minutes
      t.integer :status, null: false, default: 0

      t.timestamps
    end
  end
end
