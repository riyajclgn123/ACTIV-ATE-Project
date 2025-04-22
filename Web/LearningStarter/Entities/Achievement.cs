using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class Achievement
{
   public int Id { get; set; } 
   public int UserId { get; set; }
   public User User { get; set; }
   public string Type { get; set; }
   public DateTimeOffset CreateDate { get; set; }
   public string Description { get; set; }
}

public class AchievementGetDto
{
   public int Id { get; set; } 
   public int UserId { get; set; }
   public string Type { get; set; }
   public DateTimeOffset CreateDate { get; set; }
   public string Description { get; set; }
}

public class AchievementCreateDto
{
   public int UserId { get; set; }
   public string Type { get; set; }
   public DateTimeOffset CreateDate { get; set; }
   public string Description { get; set; }
}

public class AchievementUpdateDto
{
   public int UserId { get; set; }
   public string Type { get; set; }
   public DateTimeOffset CreateDate { get; set; }
   public string Description { get; set; }
}

public class AchievementCheckDto
{
   public decimal GoalWeight { get; set; }
   public decimal CurrentWeight { get; set; }
   public bool IsAchieved { get; set; }
   public bool HasExistingAchievement { get; set; }
   public AchievementGetDto Achievement { get; set; }
}

public class AchievmentEntityConfiguration : IEntityTypeConfiguration<Achievement>
{
   public void Configure(EntityTypeBuilder<Achievement> builder)
   {
      builder.ToTable("Achievement");
   }
}