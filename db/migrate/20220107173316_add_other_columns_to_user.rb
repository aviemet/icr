class AddOtherColumnsToUser < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :active, :boolean, default: true
    add_column :users, :time_zone, :string, default: "UTC"
    add_reference :users, :person, null: true, foreign_key: true
  end
end
