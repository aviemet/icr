module Requirement
  class ApplicationRecord < ::ApplicationRecord
    self.abstract_class = true
    self.table_name_prefix = "" # Ensures tables aren't prefixed with 'requirement_'
  end
end
