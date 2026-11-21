class Employee::Trainings::FormDataSerializer < Employee::TrainingSerializer
  type "string[]", optional: false
  def client_ids
    []
  end
end
