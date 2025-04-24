class CreatePermissionGroups < ActiveRecord::Migration[7.2]
  def change
    create_table :permission_groups, id: :uuid do |t|
      t.string :name
      t.text :description
      t.jsonb :permissions
      t.string :slug
      t.integer :precedence

      t.timestamps
    end
    add_index :permission_groups, :name, unique: true
    add_index :permission_groups, :slug, unique: true
  end
end
