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

public class ExerciseLogController : ControllerBase
{
    private readonly DataContext _context;

    public ExerciseLogController(DataContext context)
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

    // Check if the User exists
    var user = _context.Users.FirstOrDefault(u => u.Id == createDto.UserId);
    if (user == null)
    {
        response.AddError("user", "User not found.");
        return NotFound(response);
    }

    // Check if the Exercise exists
    var exercise = _context
        .Set<Exercise>()
        .FirstOrDefault(f => f.Id == createDto.ExerciseId);
    
    if (exercise == null)
    {
        response.AddError("exercise", "Exercise not found.");
        return NotFound(response);
    }

    double metValue = 8.0; // Placeholder MET value; replace with actual MET value based on exercise

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









}