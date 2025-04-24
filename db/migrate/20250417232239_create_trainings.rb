class CreateTrainings < ActiveRecord::Migration[7.2]
  def change
    create_table :trainings, id: :uuid do |t|
      t.string :name
      t.text :description
      t.integer :estimated_minutes
      t.datetime :active_on
      t.datetime :inactive_on

      t.timestamps
    end
  end
end
