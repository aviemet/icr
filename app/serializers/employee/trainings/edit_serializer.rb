class Employee::Trainings::EditSerializer < Employee::Trainings::PersistedSerializer
  type "string[]", optional: false
  def client_ids
    @object.client_ids.map(&:to_s)
  end
end
