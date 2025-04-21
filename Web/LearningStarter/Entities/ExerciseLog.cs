using System;

namespace LearningStarter.Entities;

public class ExerciseLog
{
    public int Id { get; set; }
    public int ExerciseId { get; set; }
    public string ExerciseName { get; set; }
    public int UserId { get; set; }
    public TimeSpan Duration { get; set; }
    public int Rep { get; set; }
    public decimal CaloriesBurned { get; set; }
    public DateTimeOffset CreateDate { get; set; }
    public DateTimeOffset UpdatedDate { get; set; }

    public User User { get; set; }
    public Exercise Exercise { get; set; }

}
  
public class ExerciseLogGetDto
{
    public int Id { get; set; }
    public int ExerciseId { get; set; }
    public string ExerciseName { get; set; }
    public int UserId { get; set; }
    public TimeSpan Duration { get; set; }
    public int Rep { get; set; }
    public decimal CaloriesBurned { get; set; }
    public DateTimeOffset CreateDate { get; set; }
    public DateTimeOffset UpdatedDate { get; set; }

}

public class ExerciseLogCreateDto
{
    public int ExerciseId { get; set; }
    public int UserId { get; set; }
    public  string Duration { get; set; }
    public int Rep { get; set; }
    public DateTimeOffset CreateDate { get; set; }

}

public class ExerciseLogUpdateDto
{
    public int ExerciseId { get; set; }
    public int UserId { get; set; }
    public string Duration { get; set; }
    public int Rep { get; set; }
    public DateTimeOffset UpdatedDate { get; set; }

}

public class ExerciseDailySummaryDto
{
    public int UserId { get; set; }
    public DateTime Date { get; set; }
    public decimal TotalCaloriesBurned { get; set; }
}