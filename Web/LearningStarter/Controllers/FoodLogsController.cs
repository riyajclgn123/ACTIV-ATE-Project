using System;
using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace LearningStarter.Controllers;

[ApiController]
[Route("api/foodlogs")]
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
            .Include(fl => fl.Food) // Include Food
            .ThenInclude(f => f.Nutrients) // Include Nutrients for Food
            .ThenInclude(n => n.NutrientType) // Include NutrientType for Nutrients
            .Include(fl => fl.User) // Include User
            .Select(x => new FoodLogGetDto
            {
                Id = x.Id,
                UserId = x.UserId,
                FoodId = x.FoodId,
                FoodName = x.Food.Name,
                ServingSize = x.ServingSize,
                Calories = x.Calories,
                // CaloriesPerServing = x.Food.Nutrients
                //     .FirstOrDefault(n => n.NutrientType.Name == "Calories")?.Value ?? 0, // Fetch calories per serving
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
            .Include(fl => fl.Food) // Include Food
            .ThenInclude(f => f.Nutrients) // Include Nutrients for Food
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
            CaloriesPerServing = foodLog.Food.Nutrients
                .FirstOrDefault(n => n.NutrientType.Name == "Calories")?.Value ?? 0, // Fetch calor
            Calories = foodLog.Calories,
            CreateDate = foodLog.CreateDate,
            UpdatedDate = foodLog.UpdatedDate
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
                Calories = x.Calories,
                CreateDate = x.CreateDate,
                UpdatedDate = x.UpdatedDate
            })
            .ToList();

        return Ok(response);
    }

    [HttpGet("user/{userId}/daily-calories")]
    public IActionResult GetDailyCalories(
        [FromRoute] int userId,
        [FromQuery] DateTimeOffset date)
    {
        var response = new Response();

        // Filter by the specific date (ignoring time)
        var startDate = date.Date;
        var endDate = startDate.AddDays(1);

        var foodLogs = _context.FoodLogs
            .Include(fl => fl.Food)
            .ThenInclude(f => f.Nutrients) // Include Nutrients for Food
            .ThenInclude(n => n.NutrientType)
            .Where(x => x.UserId == userId && x.CreateDate >= startDate && x.CreateDate < endDate)
            .ToList();

        if (foodLogs.Count == 0)
        {
            response.AddError("date", "No food logs found for this date.");
            return NotFound(response);
        }
        

        var totalCalories = foodLogs.Sum(x => x.Calories);
        
        var dailyCaloriesDto = new 
        {
            Date = date.Date,
            TotalCalories = totalCalories,
            FoodLogs = foodLogs.Select(x => new FoodLogGetDto
            {
                Id = x.Id,
                UserId = x.UserId,
                FoodId = x.FoodId,
                FoodName = x.Food.Name,
                ServingSize = x.ServingSize,
                CaloriesPerServing = x.Food.Nutrients
                    .FirstOrDefault(n => n.NutrientType.Name == "Calories")?.Value ?? 0, // Fetch calories per serving
                Calories = x.Calories,
                CreateDate = x.CreateDate,
                UpdatedDate = x.UpdatedDate
            }).ToList()
        };

        response.Data = dailyCaloriesDto;

        return Ok(response);
    }

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
        

        // Get the food with its nutrient information
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

        // Find the Calories nutrient type
        var calorieNutrient = food.Nutrients
            .FirstOrDefault(n => n.NutrientType.Name == "Calories");

        if (calorieNutrient == null)
        {
            response.AddError("calories", "Calorie information not found for this food.");
            return BadRequest(response);
        }

        // Calculate the calories based on serving size
        var totalCalories = calorieNutrient.Value * foodLogCreateDto.ServingSize;

        // Create the new food log
        var foodLogToCreate = new FoodLog
        {
            UserId = foodLogCreateDto.UserId,
            FoodId = foodLogCreateDto.FoodId,
            ServingSize = foodLogCreateDto.ServingSize,
            Calories = totalCalories,
            CreateDate = foodLogCreateDto.CreateDate != default ? foodLogCreateDto.CreateDate : DateTimeOffset.UtcNow,
            UpdatedDate = DateTimeOffset.UtcNow
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

        // Get the food with its nutrient information
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

        // Find the Calories nutrient type
        var calorieNutrient = food.Nutrients
            .FirstOrDefault(n => n.NutrientType.Name == "Calories");

        if (calorieNutrient == null)
        {
            response.AddError("calories", "Calorie information not found for this food.");
            return BadRequest(response);
        }

        // Calculate the calories based on serving size
        var totalCalories = calorieNutrient.Value * foodLogUpdateDto.ServingSize;

        foodLogToEdit.UserId = foodLogUpdateDto.UserId;
        foodLogToEdit.FoodId = foodLogUpdateDto.FoodId;
        foodLogToEdit.ServingSize = foodLogUpdateDto.ServingSize;
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
            CaloriesPerServing = calorieNutrient.Value,
            Calories = foodLogToEdit.Calories,
            CreateDate = foodLogToEdit.CreateDate,
            UpdatedDate = foodLogToEdit.UpdatedDate
        };

        response.Data = foodLogToReturn;
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
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
        _context.SaveChangesAsync();

        response.Data = true;
        return Ok(response);
    }
}
