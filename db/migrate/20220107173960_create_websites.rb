class CreateWebsites < ActiveRecord::Migration[7.2]
  def change
    create_table :websites, id: :uuid do |t|
      t.string :name
      t.string :url, null: false

      t.belongs_to :category, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
