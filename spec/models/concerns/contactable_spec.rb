require "rails_helper"

RSpec.describe Contactable do
  shared_examples "a contactable entity" do
    let(:contactable) { described_class.name.underscore.to_sym }
    it { is_expected.to have_one(:contact).dependent(:destroy) }

    it { is_expected.to have_many(:addresses).through(:contact) }
    it { is_expected.to have_many(:phones).through(:contact) }
    it { is_expected.to have_many(:emails).through(:contact) }
    it { is_expected.to have_many(:websites).through(:contact) }

    it { is_expected.to accept_nested_attributes_for(:contact) }
    it { is_expected.to accept_nested_attributes_for(:addresses) }
    it { is_expected.to accept_nested_attributes_for(:phones) }
    it { is_expected.to accept_nested_attributes_for(:emails) }
    it { is_expected.to accept_nested_attributes_for(:websites) }

    describe "contact validation" do
      it "builds a contact on validation if none exists" do
        record = build(contactable)
        record.contact = nil
        record.valid?

        expect(record.contact.attributes).to eq(Contact.new({ contactable_type: described_class.name }).attributes)
      end

      it "doesn't build a new contact if one exists" do
        contact = build(:contact)
        record = build(contactable, contact:)
        record.valid?

        expect(record.contact.id).to eq(contact.id)
      end
    end
  end

  describe Person do
    it_behaves_like "a contactable entity"
  end
end
