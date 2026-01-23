# == Schema Information
#
# Table name: incident_reports
#
#  id                 :uuid             not null, primary key
#  agency_notified_at :datetime
#  description        :text
#  location           :string
#  occurred_at        :datetime
#  reported_at        :datetime
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  category_id        :uuid             not null
#  client_id          :uuid             not null
#  reported_by_id     :uuid             not null
#  reported_to_id     :uuid             not null
#
# Indexes
#
#  index_incident_reports_on_category_id     (category_id)
#  index_incident_reports_on_client_id       (client_id)
#  index_incident_reports_on_reported_by_id  (reported_by_id)
#  index_incident_reports_on_reported_to_id  (reported_to_id)
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#  fk_rails_...  (client_id => clients.id)
#  fk_rails_...  (reported_by_id => people.id)
#  fk_rails_...  (reported_to_id => people.id)
#
class IncidentReport < ApplicationRecord
  include Categorizable

  include PgSearchable
  pg_search_config(against: [:occurred_at, :reported_at, :agency_notified_at])

  resourcify

  belongs_to :client
  belongs_to :reported_by, class_name: "Employee", primary_key: :person_id, foreign_key: :reported_by_id
  belongs_to :reported_to, class_name: "Employee", primary_key: :person_id, foreign_key: :reported_to_id

  scope :includes_associated, -> { includes([:reported_by, :client, :reported_to]) }
end
