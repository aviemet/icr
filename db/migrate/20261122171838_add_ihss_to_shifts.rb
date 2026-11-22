class AddIhssToShifts < ActiveRecord::Migration[8.1]
  def change
    add_column :shifts, :ihss, :boolean, null: false, default: false
  end
end
