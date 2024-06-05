shared_examples "shiftable" do
  describe "Associations" do
    it { is_expected.to have_many(:shifts_shiftables) }
    it { is_expected.to have_many(:shifts) }
  end
end
