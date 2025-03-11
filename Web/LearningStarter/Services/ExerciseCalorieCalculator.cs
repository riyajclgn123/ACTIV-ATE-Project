using System;

namespace LearningStarter.Services;

public class ExerciseCalorieCalculator
{
    public static decimal CalculateCaloriesBurned(TimeSpan duration, decimal weightInKg, double metValue)
    {
        // Convert Duration to minutes
        double durationInMinutes = duration.TotalMinutes;

        // Cast the durationInMinutes and metValue to decimal to avoid type mismatch
        decimal durationInMinutesDecimal = (decimal)durationInMinutes;
        decimal metValueDecimal = (decimal)metValue;

        // Calculate calories burned using the formula and the decimal type
        return (durationInMinutesDecimal * metValueDecimal * weightInKg) / 200;
    }
    
}