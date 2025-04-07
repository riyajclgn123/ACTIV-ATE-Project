using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class Nutrient
{
    public int Id { get; set; }
    public int NutrientTypeId { get; set; }
    
    public NutrientType NutrientType { get; set; } 
    public int FoodId { get; set; }
    public Food Food { get; set; } 
    public int Value { get; set; }
    public string Unit { get; set; }
}

public class NutrientGetDto
{
    public int Id { get; set; }
    public int NutrientTypeId { get; set; }
    public string NutrientTypeName { get; set; }
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

public class NutrientEntityConfiguration : IEntityTypeConfiguration<Nutrient>
{
    public void Configure(EntityTypeBuilder<Nutrient> builder)
    {
        builder.ToTable("Nutrients");
    }
}