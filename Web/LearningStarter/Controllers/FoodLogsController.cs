using System;
using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace LearningStarter.Controllers;

[ApiController]
[Route("api/food-logs")]
public class FoodLogsController : ControllerBase
{
    private readonly DataContext _context;

    public FoodLogsController(DataContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();

        response.Data = _context
            .Set<FoodLog>()
            .Include(fl => fl.Food) 
            .ThenInclude(f => f.Nutrients) 
            .ThenInclude(n => n.NutrientType) 
            .Include(fl => fl.User) 
            .Select(x => new FoodLogGetDto
            {
                Id = x.Id,
                UserId = x.UserId,
                FoodId = x.FoodId,
                FoodName = x.Food.Name,
                ServingSize = x.ServingSize,
                MealTime = x.MealTime,
                Calories = x.Calories,
                CaloriesPerServing = x.Food.Nutrients
                    .FirstOrDefault(n => n.NutrientType.Name == "Calories") != null ? x.Food.Nutrients
                    .FirstOrDefault(n => n.NutrientType.Name == "Calories").Value : 0, 
                CreateDate = x.CreateDate,
                UpdatedDate = x.UpdatedDate
            })
            .ToList();

        return Ok(response);
    }
    
    
    [HttpGet("{id}")]
    public IActionResult GetById(
        [FromRoute] int id)
    {
        var response = new Response();

        var foodLog = _context
            .Set<FoodLog>()
            .Include(fl => fl.Food) 
            .ThenInclude(f => f.Nutrients) 
            .ThenInclude(n => n.NutrientType) 
            .Include(fl => fl.User)
            .FirstOrDefault(x => x.Id == id);

        if (foodLog == null)
        {
            response.AddError("id", "There was a problem finding the food log.");
        }

        if (response.HasErrors)
        {
            return NotFound(response);
        }

        var foodLogGetDto = new FoodLogGetDto
        {
            Id = foodLog.Id,
            UserId = foodLog.UserId,
            FoodId = foodLog.FoodId,
            FoodName = foodLog.Food.Name,
            ServingSize = foodLog.ServingSize,
            MealTime = foodLog.MealTime,
            CaloriesPerServing = foodLog.Food.Nutrients
                .FirstOrDefault(n => n.NutrientType.Name == "Calories")?.Value ?? 0, 
            Calories = foodLog.Calories,
            CreateDate = foodLog.CreateDate,
            UpdatedDate = foodLog.UpdatedDate,
        };

        response.Data = foodLogGetDto;

        return Ok(response);
    }

    [HttpGet("user/{userId}")]
    public IActionResult GetByUserId(
        [FromRoute] int userId,
        [FromQuery] DateTimeOffset? date = null)
    {
        var response = new Response();

        var query = _context
            .Set<FoodLog>()
            .Include(fl => fl.Food)
            .ThenInclude(f => f.Nutrients)
            .ThenInclude(n => n.NutrientType)
            .Where(x => x.UserId == userId);

        if (date.HasValue)
        {
            // Filter by the specific date (ignoring time)
            var startDate = date.Value.Date;
            var endDate = startDate.AddDays(1);
            query = query.Where(x => x.CreateDate >= startDate && x.CreateDate < endDate);
        }

        response.Data = query
            .Select(x => new FoodLogGetDto
            {
                Id = x.Id,
                UserId = x.UserId,
                FoodId = x.FoodId,
                FoodName = x.Food.Name,
                ServingSize = x.ServingSize,
                MealTime = x.MealTime,
                CaloriesPerServing = x.Food.Nutrients
                    .FirstOrDefault(n => n.NutrientType.Name == "Calories") != null ? x.Food.Nutrients
                    .FirstOrDefault(n => n.NutrientType.Name == "Calories").Value : 0, // Fetch calories per serving
                Calories = x.Calories,
                CreateDate = x.CreateDate,
                UpdatedDate = x.UpdatedDate
            })
            .ToList();

        return Ok(response);
    }

