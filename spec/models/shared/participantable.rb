shared_examples "participantable" do
  it{ is_expected.to have_many(:calendar_events).through(:event_participants) }
end
