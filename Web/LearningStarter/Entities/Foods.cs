using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class Foods
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
}

public class FoodsGetDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
}

public class FoodsCreateDto
{
    public string Name { get; set; }
    public string Description { get; set; }
}

public class FoodsUpdateDto
{
    public string Name { get; set; }
    public string Description { get; set; }
}

public class FoodsEntityTypeConfiguration : IEntityTypeConfiguration<Foods>
{
    public void Configure(EntityTypeBuilder<Foods> builder)
    {
        builder.ToTable("Foods");
    }
}