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
