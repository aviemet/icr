# frozen_string_literal: true

require "rails_helper"
require "i18n/tasks"

RSpec.describe I18n do
  it "has no keys referenced from app/ that are missing from locale files" do
    missing = I18n::Tasks::BaseTask.new.missing_keys
    expect(missing).to be_empty,
      "Missing #{missing.leaves.count} i18n key(s). Run: bundle exec i18n-tasks missing"
  end
end
