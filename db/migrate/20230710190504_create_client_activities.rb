class CreateClientActivities < ActiveRecord::Migration[7.0]
  def change
    create_table :client_activities do |t|
      t.string :title
      t.text :notes

      t.timestamps
    end
  end
end
