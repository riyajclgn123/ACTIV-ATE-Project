using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class Goal
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
    public decimal Value { get; set; }
    public int TimePeriod { get; set; }
    public DateTimeOffset CreateDate { get; set; }
    public DateTimeOffset UpdateDate { get; set; }
    public string Type { get; set; }
    public string ActivityLevel { get; set; }
    public decimal DailyCalorieGoal { get; set; }
}

public class GoalGetDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public decimal Value { get; set; }
    public int TimePeriod { get; set; }
    public DateTimeOffset CreateDate { get; set; }
    public DateTimeOffset UpdateDate { get; set; }
    public string Type { get; set; }
    public string ActivityLevel { get; set; }
    public decimal DailyCalorieGoal { get; set; }
    
    
}

public class GoalCreateDto
{
    public int UserId { get; set; }
    public decimal Value { get; set; }
    public int TimePeriod { get; set; }
    public DateTimeOffset CreateDate { get; set; }
    public DateTimeOffset UpdateDate { get; set; }
    public string Type { get; set; } 
    public string ActivityLevel { get; set; }
    
}

public class GoalUpdateDto
{
    public int UserId { get; set; }
    public decimal Value { get; set; }
    public int TimePeriod { get; set; }
    public DateTimeOffset CreateDate { get; set; }
    public DateTimeOffset UpdateDate { get; set; }
    public string Type { get; set; } 
    public string ActivityLevel { get; set; }
}


public class GoalEntityTypeConfiguration : IEntityTypeConfiguration<Goal>
{
    public void Configure(EntityTypeBuilder<Goal> builder)
    {
        builder.ToTable("Goals");
    }
}
