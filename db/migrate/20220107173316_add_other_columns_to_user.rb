class AddOtherColumnsToUser < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :active, :boolean, default: true
		add_column :users, :time_zone, :string, default: "UTC"
  end
end
