class CreateClients < ActiveRecord::Migration[8.0]
  def change
    create_table :clients, id: :uuid do |t|
      t.belongs_to :person, type: :uuid, null: false, foreign_key: true
      t.date :active_at
      t.date :inactive_at
      t.string :number
      t.string :color

      t.string :slug, null: false, index: { unique: true }

      t.string :uci_number
      t.string :regional_center
      t.string :medi_cal_number
      t.date :ipp_starts_on
      t.date :ipp_ends_on
      t.date :ipp_review_on
      t.string :preferred_hospital
      t.string :preferred_language
      t.text :communication_notes
      t.decimal :ihss_authorized_hours, precision: 8, scale: 2
      t.decimal :ihss_share_of_cost, precision: 10, scale: 2
      t.text :ihss_notes

      t.timestamps
    end
  end
end
