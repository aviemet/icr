class CreateRequirementTypes < ActiveRecord::Migration[8.0]
  def change
    create_table :requirement_types, id: :uuid do |t|
      t.string :name
      t.text :description

      t.timestamps
    end
  end
end
