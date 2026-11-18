namespace :dev do
  namespace :seed do
    desc "Create random shifts and timesheet hour totals for existing clients and employees"
    task shifts: :environment do
      abort "dev:seed:shifts only runs in development" unless Rails.env.development?

      result = Dev::SeedShifts.call
      puts "[dev:seed:shifts] created #{result.shifts_created} shifts, updated #{result.timesheets_updated} timesheets"
    end
  end
end
