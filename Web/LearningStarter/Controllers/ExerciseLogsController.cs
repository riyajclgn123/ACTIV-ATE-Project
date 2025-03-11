using System;
using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using LearningStarter.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearningStarter.Controllers;
[ApiController]
[Route("api/exerciselogs")]

public class ExerciseLogsController : ControllerBase
{
    private readonly DataContext _context;

    public ExerciseLogsController(DataContext context)
    {
        _context = context;
    }
    
    [HttpGet]
    public IActionResult GetAllExerciseLog()
    {
        var response = new Response();

        var exerciselogs = _context
            .Set<ExerciseLog>()
            .Include(d => d.Exercise)
            .Include(d => d.User)
            .Select(d => new ExerciseLogGetDto
            {
                Id = d.Id,
                UserId = d.UserId,
                ExerciseId = d.ExerciseId,
                ExerciseName = d.Exercise.Name,
                Duration = d.Duration,
                Rep = d.Rep,
                CaloriesBurned = d.CaloriesBurned,
                CreateDate = d.CreateDate,
                UpdatedDate = d.UpdatedDate,
            })
            .ToList();

        response.Data = exerciselogs;

        return Ok(response);
    }

    [HttpGet("{id}")]
    public IActionResult GetExerciseLogById(int id)
    {
        var exerciselogs = _context
            .Set<ExerciseLog>()
            .Include(d => d.Exercise)
            .Include(d => d.User)
            .Select(d => new ExerciseLogGetDto
            {
                Id = d.Id,
                UserId = d.UserId,
                ExerciseId = d.ExerciseId,
                ExerciseName = d.Exercise.Name,
                Duration = d.Duration,
                Rep = d.Rep,
                CaloriesBurned = d.CaloriesBurned,
                CreateDate = d.CreateDate,
                UpdatedDate = d.UpdatedDate,
            })
            .FirstOrDefault(d => d.Id == id);

        return Ok(exerciselogs);
    }
    
    [HttpGet("user/{userId}")]
    public IActionResult GetExerciseLogsByUserId(int userId)
    {
        var response = new Response();
        var userExists = _context
            .Set<User>()
            .Any(u => u.Id == userId);
        if (!userExists)
        {
            response.AddError("userId", "User not found.");
            return NotFound(response);
        }
        var exerciselogs = _context
            .Set<ExerciseLog>()
            .Include(d => d.Exercise)
            .Where(d => d.UserId == userId)
            .Select(d => new ExerciseLogGetDto
            {
                Id = d.Id,
                UserId = d.UserId,
                ExerciseId = d.ExerciseId,
                ExerciseName = d.Exercise.Name,
                Duration = d.Duration,
                Rep = d.Rep,
                CaloriesBurned = d.CaloriesBurned,
                CreateDate = d.CreateDate,
                UpdatedDate = d.UpdatedDate,
            })
            .ToList();
        response.Data = exerciselogs;
        return Ok(response);
    }
    
    [HttpGet("/api/users/{userId}/calories-per-day")]
    public IActionResult GetDailyCalorieBurnedByUser(int userId, [FromQuery] DateTime? date = null)
    {
        var response = new Response();

        var userExists = _context.Users.Any(u => u.Id == userId);
        if (!userExists)
        {
            response.AddError("userId", "User not found.");
            return NotFound(response);
        }

        var query = _context
            .Set<ExerciseLog>()
            .Where(d => d.UserId == userId)
            .GroupBy(d => d.CreateDate.Date) // Group by date (ignoring time)
            .Select(g => new 
            {
                Date = g.Key,
                TotalCaloriesBurned = g.Sum(d => d.CaloriesBurned)
            });

        if (date.HasValue)
        {
            query = query.Where(d => d.Date == date.Value.Date); // Filter for a specific date
        }
        var dailyCalories = query.OrderByDescending(d => d.Date).ToList();
        response.Data = dailyCalories;
        return Ok(response);
    }
    
