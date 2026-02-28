require "rails_helper"

require_relative "../../../../../lib/generators/tsx"

RSpec.describe Tsx::Generators::Base do
  it "is a subclass of Rails::Generators::NamedBase" do
    expect(described_class.superclass).to eq(Rails::Generators::NamedBase)
  end

  it "has source_root set to tsx scaffold templates" do
    expect(described_class.source_root).to include("tsx/scaffold")
  end
end
