# == Schema Information
#
# Table name: pay_rates
#
#  id            :uuid             not null, primary key
#  notes         :text
#  period        :integer          not null
#  rate_cents    :integer          default(0), not null
#  rate_currency :string           default("USD"), not null
#  title         :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
require 'rails_helper'

RSpec.describe PayRate do
  pending "add some examples to (or delete) #{__FILE__}"
end
