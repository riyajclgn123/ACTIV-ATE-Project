using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class Food
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public ICollection<Nutrient> Nutrients { get; set; } = new List<Nutrient>();
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

public class FoodEntityTypeConfiguration : IEntityTypeConfiguration<Food>
{
    public void Configure(EntityTypeBuilder<Food> builder)
    {
        builder.ToTable("Food");
    }
}