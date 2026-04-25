require "rails_helper"
require "rails/generators"
require "fileutils"

require_relative "../../../../../lib/generators/tsx/scaffold/scaffold_generator"

RSpec.describe Tsx::Generators::ScaffoldGenerator do
  it "runs without error with a resource name" do
    dest = File.join(Dir.tmpdir, "icr_tsx_scaffold_#{SecureRandom.hex(4)}")

    FileUtils.mkdir_p(File.join(dest, "app", "frontend", "pages"))
    FileUtils.mkdir_p(File.join(dest, "app", "frontend", "features"))

    generator = described_class.new(["smoke_model"], {}, { destination_root: dest })

    expect { generator.invoke_all }.not_to raise_error
  ensure
    FileUtils.rm_rf(dest) if dest && Dir.exist?(dest)
  end
end
