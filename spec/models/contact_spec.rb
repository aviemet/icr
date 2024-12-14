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
  describe 'Validations' do
    it 'is valid with valid attributes' do
      expect(build(:contact)).to be_valid
    end
  end

  describe 'Associations' do
    it { is_expected.to belong_to(:contactable) }

    it { is_expected.to have_many(:addresses) }
    it { is_expected.to have_many(:emails) }
    it { is_expected.to have_many(:phones) }

    it { is_expected.to belong_to(:primary_address).optional }
    it { is_expected.to belong_to(:primary_email).optional }
    it { is_expected.to belong_to(:primary_phone).optional }

    describe 'primary contact method' do
      it 'sets a lone contact method to the primary contact method' do
        contact = create(:contact)

        address_1 = create(:address, { contact: })
        email_1 = create(:email, { contact: })
        phone_1 = create(:phone, { contact: })

        address_2 = create(:address, { contact: })
        email_2 = create(:email, { contact: })
        phone_2 = create(:phone, { contact: })

        # ap({ address_1: address_1.title, contact_addresses: contact.addresses.select(:title) })

        expect(contact.primary_address).to eq(address_1)
        expect(contact.primary_email).to eq(email_1)
        expect(contact.primary_phone).to eq(phone_1)

        address_1.destroy
        email_1.destroy
        phone_1.destroy

        expect(contact.primary_address).to eq(address_2)
        expect(contact.primary_email).to eq(email_2)
        expect(contact.primary_phone).to eq(phone_2)
      end
    end
  end
end
