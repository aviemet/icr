require "rails_helper"
require "rake"

RSpec.describe Listeners::LocaleFileListener do
  describe ".start" do
    it "returns without starting listener when not in development" do
      allow(Rails.env).to receive(:development?).and_return(false)
      allow(Listen).to receive(:to)

      described_class.start

      expect(Listen).not_to have_received(:to)
    end

    it "does not raise when in development and listener is stubbed" do
      allow(Rails.env).to receive(:development?).and_return(true)
      listener = instance_double(Listen::Listener, start: nil, stop: nil)

      allow(Listen).to receive(:to).and_return(listener)
      allow(Thread).to receive(:new)
      allow(described_class).to receive(:at_exit).and_return(nil)

      expect { described_class.start }.not_to raise_error
    end

    it "invokes i18n export and logs when the listener callback runs with changes" do
      allow(Rails.env).to receive(:development?).and_return(true)

      listener = instance_double(Listen::Listener, start: nil, stop: nil)
      captured_block = nil
      allow(Listen).to receive(:to) do |*_args, &block|
        captured_block = block
        listener
      end

      allow(Thread).to receive(:new)
      allow(described_class).to receive(:at_exit).and_return(nil)
      allow(Rails.logger).to receive(:info)

      rake_task = instance_double(Rake::Task, invoke: nil)
      allow(Rake::Task).to receive(:[]).with("i18n:export").and_return(rake_task)
      described_class.start

      expect(captured_block).to be_present
      captured_block.call(["en.yml"], [], [])

      expect(rake_task).to have_received(:invoke)
      expect(Rails.logger).to have_received(:info).with(/Detected changes/)
      expect(Rails.logger).to have_received(:info).with(/Export completed/)
    end

    it "logs and rescues errors in the listener thread" do
      allow(Rails.env).to receive(:development?).and_return(true)

      listener = instance_double(Listen::Listener, start: nil, stop: nil)
      allow(Listen).to receive(:to).and_return(listener)
      allow(listener).to receive(:start).and_raise(StandardError.new("listener error"))
      allow(Thread).to receive(:new).and_yield
      allow(Kernel).to receive(:sleep)
      allow(described_class).to receive(:at_exit).and_return(nil)
      allow(Rails.logger).to receive(:error)

      described_class.start
      expect(Rails.logger).to have_received(:error).with(/listener error/)
    end
  end
end