    [HttpGet("user/{userId}/calories-consumed-per-day")]
public IActionResult GetDailyCalories(
    [FromRoute] int userId,
    [FromQuery] DateTimeOffset date)
{
    var response = new Response();
    
    var user = _context.Users.FirstOrDefault(u => u.Id == userId);
    if (user == null)
    {
        response.AddError("userId", "User not found.");
        return NotFound(response);
    }

    var goal = _context.Goals.FirstOrDefault(g => g.UserId == userId);
    if (goal == null)
    {
        response.AddError("goal", "No goal set for this user.");
        return NotFound(response);
    }

    decimal dailyCalorieGoal;
    try
    {
        dailyCalorieGoal = FoodCalorieCalculator.CalculateDailyCalorieGoal(
            currentWeight: user.Weight,
            height: user.Height,
            dateOfBirth: user.DateofBirth,
            gender: user.Gender,
            activityLevel: goal.ActivityLevel,
            targetWeight: goal.Value,
            timePeriodInDays: goal.TimePeriod
        );
    }
    catch (ArgumentException ex)
    {
        response.AddError("dateOfBirth", ex.Message);
        return BadRequest(response);
    }
    
    var startDate = date.Date;
    var endDate = startDate.AddDays(1);

    var foodLogs = _context.FoodLogs
        .Include(fl => fl.Food)
        .ThenInclude(f => f.Nutrients)
        .ThenInclude(n => n.NutrientType)
        .Where(x => x.UserId == userId && x.CreateDate >= startDate && x.CreateDate < endDate)
        .ToList();

    var totalCalories = foodLogs.Sum(x => x.Calories);
    
    string calorieStatus;
    decimal calorieDifference = totalCalories - dailyCalorieGoal;

    if (calorieDifference <= -200)
    {
        calorieStatus = "Less calories for today.";
    }
    else if (calorieDifference >= 100)
    {
        calorieStatus = "Eaten more calories for today.";
    }
    else
    {
        calorieStatus = "Calories are within the expected range.";
    }
    
    var dailyCaloriesDto = new 
    {
        Date = date.Date,
        DailyCalorieGoal = dailyCalorieGoal,
        TotalCalories = totalCalories,
        CalorieDifference = calorieDifference,
        CalorieStatus = calorieStatus,
        FoodLogs = foodLogs.Select(x => new FoodLogGetDto
        {
            Id = x.Id,
            UserId = x.UserId,
            FoodId = x.FoodId,
            FoodName = x.Food.Name,
            ServingSize = x.ServingSize,
            MealTime = x.MealTime,
            CaloriesPerServing = x.Food.Nutrients
                .FirstOrDefault(n => n.NutrientType.Name == "Calories")?.Value ?? 0,
            Calories = x.Calories,
            CreateDate = x.CreateDate,
            UpdatedDate = x.UpdatedDate
        }).ToList()
    };

    response.Data = dailyCaloriesDto;
    return Ok(response);
}
    
//     [HttpGet("user/{userId}/daily-calorie-goal")]
// public IActionResult GetDailyCalorieGoal(
//     [FromRoute] int userId)
// {
//     var response = new Response();
//     
//     var user = _context.Users.FirstOrDefault(u => u.Id == userId);
//     if (user == null)
//     {
//         response.AddError("userId", "User not found.");
//         return NotFound(response);
//     }
//     
//     var goal = _context.Goals.FirstOrDefault(g => g.UserId == userId);
//     if (goal == null)
//     {
//         response.AddError("goal", "No goal set for this user.");
//         return NotFound(response);
//     }
//
//     try
//     {
//         decimal dailyCalorieGoal = FoodCalorieCalculator.CalculateDailyCalorieGoal(
//             currentWeight: user.Weight, 
//             height: user.Height, 
//             dateOfBirth: user.DateofBirth, 
//             gender: user.Gender, 
//             activityLevel: goal.ActivityLevel, 
//             targetWeight: goal.Value, 
//             timePeriodInDays: goal.TimePeriod
//         );
//         
//         var result = new
//         {
//             UserId = userId,
//             DailyCalorieGoal = dailyCalorieGoal,
//             CurrentWeight = user.Weight,
//             TargetWeight = goal.Value,
//             Height = user.Height,
//             Age = FoodCalorieCalculator.CalculateAge(user.DateofBirth),
//             Gender = user.Gender,
//             ActivityLevel = goal.ActivityLevel,
//             TimePeriodInDays = goal.TimePeriod,
//         };
//
//         response.Data = result;
//         return Ok(response);
//     }
//     catch (ArgumentException ex)
//     {
//         response.AddError("dateOfBirth", ex.Message);
//         return BadRequest(response);
//     }
// }
    
