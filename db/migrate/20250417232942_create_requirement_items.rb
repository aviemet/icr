class CreateRequirementItems < ActiveRecord::Migration[8.0]
  def change
    create_table :requirement_items, id: :uuid do |t|
      t.references :requirement, null: false, foreign_key: true, type: :uuid
      t.references :fulfillable, polymorphic: true, null: true, type: :uuid
      t.integer :credential_type

      t.timestamps
    end

    add_index :requirement_items,
              [:requirement_id, :fulfillable_type, :fulfillable_id],
              unique: true,
              where: "fulfillable_id IS NOT NULL",
              name: "index_req_items_on_req_fulfillable_unique"
    add_index :requirement_items,
              [:requirement_id, :credential_type],
              unique: true,
              where: "credential_type IS NOT NULL",
              name: "index_req_items_on_req_credential_type_unique"
  end
end
