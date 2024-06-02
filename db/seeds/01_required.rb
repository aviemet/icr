if Category.count == 0
  {
    Email: ["Work", "Personal"],
    Address: ["Work", "Personal"],
    Phone: ["Home", "Mobile", "Office"],
  }.each do |type, categories|

    categories.each do |category|
      Category.create!({
        name: category,
        categorizable_type: type,
      })
    end

    Category.create!({
      name: "Other",
      categorizable_type: type,
    })
  end

end
