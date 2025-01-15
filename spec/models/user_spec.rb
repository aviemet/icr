# == Schema Information
#
# Table name: users
#
#  id                     :uuid             not null, primary key
#  active                 :boolean          default(TRUE), not null
#  confirmation_sent_at   :datetime
#  confirmation_token     :string
#  confirmed_at           :datetime
#  current_sign_in_at     :datetime
#  current_sign_in_ip     :string
#  email                  :string           not null
#  encrypted_password     :string           not null
#  failed_attempts        :integer          default(0), not null
#  invitation_accepted_at :datetime
#  invitation_created_at  :datetime
#  invitation_limit       :integer
#  invitation_sent_at     :datetime
#  invitation_token       :string
#  invitations_count      :integer          default(0)
#  invited_by_type        :string
#  last_sign_in_at        :datetime
#  last_sign_in_ip        :string
#  locked_at              :datetime
#  remember_created_at    :datetime
#  reset_password_sent_at :datetime
#  reset_password_token   :string
#  sign_in_count          :integer          default(0), not null
#  slug                   :string           not null
#  table_preferences      :jsonb
#  time_zone              :string           default("America/Los_Angeles")
#  unconfirmed_email      :string
#  unlock_token           :string
#  user_preferences       :jsonb
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  invited_by_id          :uuid
#
# Indexes
#
#  index_users_on_confirmation_token    (confirmation_token) UNIQUE
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_invitation_token      (invitation_token) UNIQUE
#  index_users_on_invited_by            (invited_by_type,invited_by_id)
#  index_users_on_invited_by_id         (invited_by_id)
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#  index_users_on_slug                  (slug) UNIQUE
#  index_users_on_table_preferences     (table_preferences) USING gin
#  index_users_on_unlock_token          (unlock_token) UNIQUE
#  index_users_on_user_preferences      (user_preferences) USING gin
#
require "rails_helper"

RSpec.describe User, type: :model do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:user)).to be_valid
    end

    it "is invalid with missing attributes" do
      %i(email password).each do |attr|
        expect(build(:user, attr => nil)).not_to be_valid
      end
    end

    it "validates email format" do
      expect(build(:user, email: "invalid-email")).not_to be_valid
      expect(build(:user, email: "valid@example.com")).to be_valid
    end

    it "validates email length" do
      expect(build(:user, email: "#{('a' * 250)}@example.com")).not_to be_valid
    end

    it "validates password complexity" do
      invalid_passwords = ["simple", "UPPERCASE", "lowercase", "12345678", "!@#$%^&*"]
      invalid_passwords.each do |password|
        expect(build(:user, password: password)).not_to be_valid
      end

      expect(build(:user, password: "Valid1Password!")).to be_valid
    end

    it "validates time_zone inclusion" do
      expect(build(:user, time_zone: "Invalid/Zone")).not_to be_valid
      expect(build(:user, time_zone: "America/Los_Angeles")).to be_valid
    end
  end

  describe "Associations" do
    it { is_expected.to have_one(:person).dependent(:nullify) }
  end

  describe "Callbacks" do
    describe "#coerce_json" do
      it "coerces user_preferences store_accessor values" do
        user = create(:user)
        user.dark_mode = 0
        user.save

        expect(user.dark_mode).to be(false)
      end
    end

    describe "#synchronize_email_with_contact" do
      it "creates contact email when user email changes" do
        person = create(:person_with_contacts)
        create(:user, person: person, email: "new@example.com")

        expect(person.contact.emails.exists?(email: "new@example.com")).to be true
      end

      it "doesn't create an email when the user email changes if one already exists" do
        person = create(:person_with_contacts)
        user = create(:user, person: person, email: "existing@example.com")

        user.update(email: "new@example.com")

        expect(person.contact.emails.where(email: "existing@example.com").count).to eq(1)
      end
    end
  end

  describe "#limit" do
    it "returns table preferences limit for given model" do
      user = build(:user, table_preferences: { "User" => { "limit" => 25 } })
      expect(user.limit("User")).to eq(25)
    end

    it "returns nil when no limit is set" do
      user = build(:user)
      expect(user.limit("User")).to be_nil
    end
  end
end
