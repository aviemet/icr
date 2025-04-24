class CreatePermissionAssignments < ActiveRecord::Migration[7.2]
  def change
    create_table :permission_assignments, id: :uuid do |t|
      t.references :permission_group, null: false, foreign_key: true, type: :uuid
      t.references :permissionable, polymorphic: true, null: false, type: :uuid
      t.datetime :starts_at
      t.datetime :ends_at
      t.jsonb :conditions

      t.timestamps
    end
  end
end
