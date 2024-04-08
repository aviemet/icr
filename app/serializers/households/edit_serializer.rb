class Households::EditSerializer < HouseholdSerializer

  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
