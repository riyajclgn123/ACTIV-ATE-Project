using System;
using LearningStarter.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class DailyReport
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
    public DateTime Date { get; set; }
    public string MealTime { get; set; } // "Breakfast", "Lunch", "Dinner", "Snack"
    public decimal TotalCalories { get; set; }
}

public class DailyReportGetDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public DateTime Date { get; set; }
    public string MealTime { get; set; }
    public decimal TotalCalories { get; set; }
}


public class DailyReportEntityTypeConfiguration : IEntityTypeConfiguration<DailyReport>
{
    public void Configure(EntityTypeBuilder<DailyReport> builder)
    {
        builder.ToTable("DailyReports");
        
        builder.HasOne(dr => dr.User)
            .WithMany()
            .HasForeignKey(dr => dr.UserId);
    }
}