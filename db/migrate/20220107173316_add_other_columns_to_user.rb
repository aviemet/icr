class AddOtherColumnsToUser < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :active, :boolean, default: true
		add_column :users, :f_name, :string, null: false
		add_column :users, :l_name, :string, null: false
  end
end
