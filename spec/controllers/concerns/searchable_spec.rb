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

  describe "filterable_fields" do
    let(:filterable_controller_class) do
      Class.new(ApplicationController) do
        include Searchable

        filterable_fields :number, :created_at,
          active_at: { type: :date_range },
          first_name: { column: "people.first_name" },
          statuses: {
            column: :status,
            type: :in,
            values: -> { Employee.statuses.keys },
            default: "employed",
          },
          job_title: { column: "job_titles.name", joins: :job_title },
          job_titles: { column: "job_titles.name", joins: :job_title, type: :in }
      end
    end

    let(:filterable_controller) do
      stub_const("FilterableTestController", filterable_controller_class)
      filterable_controller_class.new
    end

    let!(:employed) { create(:employee, :employed, number: "EMP-100") }
    let!(:applicant) { create(:employee, number: "EMP-200") }

    before do
      allow(filterable_controller).to receive_messages(
        params: ActionController::Parameters.new({}),
        request: instance_double(ActionDispatch::Request, query_parameters: {}, path: "/test"),
        current_user: instance_double(User, limit: 10),
      )
      employed.person.update!(first_name: "Ada")
      applicant.person.update!(first_name: "Grace")
    end

    it "auto-permits scalar, array, and created_at params" do
      allow(filterable_controller).to receive(:params).and_return(
        ActionController::Parameters.new({
          adv: "true",
          number: "EMP-100",
          statuses: ["employed"],
          job_titles: ["Attendant"],
          created_at: { type: "after", start: "2024-01-01" },
        }),
      )

      permitted = filterable_controller.advanced_search_params
      expect(permitted[:number]).to eq("EMP-100")
      expect(permitted[:statuses]).to eq(["employed"])
      expect(permitted[:job_titles]).to eq(["Attendant"])
      expect(permitted[:created_at][:type]).to eq("after")
    end

    it "applies default when the key is absent" do
      allow(filterable_controller).to receive(:params).and_return(ActionController::Parameters.new({}))

      result = filterable_controller.search(Employee.includes_associated.left_joins(:person))
      expect(result).to include(employed)
      expect(result).not_to include(applicant)
    end

    it "skips default when the key is present but empty" do
      allow(filterable_controller).to receive(:params).and_return(
        ActionController::Parameters.new({ adv: "true", statuses: [""] }),
      )

      result = filterable_controller.search(Employee.includes_associated.left_joins(:person))
      expect(result).to include(employed, applicant)
    end

    it "filters with :in values" do
      allow(filterable_controller).to receive(:params).and_return(
        ActionController::Parameters.new({ adv: "true", statuses: ["applicant"] }),
      )

      result = filterable_controller.search(Employee.includes_associated.left_joins(:person))
      expect(result).to include(applicant)
      expect(result).not_to include(employed)
    end

    it "filters with ilike on an associated column" do
      allow(filterable_controller).to receive(:params).and_return(
        ActionController::Parameters.new({ adv: "true", first_name: "Ada" }),
      )

      result = filterable_controller.search(Employee.includes_associated.left_joins(:person))
      expect(result).to include(employed)
      expect(result).not_to include(applicant)
    end

    it "filters with joins and job_titles :in" do
      attendant = create(:job_title, name: "Attendant")
      manager = create(:job_title, name: "Manager")
      create(:employees_job_title, employee: employed, job_title: attendant)
      create(:employees_job_title, employee: applicant, job_title: manager)

      allow(filterable_controller).to receive(:params).and_return(
        ActionController::Parameters.new({
          adv: "true",
          statuses: [""],
          job_title: "Att",
          job_titles: ["Attendant"],
        }),
      )

      result = filterable_controller.search(Employee.includes_associated.left_joins(:person))
      expect(result).to include(employed)
      expect(result).not_to include(applicant)
    end

    it "filters with :date_range on active_at" do
      employed.update!(active_at: Date.new(2024, 4, 10))
      create(:employee, :employed, active_at: Date.new(2023, 1, 1))

      allow(filterable_controller).to receive(:params).and_return(
        ActionController::Parameters.new({
          adv: "true",
          active_at: { type: "range", start: "2024-04-01", end: "2024-04-30" },
        }),
      )

      result = filterable_controller.search(Employee.includes_associated.left_joins(:person))
      expect(result).to include(employed)
      expect(result.count).to eq(1)
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

    it "keeps empty :in filter arrays so any-status encoding survives" do
      allow(controller).to receive(:request).and_return(
        instance_double(ActionDispatch::Request,
          query_parameters: { "adv" => "true", "statuses" => [""] },
          path: "/test",),
      )

      controller.send(:remove_empty_query_parameters)
      expect(controller).not_to have_received(:redirect_to)
    end
  end
end

# rubocop:enable RSpec/IndexedLet
