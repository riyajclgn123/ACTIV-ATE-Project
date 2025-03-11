using System.Reflection;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace LearningStarter.Data;

public sealed class DataContext : IdentityDbContext<User, Role, int>
{
    public DataContext(DbContextOptions<DataContext> options)
        : base(options)
    {
    }
public DbSet<ExerciseLog> ExerciseLogs { get; set; }
public DbSet<WeightLog> WeightLogs { get; set; }
public DbSet<Exercise> Exercises { get; set; }
 public DbSet<FoodLog> FoodLogs { get; set; }
   public DbSet<Food> Foods { get; set; }
   public DbSet<Nutrient> Nutrients { get; set; }
   public DbSet<NutrientType> NutrientTypes { get; set; }
   
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(DataContext).GetTypeInfo().Assembly);
        
        modelBuilder.Entity<User>()
            .Property(u => u.Height)
            .HasColumnType("decimal(5,2)");  // Precision of 5 digits, 2 decimals
        
        modelBuilder.Entity<User>()
            .Property(u => u.Weight)
            .HasColumnType("decimal(5,2)"); 
    }
}
