class Contacts::PersistedSerializer < ContactSerializer
  include Persisted

  has_many :addresses, serializer: Addresses::PersistedSerializer
  has_many :emails, serializer: Emails::PersistedSerializer
  has_many :phones, serializer: Phones::PersistedSerializer
end
