class ColorGenerator
  def initialize(model_class)
    @model_class = model_class
  end

  def generate_unique_color
    loop do
      color = random_color
      break color unless color_exists?(color)
    end
  end

  private

  # Generates a random hex color
  def random_color
    "##{('%06x' % (rand * 0xffffff))}"
  end

  # Checks if the color already exists in the model
  def color_exists?(color)
    @model_class.exists?(color: color)
  end
end
