class Households::ShowSerializer < Households::PersistedSerializer
  has_one :contact, serializer: Contacts::PersistedSerializer

  has_many :current_memberships, serializer: HouseholdsClients::PersistedSerializer
  has_many :past_memberships, serializer: HouseholdsClients::PersistedSerializer
end
