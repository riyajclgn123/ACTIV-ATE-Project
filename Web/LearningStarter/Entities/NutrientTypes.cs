using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class NutrientTypes
{
    public int Id { get; set; }
    public string Name { get; set; }
    public DateTimeOffset? CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
}

public class NutrientTypesGetDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public DateTimeOffset? CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
}

public class NutrientTypesCreateDto
{
    public string Name { get; set; }
}

public class NutrientTypesUpdateDto
{
    public string Name { get; set; }
}

public class NutrientTypesTypeConfiguration : IEntityTypeConfiguration<NutrientTypes>
{
    public void Configure(EntityTypeBuilder<NutrientTypes> builder)
    {
        builder.ToTable("NutrientTypes");
    }
}