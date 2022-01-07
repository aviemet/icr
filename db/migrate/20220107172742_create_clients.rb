class CreateClients < ActiveRecord::Migration[7.0]
  def change
    create_table :clients do |t|
      t.string :f_name, null: false
      t.string :l_name, null: false
      t.string :m_name
      t.string :slug, null: false, index: { unique: true}

      t.timestamps
    end
  end
end
