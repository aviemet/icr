shared_examples 'shiftable' do
  it{ is_expected.to have_many(:events).through(:event_participants) }

  describe 'shift' do
    it 'returns a list of events of type "shift"' do
      class_name_symbol = described_class.name.downcase.to_sym
      record = create(class_name_symbol)
      shifts = create_list(:calendar_event, 5)
      create(:calendar_event, { category: Category.find_by(slug: 'event-appointment') })
      record.events << shifts

      expect(record.shifts.count).to eq 5
    end
  end
end
