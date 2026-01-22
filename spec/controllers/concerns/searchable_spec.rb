# rubocop:disable RSpec/IndexedLet
require "rails_helper"

RSpec.describe Searchable do
  let(:controller) do
    test_controller = Class.new(ApplicationController) do
      include Searchable

      sortable_fields %w[first_name last_name created_at]

      def advanced_search_params
        params.permit(:first_name, :last_name, created_at: [:start, :end, :type])
      end
    end
    stub_const("TestController", test_controller)
    test_controller.new
  end

  let!(:person1) { create(:person, first_name: "John", last_name: "Doe", created_at: 1.day.ago) }
  let!(:person2) { create(:person, first_name: "Jane", last_name: "Smith", created_at: 2.days.ago) }
  let!(:person3) { create(:person, first_name: "Bob", last_name: "Johnson", created_at: 3.days.ago) }

  before do
    allow(controller).to receive_messages(
      params: ActionController::Parameters.new({}),
      request: instance_double(ActionDispatch::Request, query_parameters: {}, path: "/test"),
      current_user: instance_double(User, limit: 10),
    )
  end

  describe "#search" do
    context "with basic search" do
      it "filters records by search term" do
        allow(controller).to receive(:params).and_return(ActionController::Parameters.new({ search: "John" }))

        result = controller.search(Person)
        expect(result).to include(person1, person3)
        expect(result).not_to include(person2)
      end
    end

    context "with advanced search" do
      it "filters by exact name" do
        allow(controller).to receive_messages(
          params: ActionController::Parameters.new({ adv: "true" }),
          advanced_search_params: ActionController::Parameters.new({
            first_name: "John",
            last_name: "Doe"
          }).permit(:first_name, :last_name),
        )

        result = controller.search(Person)
        expect(result).to include(person1)
        expect(result).not_to include(person2, person3)
      end
    end

    context "with sorting" do
      it "sorts by first_name ascending" do
        allow(controller).to receive(:params).and_return(
          ActionController::Parameters.new({
            sort: "first_name",
            direction: "asc"
          }),
        )

        result = controller.search(Person)
        expect(result.to_a).to eq([person3, person2, person1])
      end

      it "sorts by first_name descending" do
        allow(controller).to receive(:params).and_return(
          ActionController::Parameters.new({
            sort: "first_name",
            direction: "desc"
          }),
        )

        result = controller.search(Person)
        expect(result.to_a).to eq([person1, person2, person3])
      end

      it "ignores invalid sort fields" do
        allow(controller).to receive(:params).and_return(
          ActionController::Parameters.new({
            sort: "invalid_field",
            direction: "asc"
          }),
        )

        result = controller.search(Person)
        expect(result.to_a.length).to eq(3)
      end
    end
  end

  describe "#paginate" do
    it "paginates results with user limit" do
      result = controller.paginate(Person.all, :people)
      expect(result.limit_value).to eq(10)
    end
  end

  describe "#pagination_data" do
    it "returns pagination metadata" do
      allow(controller).to receive(:params).and_return(ActionController::Parameters.new({ page: 1 }))
      paginated = controller.paginate(Person.all, :people)

      data = controller.pagination_data(paginated)
      expect(data).to include(
        :pages,
        :limit,
        :current_page,
        :next_page,
        :prev_page,
        :is_first_page,
        :is_last_page,
      )
    end
  end

  describe "#remove_empty_query_parameters" do
    before do
      allow(controller).to receive(:redirect_to)
    end

    it "removes empty parameters from URL" do
      allow(controller).to receive(:request).and_return(
        instance_double(ActionDispatch::Request,
          query_parameters: { "search" => "", "sort" => "name", "direction" => "asc" },
          path: "/test",),
      )

      controller.send(:remove_empty_query_parameters)
      expect(controller).to have_received(:redirect_to).with(
        satisfy { |url| url.start_with?("/test?") && url.include?("sort=name") && url.include?("direction=asc") },
      )
    end

    it "removes direction when sort is not present" do
      allow(controller).to receive(:request).and_return(
        instance_double(ActionDispatch::Request,
          query_parameters: { "direction" => "asc" },
          path: "/test",),
      )

      controller.send(:remove_empty_query_parameters)
      expect(controller).to have_received(:redirect_to).with("/test")
    end
  end
end

# rubocop:enable RSpec/IndexedLet
