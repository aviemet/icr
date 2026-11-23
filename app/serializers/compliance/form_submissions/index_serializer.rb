class Compliance::FormSubmissions::IndexSerializer < Compliance::FormSubmissions::PersistedSerializer
  type :boolean, optional: false
  def overdue # rubocop:disable Naming/PredicateMethod
    @object.overdue?
  end

  type :number, optional: false
  def open_corrective_actions_count
    @object.corrective_actions.count(&:open?)
  end
end
