class CreateRegionalCenters < ActiveRecord::Migration[8.0]
  def up
    create_table :regional_centers, id: :uuid do |t|
      t.string :code, null: false
      t.string :name, null: false
      t.boolean :active, null: false, default: true

      t.timestamps
    end

    add_index :regional_centers, :code, unique: true
    add_index :regional_centers, :active

    snapshot_path = Rails.root.join("lib/catalog/snapshots/regional_centers.json")
    return unless File.exist?(snapshot_path)

    now = Time.current
    rows = JSON.parse(File.read(snapshot_path)).map { |entry|
      {
        id: SecureRandom.uuid,
        code: entry.fetch("code"),
        name: entry.fetch("name"),
        active: entry.fetch("active", true),
        created_at: now,
        updated_at: now,
      }
    }
    return if rows.empty?

    regional_center = Class.new(ActiveRecord::Base) {
      self.table_name = "regional_centers"
    }
    regional_center.insert_all(rows)
  end

  def down
    drop_table :regional_centers
  end
end

