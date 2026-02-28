require "rails_helper"
require "rails/generators"
require "fileutils"

require_relative "../../../lib/generators/tsx/tsx_generator"

RSpec.describe TsxGenerator do
  it "runs without error with a model name" do
    dest = File.join(Dir.tmpdir, "icr_tsx_gen_#{SecureRandom.hex(4)}")
    FileUtils.mkdir_p(File.join(dest, "app", "frontend", "pages"))
    generator = described_class.new(["smoke_model"], {}, destination_root: dest)

    expect { generator.invoke_all }.not_to raise_error
    expect(File).to exist(File.join(dest, "app", "frontend", "pages", "SmokeModel", "Index", "index.tsx"))
  ensure
    FileUtils.rm_rf(dest) if dest && Dir.exist?(dest)
  end

end
