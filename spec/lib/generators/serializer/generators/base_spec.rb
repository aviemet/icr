require "rails_helper"

require_relative "../../../../../lib/generators/serializer"

RSpec.describe Serializer::Generators::Base do
  it "is a subclass of Rails::Generators::NamedBase" do
    expect(described_class.superclass).to eq(Rails::Generators::NamedBase)
  end
end
