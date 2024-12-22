require "rails_helper"

RSpec.describe Categorizable do
  shared_examples "a categorizable entity" do
    let(:categorizable) { described_class.name.underscore.to_sym }

    it{ is_expected.to belong_to(:category).optional }
  end

  describe Address do
    it_behaves_like "a categorizable entity"
  end

  describe Email do
    it_behaves_like "a categorizable entity"
  end

  describe Identification do
    it_behaves_like "a categorizable entity"
  end

  describe IncidentReport do
    it_behaves_like "a categorizable entity"
  end

  describe Phone do
    it_behaves_like "a categorizable entity"
  end

  describe Vendor do
    it_behaves_like "a categorizable entity"
  end

  describe Website do
    it_behaves_like "a categorizable entity"
  end
end
