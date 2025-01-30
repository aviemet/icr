require "rails_helper"

TEST_PARAMS = ActionController::Parameters.new(
  user: {
    name: "John",
    email: "john@example.com",
    role: "admin",
    metadata: { key: "value" }
  },
)

RSpec.describe StrongParams do
  describe ".strong_params" do

    def create_controller_class
      Class.new do
        include StrongParams

        def params
          TEST_PARAMS
        end
      end
    end

    it "permits specified parameters when using permit option" do
      controller_class = create_controller_class
      controller_class.strong_params :user, permit: [:name, :email]
      controller = controller_class.new

      permitted_params = controller.user_params

      expect(permitted_params).to be_permitted
      expect(permitted_params.to_h).to eq({
        "name" => "John",
        "email" => "john@example.com"
      })
      expect(permitted_params.to_h).not_to have_key("role")
      expect(permitted_params.to_h).not_to have_key("metadata")
    end

    it "processes parameters using provided block" do
      controller_class = create_controller_class
      controller_class.strong_params :user do
        permit(:name, :email, metadata: {})
      end
      controller = controller_class.new

      permitted_params = controller.user_params

      expect(permitted_params).to be_permitted
      expect(permitted_params.to_h).to eq({
        "name" => "John",
        "email" => "john@example.com",
        "metadata" => { "key" => "value" }
      })
      expect(permitted_params.to_h).not_to have_key("role")
    end

    it "returns nil when neither block nor permit option is provided" do
      controller_class = create_controller_class
      controller_class.strong_params :user
      controller = controller_class.new

      expect(controller.user_params).to be_nil
    end
  end
end
