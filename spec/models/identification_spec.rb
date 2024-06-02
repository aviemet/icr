# == Schema Information
#
# Table name: identifications
#
#  id                      :bigint           not null, primary key
#  expires_at              :date
#  extra_fields            :jsonb
#  identificationable_type :string           not null
#  issued_at               :date
#  notes                   :text
#  number                  :integer
#  type                    :integer
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  identificationable_id   :bigint           not null
#
# Indexes
#
#  index_identifications_on_identificationable  (identificationable_type,identificationable_id)
#
require 'rails_helper'

RSpec.describe Identification, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
