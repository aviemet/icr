require "rails_helper"
require "rails/generators"
require "fileutils"

require_relative "../../../lib/generators/serializer/serializer_generator"

RSpec.describe SerializerGenerator do
  it "runs without error with a model name" do
    dest = File.join(Dir.tmpdir, "icr_serializer_gen_#{SecureRandom.hex(4)}")
    FileUtils.mkdir_p(File.join(dest, "app", "serializers"))
    FileUtils.mkdir_p(File.join(dest, "app", "models"))
    generator = described_class.new(["smoke_model"], {}, destination_root: dest)
    expect { generator.invoke_all }.not_to raise_error
    expect(File).to exist(File.join(dest, "app", "serializers", "smoke_model_serializer.rb"))
  ensure
    FileUtils.rm_rf(dest) if dest && Dir.exist?(dest)
  end

  it "raises when both --only and --except are given" do
    dest = File.join(Dir.tmpdir, "icr_serializer_gen_#{SecureRandom.hex(4)}")
    FileUtils.mkdir_p(File.join(dest, "app", "serializers"))
    generator = described_class.new(["smoke_model"], { only: ["show"], except: ["index"] }, destination_root: dest)
    expect { generator.invoke_all }.to raise_error(ArgumentError, /Only one of/)
  ensure
    FileUtils.rm_rf(dest) if dest && Dir.exist?(dest)
  end
end
