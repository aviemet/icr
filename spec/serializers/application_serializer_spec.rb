# frozen_string_literal: true

require "rails_helper"

module ApplicationSerializerSpec
  PriceHolder = Struct.new(:price, :new_record?, keyword_init: true)
  TimestampHolder = Struct.new(:updated_at, :created_at, :new_record?, keyword_init: true)

  class CurrencyForSerializer < ApplicationSerializer
    currency_for :price
  end

  class TimestampsOnlySerializer < ApplicationSerializer
    timestamps
  end
end

RSpec.describe ApplicationSerializer do
  describe ".currency_for" do
    it "serializes a money field as amount, cents, and currency_iso" do
      object = instance_double(
        ApplicationSerializerSpec::PriceHolder,
        price: Money.new(1000, "USD"),
        new_record?: true,
      )

      expect(ApplicationSerializerSpec::CurrencyForSerializer.render(object)).to eq(
        price: { amount: 10.0, cents: 1000, currency_iso: "USD" },
      )
    end

    it "serializes a nil money field as nil" do
      object = instance_double(
        ApplicationSerializerSpec::PriceHolder,
        price: nil,
        new_record?: true,
      )

      expect(ApplicationSerializerSpec::CurrencyForSerializer.render(object)).to eq(price: nil)
    end
  end

  describe ".timestamps" do
    it "adds updated_at and created_at attributes so the serializer runs without error" do
      object = instance_double(
        ApplicationSerializerSpec::TimestampHolder,
        updated_at: Time.current,
        created_at: Time.current,
        new_record?: true,
      )
      expect { ApplicationSerializerSpec::TimestampsOnlySerializer.render(object) }.not_to raise_error
    end
  end
end
