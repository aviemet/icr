class Shifts::ClientSerializer < ShiftSerializer
  belongs_to :employee, serializer: Employees::PersistedSerializer
end
