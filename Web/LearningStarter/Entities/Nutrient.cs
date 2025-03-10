using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class Nutrient
{
    public int Id { get; set; }
    public int NutrientTypeId { get; set; }
    
    public NutrientType NutrientType { get; set; } = null!;
    public int FoodId { get; set; }
    public int Value { get; set; }
    public string Unit { get; set; }
}

public class NutrientGetDto
{
    public int Id { get; set; }
    public int NutrientTypeId { get; set; }
    public int FoodId { get; set; }
    public int Value { get; set; }
    public string Unit { get; set; }
}

public class NutrientCreateDto
{
    public int NutrientTypeId { get; set; }
    public int FoodId { get; set; }
    public int Value { get; set; }
    public string Unit { get; set; }
}

public class NutrientUpdateDto
{
    public int NutrientTypeId { get; set; }
    public int FoodId { get; set; }
    public int Value { get; set; }
    public string Unit { get; set; }
}

public class NutrientTypeConfiguration : IEntityTypeConfiguration<Nutrient>
{
    public void Configure(EntityTypeBuilder<Nutrient> builder)
    {
        builder.ToTable("Nutrients");
    }
}