    [HttpPost]
    public IActionResult Create(
        [FromBody] FoodLogCreateDto foodLogCreateDto)
    {
        var response = new Response();

        if (foodLogCreateDto.UserId <= 0)
        {
            response.AddError("userId", "User ID must be provided.");
        }

        if (foodLogCreateDto.FoodId <= 0)
        {
            response.AddError("foodId", "Food ID must be provided.");
        }

        if (foodLogCreateDto.ServingSize <= 0)
        {
            response.AddError("servingSize", "Serving size must be greater than zero.");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        
        var food = _context
            .Set<Food>()
            .Include(f => f.Nutrients)
            .ThenInclude(n => n.NutrientType)
            .FirstOrDefault(f => f.Id == foodLogCreateDto.FoodId);

        if (food == null)
        {
            response.AddError("foodId", "Food not found.");
            return BadRequest(response);
        }
        
        var calorieNutrient = food.Nutrients
            .FirstOrDefault(n => n.NutrientType.Name == "Calories");

        if (calorieNutrient == null)
        {
            response.AddError("calories", "Calorie information not found for this food.");
            return BadRequest(response);
        }
        
        var totalCalories = calorieNutrient.Value * foodLogCreateDto.ServingSize;
        
        DateTimeOffset recordDate = foodLogCreateDto.CreateDate != default ? foodLogCreateDto.CreateDate : DateTimeOffset.UtcNow;

        // Create the new food log
        var foodLogToCreate = new FoodLog
        {
            UserId = foodLogCreateDto.UserId,
            FoodId = foodLogCreateDto.FoodId,
            ServingSize = foodLogCreateDto.ServingSize,
            MealTime = foodLogCreateDto.MealTime,
            Calories = totalCalories,
            CreateDate = recordDate,
            UpdatedDate = recordDate,
        };

        _context.FoodLogs.Add(foodLogToCreate);
        _context.SaveChanges();

        var foodLogGetDto = new FoodLogGetDto
        {
            Id = foodLogToCreate.Id,
            UserId = foodLogToCreate.UserId,
            FoodId = foodLogToCreate.FoodId,
            FoodName = foodLogToCreate.Food.Name,
            ServingSize = foodLogToCreate.ServingSize,
            MealTime = foodLogToCreate.MealTime,
            CaloriesPerServing = calorieNutrient.Value,
            Calories = foodLogToCreate.Calories,
            CreateDate = foodLogToCreate.CreateDate,
            UpdatedDate = foodLogToCreate.UpdatedDate
        };

        response.Data = foodLogGetDto;

        return Created("", response);
    }

    [HttpPut("{id}")]
    public IActionResult Update(
        [FromRoute] int id,
        [FromBody] FoodLogUpdateDto foodLogUpdateDto)
    {
        var response = new Response();

        if (foodLogUpdateDto == null)
        {
            response.AddError("id", "There was a problem editing the food log.");
            return NotFound(response);
        }

        var foodLogToEdit = _context
            .Set<FoodLog>().Include(foodLog => foodLog.Food)
            .FirstOrDefault(x => x.Id == id);

        if (foodLogToEdit == null)
        {
            response.AddError("id", "Could not find food log to edit.");
            return NotFound(response);
        }

        if (foodLogUpdateDto.UserId <= 0)
        {
            response.AddError("userId", "User ID must be provided.");
        }

        if (foodLogUpdateDto.FoodId <= 0)
        {
            response.AddError("foodId", "Food ID must be provided.");
        }

        if (foodLogUpdateDto.ServingSize <= 0)
        {
            response.AddError("servingSize", "Serving size must be greater than zero.");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        
        var food = _context
            .Set<Food>()
            .Include(f => f.Nutrients)
            .ThenInclude(n => n.NutrientType)
            .FirstOrDefault(f => f.Id == foodLogUpdateDto.FoodId);

        if (food == null)
        {
            response.AddError("foodId", "Food not found.");
            return BadRequest(response);
        }
        
        var calorieNutrient = food.Nutrients
            .FirstOrDefault(n => n.NutrientType.Name == "Calories");

        if (calorieNutrient == null)
        {
            response.AddError("calories", "Calorie information not found for this food.");
            return BadRequest(response);
        }
        
        var totalCalories = calorieNutrient.Value * foodLogUpdateDto.ServingSize;

        foodLogToEdit.UserId = foodLogUpdateDto.UserId;
        foodLogToEdit.FoodId = foodLogUpdateDto.FoodId;
        foodLogToEdit.ServingSize = foodLogUpdateDto.ServingSize;
        foodLogToEdit.MealTime = foodLogUpdateDto.MealTime;
        foodLogToEdit.Calories = totalCalories;
        foodLogToEdit.UpdatedDate = foodLogUpdateDto.UpdatedDate != default ? foodLogUpdateDto.UpdatedDate : DateTimeOffset.UtcNow;

        _context.SaveChanges();

        var foodLogToReturn = new FoodLogGetDto
        {
            Id = foodLogToEdit.Id,
            UserId = foodLogToEdit.UserId,
            FoodId = foodLogToEdit.FoodId,
            FoodName = foodLogToEdit.Food.Name,
            ServingSize = foodLogToEdit.ServingSize,
            MealTime = foodLogToEdit.MealTime,
            CaloriesPerServing = calorieNutrient.Value,
            Calories = foodLogToEdit.Calories,
            CreateDate = foodLogToEdit.CreateDate,
            UpdatedDate = foodLogToEdit.UpdatedDate
        };

        response.Data = foodLogToReturn;
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteFoodLog(int id)
    {
        var response = new Response();

        var foodLogToDelete = _context
            .Set<FoodLog>()
            .FirstOrDefault(x => x.Id == id);

        if (foodLogToDelete == null)
        {
            response.AddError("id", "There was a problem deleting the food log.");
            return NotFound(response);
        }

        _context.Set<FoodLog>().Remove(foodLogToDelete);
        _context.SaveChanges();

        response.Data = "Food log deleted successfully.";
        return Ok(response);
    }
    
     
    [HttpGet("count/user/{userId}/range")]
    public IActionResult GetCountByUserId([FromRoute] int userId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate )
    {
        var response = new Response();

        var count = _context
            .Set<FoodLog>()
            .Where(x => x.UserId == userId && x.UpdatedDate >= startDate && x.UpdatedDate <= endDate )
            .Count();
        
        
        response.Data = count;
        return Ok(response);
    }
    
    [HttpGet("user/{userId}/user-meal-time-totals")]
    public IActionResult GetUserMealTimeTotals(int userId, [FromQuery] DateTime? date = null)
    {
        try
        {
            var queryDate = date ?? DateTime.Today;
            
            var response = new Response();
    
            // Get all food logs for the specified user on the given date
            var logs = _context.FoodLogs
                .Where(log => log.UserId == userId && 
                              log.UpdatedDate.Date == queryDate.Date)
                .ToList();

            var totals = new
            {
                Breakfast = logs.Where(l => l.MealTime == "Breakfast").Sum(l => l.Calories), 
                Lunch = logs.Where(l => l.MealTime == "Lunch").Sum(l => l.Calories),
                Dinner = logs.Where(l => l.MealTime == "Dinner").Sum(l => l.Calories),
                Snack = logs.Where(l => l.MealTime == "Snack").Sum(l => l.Calories),
                Total = logs.Sum(l => l.Calories)
            };
            response.Data = totals;
            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Failed to fetch meal time totals", details = ex.Message });
        }
    }

}
