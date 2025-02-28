using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Components;
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
            .FirstOrDefault(d=> d.Id ==id);

        return Ok(exerciselogs);
    }

    
    

    
    
}