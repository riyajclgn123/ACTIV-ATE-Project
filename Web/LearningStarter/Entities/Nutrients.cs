using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class Nutrients
{
    public int Id { get; set; }
    public int NutrientTypeId { get; set; }
    public int FoodId { get; set; }
    public int Value { get; set; }
    public string Unit { get; set; }
}

public class NutrientsGetDto
{
    public int Id { get; set; }
    public int NutrientTypeId { get; set; }
    public int FoodId { get; set; }
    public int Value { get; set; }
    public string Unit { get; set; }
}

public class NutrientsCreateDto
{
    public int NutrientTypeId { get; set; }
    public int FoodId { get; set; }
    public int Value { get; set; }
    public string Unit { get; set; }
}

public class NutrientsUpdateDto
{
    public int NutrientTypeId { get; set; }
    public int FoodId { get; set; }
    public int Value { get; set; }
    public string Unit { get; set; }
}

public class NutrientsTypeConfiguration : IEntityTypeConfiguration<Nutrients>
{
    public void Configure(EntityTypeBuilder<Nutrients> builder)
    {
        builder.ToTable("Nutrients");
    }
}