    [HttpPost]
public IActionResult CreateExerciseLog([FromBody] ExerciseLogCreateDto createDto)
{
    var response = new Response();

    if (createDto == null || createDto.ExerciseId == 0 || createDto.UserId == 0)
    {
        response.AddError("validation", "ExerciseId and UserId are required.");
        return BadRequest(response);
    }

    if (!TimeSpan.TryParse(createDto.Duration, out TimeSpan duration))
    {
        response.AddError("duration", "Invalid duration format. Please use the format 'hh:mm:ss'.");
        return BadRequest(response);
    }
    
    var user = _context.Users.FirstOrDefault(u => u.Id == createDto.UserId);
    if (user == null)
    {
        response.AddError("user", "User not found.");
        return NotFound(response);
    }
    
    var exercise = _context
        .Set<Exercise>()
        .FirstOrDefault(f => f.Id == createDto.ExerciseId);
    
    if (exercise == null)
    {
        response.AddError("exercise", "Exercise not found.");
        return NotFound(response);
    }

    double metValue = 8.0; 

    // Calculate calories burned
    decimal caloriesBurned = ExerciseCalorieCalculator.CalculateCaloriesBurned(duration, user.Weight, metValue);

    var exerciselogToCreate = new ExerciseLog
    {
        UserId = createDto.UserId,
        ExerciseId = createDto.ExerciseId,
        ExerciseName = exercise.Name, 
        Duration = duration,
        CaloriesBurned = caloriesBurned,
        Rep = createDto.Rep,
        CreateDate = DateTime.UtcNow,
    };

    _context.ExerciseLogs.Add(exerciselogToCreate);
    _context.SaveChanges();

    var exerciselogToReturn = new ExerciseLogGetDto
    {
        Id = exerciselogToCreate.Id,
        UserId = exerciselogToCreate.UserId,
        ExerciseId = exerciselogToCreate.ExerciseId,
        ExerciseName = exerciselogToCreate.ExerciseName,
        Duration = exerciselogToCreate.Duration,
        Rep = exerciselogToCreate.Rep,
        CaloriesBurned = exerciselogToCreate.CaloriesBurned,
        CreateDate = exerciselogToCreate.CreateDate
    };

    response.Data = exerciselogToReturn;

    return CreatedAtAction(nameof(GetAllExerciseLog), new { id = exerciselogToCreate.Id }, response);
}

    [HttpPut("{id}")]
    public IActionResult UpdateExerciseLog(int id, [FromBody] ExerciseLogUpdateDto updateDto)
    {
        var response = new Response();

        if (updateDto == null)
        {
            response.AddError("validation", "Invalid request data.");
            return BadRequest(response);
        }

        var exerciselog = _context
            .Set<ExerciseLog>()
            .FirstOrDefault(x => x.Id == id);

        if (exerciselog == null)
        {
            response.AddError("id", "Exercise log not found.");
            return NotFound(response);
        }

        if (updateDto.ExerciseId == 0)
        {
            response.AddError("exerciseId", "ExerciseId cannot be empty.");
        }

        if (updateDto.UserId == 0)
        {
            response.AddError("userId", "UserId cannot be empty.");
        }
        var exercise = _context.Set<Exercise>().FirstOrDefault(f => f.Id == updateDto.ExerciseId);
        if (exercise == null)
        {
            response.AddError("exercise", "Exercise not found.");
            return NotFound(response);
        }

        if (!TimeSpan.TryParse(updateDto.Duration, out TimeSpan duration))
        {
            response.AddError("duration", "Invalid duration format. Please use the format 'hh:mm:ss'.");
            return BadRequest(response);
        }
        var user = _context.Users.FirstOrDefault(u => u.Id == updateDto.UserId);
        if (user == null)
        {
            response.AddError("user", "User not found.");
            return NotFound(response);
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        double metValue = 8.0; 
        decimal caloriesBurned = ExerciseCalorieCalculator.CalculateCaloriesBurned(duration, user.Weight, metValue);

        exerciselog.ExerciseId = updateDto.ExerciseId;
        exerciselog.UserId = updateDto.UserId;
        exerciselog.Rep = updateDto.Rep;
        exerciselog.Duration = duration;
        exerciselog.CaloriesBurned = caloriesBurned;
        exerciselog.UpdatedDate = DateTime.UtcNow;

        _context.SaveChanges();

        var exerciselogToReturn = new ExerciseLogGetDto
        {
            Id = exerciselog.Id,
            UserId = exerciselog.UserId,
            ExerciseId = exerciselog.ExerciseId,
            Duration = exerciselog.Duration,
            Rep = exerciselog.Rep,
            CaloriesBurned = exerciselog.CaloriesBurned,
            CreateDate = exerciselog.CreateDate,
            UpdatedDate = exerciselog.UpdatedDate
        };

        response.Data = exerciselogToReturn;
        return Ok(response);
    }
    
    [HttpDelete("{id}")]
    public IActionResult DeleteExerciseLog(int id)
    {
        var response = new Response();

        var exerciselog = _context
            .Set<ExerciseLog>()
            .FirstOrDefault(x => x.Id == id);

        if (exerciselog == null)
        {
            response.AddError("id", "Exercise log not found.");
            return NotFound(response);
        }

        _context.ExerciseLogs.Remove(exerciselog);
        _context.SaveChanges();

        response.Data = "Exercise log deleted successfully.";
        return Ok(response);
    }


}