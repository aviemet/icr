require "rails_helper"

RSpec.describe Renderable do
  it "is included in ApplicationRecord so all ActiveRecord models are renderable" do
    expect(ApplicationRecord.ancestors).to include(described_class)
  end

  describe "on an ActiveRecord model (User)" do
    let(:user) { create(:user) }

    it "provides #serializer returning the default serializer class" do
      expect(user.serializer).to eq(UserSerializer)
    end

    it "provides #serializer(view) returning the named view serializer" do
      expect(user.serializer(:show)).to eq(Users::ShowSerializer)
    end

    it "provides #render delegating to the default serializer" do
      result = user.render
      expect(result).to be_a(Hash)
      expect(result[:slug]).to eq(user.slug)
      expect(result[:email]).to eq(user.email)
    end

    it "provides #render(view) delegating to the named view serializer" do
      result = user.render(:show)
      expect(result).to be_a(Hash)
      expect(result[:email]).to eq(user.email)
    end
  end

  describe "class methods on an ActiveRecord model" do
    it "provides .serializer_name with default and view" do
      expect(User.serializer_name).to eq("UserSerializer")
      expect(User.serializer_name(:show)).to eq("Users::ShowSerializer")
    end

    it "provides .serializer and .serializer(view)" do
      expect(User.serializer).to eq(UserSerializer)
      expect(User.serializer(:show)).to eq(Users::ShowSerializer)
    end
  end

  describe "on an ActiveRecord::Relation (via ActiveRecordExtensions)" do
    it "provides #render(view) delegating to the view serializer" do
      create(:user)
      relation = User.limit(1)
      result = relation.render(:index)
      expect(result).to be_an(Array)
      expect(result.first).to include(:slug, :email)
    end
  end
end
