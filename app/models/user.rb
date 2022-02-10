require "tzinfo"

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_one :person, dependent: :nullify

  validates :time_zone, inclusion: { in: TZInfo::Timezone.all_data_zone_identifiers }
end
