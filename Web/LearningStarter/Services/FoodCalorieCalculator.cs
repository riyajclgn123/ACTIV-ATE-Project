using System;

public static class FoodCalorieCalculator
{
    public static decimal CalculateDailyCalorieGoal(
        decimal currentWeight, 
        decimal height, 
        string dateOfBirth, 
        string gender, 
        string activityLevel, 
        decimal targetWeight, 
        int timePeriodInDays) // Time period to achieve target weight (in days)
    {
        // Step 1: Calculate age from DateOfBirth
        int age = CalculateAge(dateOfBirth);

        // Step 2: Calculate BMR using Mifflin-St Jeor formula
        decimal bmr;
        if (gender.ToLower() == "male")
        {
            bmr = (10 * currentWeight) + (6.25m * height) - (5 * age) + 5;
        }
        else
        {
            bmr = (10 * currentWeight) + (6.25m * height) - (5 * age) - 161;
        }

        // Step 3: Adjust BMR based on activity level
        decimal activityFactor = GetActivityFactor(activityLevel);
        decimal tdee = bmr * activityFactor;

        // Step 4: Adjust for target weight and time period
        decimal weightDifference = targetWeight - currentWeight; // Positive if gaining, negative if losing
        decimal calorieAdjustment = (weightDifference * 7700) / timePeriodInDays; // 7700 calories ≈ 1 kg

        decimal dailyCalorieGoal = tdee + calorieAdjustment;

        // Step 5: Ensure a minimum calorie threshold for health
        decimal minimumCalorieThreshold = 1200; // Minimum recommended daily calories
        if (dailyCalorieGoal < minimumCalorieThreshold)
        {
            dailyCalorieGoal = minimumCalorieThreshold;
        }

        return dailyCalorieGoal;
    }

    public static int CalculateAge(string dateOfBirth)
    {
        if (DateTime.TryParse(dateOfBirth, out DateTime birthDate))
        {
            var today = DateTime.Today;
            var age = today.Year - birthDate.Year;

            // Adjust if the user's birthday hasn't occurred yet this year
            if (birthDate.Date > today.AddYears(-age))
            {
                age--;
            }

            return age;
        }
        else
        {
            throw new ArgumentException("Invalid date of birth format. Expected format: 'YYYY-MM-DD'.");
        }
    }

    private static decimal GetActivityFactor(string activityLevel)
    {
        return activityLevel.ToLower() switch
        {
            "sedentary" => 1.2m,
            "lightly active" => 1.375m,
            "moderately active" => 1.55m,
            "very active" => 1.725m,
            "extra active" => 1.9m,
            _ => 1.2m // Default to sedentary
        };
    }
}