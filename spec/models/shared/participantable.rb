shared_examples "participantable" do
  it{ is_expected.to have_many(:events).through(:event_participants) }
end
