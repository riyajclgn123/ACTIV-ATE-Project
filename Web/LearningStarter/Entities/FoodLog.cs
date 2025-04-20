using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class FoodLog
{
    public int Id { get; set; } 
    public int UserId { get; set; }
    public int FoodId { get; set; }
    public decimal ServingSize { get; set; }
    public decimal Calories { get; set; } 
    public string MealTime {get; set;}
    public DateTimeOffset CreateDate { get; set; }
    public DateTimeOffset UpdatedDate { get; set; }

    public Food Food { get; set; }
    public User User { get; set; }  
    
}
public class FoodLogGetDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int FoodId { get; set; } 
    public string FoodName { get; set; }
    public decimal CaloriesPerServing { get; set; }
    public decimal ServingSize { get; set; }
    public decimal Calories { get; set; }
    public string MealTime {get; set;}
    public DateTimeOffset CreateDate { get; set; }
    public DateTimeOffset UpdatedDate { get; set; }
}

public class FoodLogCreateDto
{
     
    public int UserId { get; set; }
    public int FoodId { get; set; }
    public decimal ServingSize { get; set; }
    public DateTimeOffset CreateDate { get; set; }
    public string MealTime {get; set;}

}

public class FoodLogUpdateDto
{
    public int UserId { get; set; }
    public int FoodId { get; set; }
    public decimal ServingSize { get; set; }
    public string MealTime {get; set;}
    public DateTimeOffset UpdatedDate { get; set; }

   
}

public class FoodLogEntityConfiguration : IEntityTypeConfiguration<FoodLog>
{
    public void Configure(EntityTypeBuilder<FoodLog> builder)
    {
        builder.ToTable("foodlogs");
    }
}