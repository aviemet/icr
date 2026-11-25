class AddRegionalCenterToCompaniesAndClients < ActiveRecord::Migration[8.0]
  def up
    add_reference :companies, :regional_center, type: :uuid, foreign_key: true, null: true

    add_reference :clients, :regional_center, type: :uuid, foreign_key: true, null: true
    add_column :clients, :referred_by_other, :string

    say_with_time "migrate clients.regional_center strings" do
      execute <<~SQL.squish
        UPDATE clients
        SET regional_center_id = regional_centers.id
        FROM regional_centers
        WHERE clients.regional_center IS NOT NULL
          AND clients.regional_center <> ''
          AND (
            LOWER(clients.regional_center) = LOWER(regional_centers.code)
            OR LOWER(clients.regional_center) = LOWER(regional_centers.name)
          )
      SQL

      execute <<~SQL.squish
        UPDATE clients
        SET referred_by_other = regional_center
        WHERE regional_center IS NOT NULL
          AND regional_center <> ''
          AND regional_center_id IS NULL
      SQL
    end

    remove_column :clients, :regional_center, :string
  end

  def down
    add_column :clients, :regional_center, :string

    execute <<~SQL.squish
      UPDATE clients
      SET regional_center = regional_centers.name
      FROM regional_centers
      WHERE clients.regional_center_id = regional_centers.id
    SQL

    execute <<~SQL.squish
      UPDATE clients
      SET regional_center = referred_by_other
      WHERE regional_center IS NULL
        AND referred_by_other IS NOT NULL
        AND referred_by_other <> ''
    SQL

    remove_column :clients, :referred_by_other, :string
    remove_reference :clients, :regional_center, foreign_key: true
    remove_reference :companies, :regional_center, foreign_key: true
  end
end
