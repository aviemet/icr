# == Schema Information
#
# Table name: contacts
#
#  id                 :uuid             not null, primary key
#  contactable_type   :string           not null
#  notes              :text
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  contactable_id     :uuid             not null
#  primary_address_id :uuid
#  primary_email_id   :uuid
#  primary_phone_id   :uuid
#
# Indexes
#
#  index_contacts_on_contactable         (contactable_type,contactable_id)
#  index_contacts_on_primary_address_id  (primary_address_id)
#  index_contacts_on_primary_email_id    (primary_email_id)
#  index_contacts_on_primary_phone_id    (primary_phone_id)
#
# Foreign Keys
#
#  fk_rails_...  (primary_address_id => addresses.id)
#  fk_rails_...  (primary_email_id => emails.id)
#  fk_rails_...  (primary_phone_id => phones.id)
#
require "rails_helper"

RSpec.describe Contact do
  describe "Validations" do
    it "is valid with valid attributes" do
      contact = build(:contact, :for_person)
      expect(contact).to be_valid
    end
  end

  describe "Associations" do
    it { is_expected.to belong_to(:contactable) }

    it { is_expected.to have_many(:addresses) }
    it { is_expected.to have_many(:emails) }
    it { is_expected.to have_many(:phones) }

    it { is_expected.to belong_to(:primary_address).optional }
    it { is_expected.to belong_to(:primary_email).optional }
    it { is_expected.to belong_to(:primary_phone).optional }

    describe "primary contact method" do
      it "manages primary_address relationship" do
        contact = create(:contact, :for_person)

        address_1 = create(:address, { contact: })
        address_2 = create(:address, { contact: })

        expect(contact.primary_address).to eq(address_1)

        address_1.destroy
        contact.reload

        expect(contact.primary_address).to eq(address_2)
      end

      it "manages primary_email relationship" do
        contact = create(:contact, :for_person)

        email_1 = create(:email, { contact: })
        email_2 = create(:email, { contact: })

        expect(contact.primary_email).to eq(email_1)

        email_1.destroy
        contact.reload

        expect(contact.primary_email).to eq(email_2)
      end

      it "manages primary_phone relationship" do
        contact = create(:contact, :for_person)

        phone_1 = create(:phone, { contact: })
        phone_2 = create(:phone, { contact: })

        expect(contact.primary_phone).to eq(phone_1)

        phone_1.destroy
        contact.reload

        expect(contact.primary_phone).to eq(phone_2)
      end
    end
  end
end
