# frozen_string_literal: true

module Payroll
  module Hours
    Classification = Data.define(
      :regular_hours,
      :ot_hours,
      :double_time_hours,
      :shift_ot_hours,
      :shift_double_time_hours,
      :ihss_hours,
      :company_hours,
      :pto_hours,
      :sick_hours,
      :holiday_hours,
      :client_ihss_hours,
    ) do
      def self.empty
        new(
          regular_hours: 0.0,
          ot_hours: 0.0,
          double_time_hours: 0.0,
          shift_ot_hours: {},
          shift_double_time_hours: {},
          ihss_hours: 0.0,
          company_hours: 0.0,
          pto_hours: 0.0,
          sick_hours: 0.0,
          holiday_hours: 0.0,
          client_ihss_hours: {},
        )
      end

      def to_h
        {
          regular_hours: regular_hours,
          ot_hours: ot_hours,
          double_time_hours: double_time_hours,
          shift_ot_hours: shift_ot_hours,
          shift_double_time_hours: shift_double_time_hours,
          ihss_hours: ihss_hours,
          company_hours: company_hours,
          pto_hours: pto_hours,
          sick_hours: sick_hours,
          holiday_hours: holiday_hours,
          client_ihss_hours: client_ihss_hours,
        }
      end
    end
  end
end
