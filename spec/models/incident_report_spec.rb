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
#  client_id          :uuid             not null
#  incident_type_id   :uuid             not null
#  reported_by_id     :uuid             not null
#  reported_to_id     :uuid             not null
#
# Indexes
#
#  index_incident_reports_on_client_id         (client_id)
#  index_incident_reports_on_incident_type_id  (incident_type_id)
#  index_incident_reports_on_reported_by_id    (reported_by_id)
#  index_incident_reports_on_reported_to_id    (reported_to_id)
#
# Foreign Keys
#
#  fk_rails_...  (client_id => clients.id)
#  fk_rails_...  (incident_type_id => incident_types.id)
#  fk_rails_...  (reported_by_id => people.id)
#  fk_rails_...  (reported_to_id => people.id)
#
require 'rails_helper'

RSpec.describe IncidentReport do
  pending "add some examples to (or delete) #{__FILE__}"
end
