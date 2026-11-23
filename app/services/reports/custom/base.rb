# frozen_string_literal: true

module Reports
  module Custom
    class Base
      BLANK = "-"

      def self.call(user:, params:, snapshot:)
        new(user: user, params: params, snapshot: snapshot).call
      end

      def initialize(user:, params:, snapshot:)
        @user = user
        @params = params.to_h.stringify_keys
        @snapshot = snapshot.to_h.stringify_keys
      end

      def call
        authorize!
        build
      end

      private

      attr_reader :user, :params, :snapshot

      def authorize!
      end

      def build
        raise NotImplementedError, "#{self.class.name} must implement #build"
      end

      def blank
        BLANK
      end

      def present(value)
        value.presence || blank
      end

      def setting
        Setting
      end

      def printed_by_line
        name = user.person&.name.presence || user.email
        "Printed by: #{name} on #{I18n.l(Time.current.to_date)}"
      end
    end
  end
end
