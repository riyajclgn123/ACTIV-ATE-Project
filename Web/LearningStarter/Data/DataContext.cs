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
   public DbSet<FoodLog> FoodLogs { get; set; }
   
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
