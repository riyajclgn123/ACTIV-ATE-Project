using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class NutrientType
{
    public int Id { get; set; }
    public string Name { get; set; }
    public DateTimeOffset? CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
}

public class NutrientTypeGetDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public DateTimeOffset? CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
}

public class NutrientTypeCreateDto
{
    public string Name { get; set; }
}

public class NutrientTypeUpdateDto
{
    public string Name { get; set; }
}

public class NutrientTypesTypeConfiguration : IEntityTypeConfiguration<NutrientType>
{
    public void Configure(EntityTypeBuilder<NutrientType> builder)
    {
        builder.ToTable("NutrientTypes");
    }
}