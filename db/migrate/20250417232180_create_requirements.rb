class CreateRequirements < ActiveRecord::Migration[7.2]
  def change
    create_table :requirements, id: :uuid do |t|
      t.string :name
      t.text :description
      t.references :requirement_type, null: false, foreign_key: true, type: :uuid
      t.string :scope_type
      t.integer :scope_id

      t.timestamps
    end
  end
end
