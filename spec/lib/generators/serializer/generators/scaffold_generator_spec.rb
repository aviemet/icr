require "rails_helper"
require "rails/generators"
require "fileutils"

require_relative "../../../../../lib/generators/serializer/scaffold/scaffold_generator"

RSpec.describe Serializer::Generators::ScaffoldGenerator do
  it "runs without error with a resource name" do
    dest = File.join(Dir.tmpdir, "icr_serializer_scaffold_#{SecureRandom.hex(4)}")
    FileUtils.mkdir_p(File.join(dest, "app", "serializers"))
    generator = described_class.new(["smoke_models"], {}, { destination_root: dest })
    expect { generator.invoke_all }.not_to raise_error
  ensure
    FileUtils.rm_rf(dest) if dest && Dir.exist?(dest)
  end
end
