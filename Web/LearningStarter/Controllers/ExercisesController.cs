using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;

namespace LearningStarter.Controllers;

[ApiController]
[Route("api/exercises")]
public class ExerciseController : ControllerBase
{
    private readonly DataContext _context;

    public ExerciseController(DataContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();

        var data = _context
            .Set<Exercise>()
            .Select(exercise => new ExerciseGetDto
            {
                Id = exercise.Id,
                Name = exercise.Name,
                Description = exercise.Description,
            })
            .ToList();
        response.Data = data;
        return Ok(response);
    }
    [HttpGet("{id}")]
    public IActionResult GetExerciseById(int id)
    {
        var exercises = _context
            .Set<Exercise>()
            .Select(d => new ExerciseGetDto
            {
                Id = d.Id,
                Name = d.Name,
                Description = d.Description,
            })
            .FirstOrDefault(d => d.Id == id);

        return Ok(exercises);
    }


    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] ExerciseUpdateDto updateDto)
    {
        var response = new Response();
        var exerciseToUpdate = _context.Set<Exercise>().FirstOrDefault(exercise => exercise.Id == id);
        
        if (exerciseToUpdate == null)
        {
            response.AddError("id","Exercise not found");
            return NotFound(response);
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        exerciseToUpdate.Name = updateDto.Name;
        exerciseToUpdate.Description = updateDto.Description;
        _context.SaveChanges();
        var exerciseToReturn = new ExerciseGetDto
        {
            Id = exerciseToUpdate.Id,
            Name = exerciseToUpdate.Name,
            Description = exerciseToUpdate.Description,
        };
        response.Data = exerciseToReturn;
        return Ok(response);
    }

    [HttpPost]
    public IActionResult Create([FromBody] ExerciseCreateDto createDto)
    {
        var response = new Response();
        if (string.IsNullOrEmpty(createDto.Name))
        {
            response.AddError(nameof(createDto.Name), "Name must not be  empty");
        }

        if (string.IsNullOrEmpty(createDto.Description))
        {
            response.AddError(nameof(createDto.Description), "Description must not be  empty");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        var exerciseToCreate = new Exercise()
        {
            Name = createDto.Name,
            Description = createDto.Description,
        };
        _context.Set<Exercise>().Add(exerciseToCreate);
        _context.SaveChanges();

        var exerciseToReturn = new ExerciseGetDto
        {
            Id = exerciseToCreate.Id,
            Name = exerciseToCreate.Name,
            Description = exerciseToCreate.Description,
        };
        response.Data = exerciseToReturn;
        return Created("", response);


    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();
        var exerciseToDelete = _context.Set<Exercise>().FirstOrDefault(exercise => exercise.Id == id);

        if (exerciseToDelete == null)
        {
            response.AddError("id","Exercise not found");
            return NotFound(response);
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        
        _context.Set<Exercise>().Remove(exerciseToDelete);
        _context.SaveChanges();
        response.Data = true;
        return Ok(response);
    }
}



