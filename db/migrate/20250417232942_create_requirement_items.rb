class CreateRequirementItems < ActiveRecord::Migration[7.2]
  def change
    create_table :requirement_items, id: :uuid do |t|
      t.references :requirement, null: false, foreign_key: true, type: :uuid
      t.references :fulfillable, polymorphic: true, null: false, type: :uuid

      t.timestamps
    end

    add_index :requirement_items,
              [:requirement_id, :fulfillable_type, :fulfillable_id],
              unique: true,
              name: "index_req_items_on_req_fulfillable_unique"
  end
end
