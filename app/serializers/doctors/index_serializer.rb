class Doctors::IndexSerializer < Doctors::PersistedSerializer
  attributes(
    :specialty,
    :practice_name,
  )
end
