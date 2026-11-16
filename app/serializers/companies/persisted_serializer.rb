class Companies::PersistedSerializer < CompanySerializer
  include Persisted

  has_many :addresses, serializer: Addresses::PersistedSerializer
  has_many :phones, serializer: Phones::PersistedSerializer
end
