class Shift < ApplicationRecord
  has_and_belongs_to_many :clients, class_name: "Person"
  belongs_to :employee
  belongs_to :created_by, class_name: "User"
  belongs_to :recurring_pattern, optional: true, dependent: :destroy

  accepts_nested_attributes_for :clients
  accepts_nested_attributes_for :recurring_pattern

  scope :before, ->(time) { where("starts_at > ?", time) }
  scope :after, ->(time) { where("ends_at < ?", time) }
  scope :between, ->(start_time, end_time) { before(start_time).after(end_time) }
end
