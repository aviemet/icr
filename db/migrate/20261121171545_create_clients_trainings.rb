class CreateClientsTrainings < ActiveRecord::Migration[8.1]
  def change
    create_table :clients_trainings, id: :uuid do |t|
      t.references :client, null: false, foreign_key: true, type: :uuid
      t.references :training, null: false, foreign_key: true, type: :uuid
      t.boolean :required, null: false, default: false

      t.timestamps

      t.index [:client_id, :training_id], unique: true
    end
  end
end
