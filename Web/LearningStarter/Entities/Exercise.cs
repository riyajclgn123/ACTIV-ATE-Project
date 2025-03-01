using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class Exercise
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
}
public class ExerciseEntityConfiguration : IEntityTypeConfiguration<Exercise>
{
    public void Configure(EntityTypeBuilder<Exercise> builder)
    {
        builder.ToTable("Exercises");
    }
}

public class ExerciseGetDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
}
public class ExerciseCreateDto
{
    public string Name { get; set; }
    public string Description { get; set; }
}
public class ExerciseUpdateDto
{
    public string Name { get; set; }
    public string Description { get; set; }
}
public class ExerciseDeleteDto
{
    public string Name { get; set; }
    public string Description { get; set; }
}