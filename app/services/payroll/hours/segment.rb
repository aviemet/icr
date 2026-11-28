# frozen_string_literal: true

module Payroll
  module Hours
    Segment = Data.define(
      :interval_id,
      :employee_id,
      :date,
      :hours,
      :starts_at,
      :ihss,
      :consuming_client_id,
      :criteria_exempt,
      :leave_kind,
      :category,
    ) do
      def ihss?
        ihss == true
      end

      def leave?
        leave_kind.present?
      end

      def criteria_exempt?
        criteria_exempt == true
      end
    end
  end
end
