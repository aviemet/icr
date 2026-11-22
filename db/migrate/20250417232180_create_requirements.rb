class CreateRequirements < ActiveRecord::Migration[8.0]
  def change
    create_table :requirements, id: :uuid do |t|
      t.string :name
      t.text :description
      t.references :requirement_type, null: false, foreign_key: true, type: :uuid
      t.string :scope_type
      t.uuid :scope_id
      t.integer :enforcement, null: false, default: 0

      t.timestamps
    end

    add_index :requirements, [:scope_type, :scope_id], name: "index_requirements_on_scope"
    add_index :requirements, :enforcement
  end
end
