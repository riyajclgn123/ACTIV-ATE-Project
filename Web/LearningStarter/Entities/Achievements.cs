using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class Achievements
{
   public int Id { get; set; } 
   public int UserId { get; set; }
   public User User { get; set; }
   public string Type { get; set; }
   public DateTimeOffset CreateDate { get; set; }
   public String Description { get; set; }
}

public class AchievmentsGetDto
{
   public int Id { get; set; } 
   public int UserId { get; set; }
   public string Type { get; set; }
   public DateTimeOffset CreateDate { get; set; }
   public String Description { get; set; }
}

public class AchievmentsCreateDto
{
   public int UserId { get; set; }
   public string Type { get; set; }
   public DateTimeOffset CreateDate { get; set; }
   public String Description { get; set; }
}

public class AchievmentsUpdateDto
{
   public int UserId { get; set; }
   public string Type { get; set; }
   public DateTimeOffset CreateDate { get; set; }
   public String Description { get; set; }
}
   

public class AchievmentsEntityConfiguration : IEntityTypeConfiguration<Achievements>
{
   public void Configure(EntityTypeBuilder<Achievements> builder)
   {
      builder.ToTable("Achievements");
   }
}