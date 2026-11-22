namespace :db do
  namespace :seed do
    desc "Load required seed files only"
    task required: :environment do
      Rails.root.glob("db/seeds/*required*.rb").sort.each do |seed|
        load seed
      end
    end
  end
end
