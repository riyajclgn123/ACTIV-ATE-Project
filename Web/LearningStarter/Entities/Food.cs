using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class Food
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
}

public class FoodGetDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
}

public class FoodCreateDto
{
    public string Name { get; set; }
    public string Description { get; set; }
}

public class FoodUpdateDto
{
    public string Name { get; set; }
    public string Description { get; set; }
}

public class FoodsEntityTypeConfiguration : IEntityTypeConfiguration<Food>
{
    public void Configure(EntityTypeBuilder<Food> builder)
    {
        builder.ToTable("Food");
    }
}