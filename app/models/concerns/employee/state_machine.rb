# app/models/concerns/employee/state_machine.rb
module Employee::StateMachine
  extend ActiveSupport::Concern

  included do
    # Add the gem 'state_machines-activerecord' to your Gemfile
    # Ensure you have the 'status' integer column in your employees table

    state_machine :status, initial: :applicant, action: :save do # Assuming save persists state
      # Let state_machines know we are using the enum defined in Employee model
      # Note: Direct enum integration might need verification with state_machines gem specifics.
      # If direct enum integration isn't straightforward, we might map integer values here.
      # Let's assume for now it works with the enum names directly or underlying integers.

      state :applicant, value: 0 # Explicitly map to enum value if needed
      state :offered, value: 1
      state :employed, value: 2
      state :declined, value: 3
      state :terminated, value: 4

      event :make_offer do
        transition applicant: :offered
        # after do |employee, transition| ... end
      end

      event :accept_offer do
        transition offered: :employed
        # Use callbacks to set active_at etc.
        after :activate_employment
      end

      event :reject_offer do
        transition offered: :declined
        # after do |employee, transition| ... end
      end

      event :terminate do
        # Allow termination from most states
        transition [:employed, :applicant, :offered, :declined] => :terminated
        after :deactivate_employment
      end

      # Example guard for re-hiring
      event :reconsider do
        transition [:declined, :terminated] => :applicant, if: :eligible_for_hire?
      end

      # --- Callbacks defined within the main Employee model ---
      # It's often cleaner to keep the callback method definitions
      # in the main model class itself, even if triggered from the concern.
      # Or they can be defined here within the `included` block or the module itself.
      # Let's plan to define activate_employment and deactivate_employment
      # in the main employee.rb file for better visibility.

      # --- Helper methods provided by state_machines ---
      # The gem automatically provides methods like:
      # employee.applicant?, employee.offered?, etc.
      # employee.can_make_offer?, employee.can_accept_offer?, etc.
      # employee.make_offer, employee.make_offer! etc.
    end
  end

  # Instance methods related to state machine logic could go here
  # but activate_employment/deactivate_employment are closely tied
  # to Employee attributes, so keeping them in employee.rb is fine.
end
