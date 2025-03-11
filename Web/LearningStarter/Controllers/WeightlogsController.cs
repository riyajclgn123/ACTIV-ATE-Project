using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using LearningStarter.Common;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace LearningStarter.Controllers;

[ApiController]
[Route("api/weightLogs")]
public class WeightLogController : ControllerBase
{
    private readonly DataContext _context;

    public WeightLogController(DataContext context)
    {
        _context = context;
    }
    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();

        var data = _context
            .Set<WeightLog>()
            .Select(weightlog => new WeightLogGetDto
            {
                Id = weightlog.Id,
                UserId = weightlog.UserId,
                Value = weightlog.Value,
                LogDate = weightlog.LogDate,
            })
            .ToList();
        if (!data.Any())
        {
            return NoContent();

        }
        response.Data = data;
        return Ok(response);
        
   }
    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] WeightLogUpdateDto updateDto)
    {
        var response = new Response();
        var weightlogToUpdate = _context.Set<WeightLog>().FirstOrDefault(weightlog => weightlog.Id == id);
        
        if (weightlogToUpdate == null)
        {
            response.AddError("id","WeightLog not found");
            return NotFound(response);
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        weightlogToUpdate.Value = updateDto.Value;
        weightlogToUpdate.UserId = updateDto.UserId;
        weightlogToUpdate.LogDate = updateDto.LogDate;
        _context.SaveChanges();
        var weightlogToReturn = new WeightLogGetDto
        {
            Id = weightlogToUpdate.Id,
            UserId = weightlogToUpdate.UserId,
            Value = weightlogToUpdate.Value,
            LogDate = weightlogToUpdate.LogDate,
        };
        response.Data = weightlogToReturn;
        return Ok(response);
    } 
    [HttpPost]
    public IActionResult Create([FromBody] WeightLogCreateDto createDto)
    {
        var response = new Response();
        if (createDto == null)
        {
            response.AddError("createDto", "CreateDto is null");
            return BadRequest(response);
        }

        if (createDto.UserId <= 0)
        {
            response.AddError(nameof(createDto.UserId), "UserId must be a positive number.");
        }

        if (createDto.Value <= 0)
        {
            response.AddError(nameof(createDto.Value), "Value must be greater than zero.");
        }

        if (createDto.LogDate == default)
        {
            response.AddError(nameof(createDto.LogDate), "Invalid log date.");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        var weightlogToCreate = new WeightLog()
        {
            UserId = createDto.UserId,
            Value = createDto.Value,
            LogDate = createDto.LogDate,
        };
        _context.Set<WeightLog>().Add(weightlogToCreate);
        _context.SaveChanges();

        var weightlogToReturn = new WeightLogGetDto
        {
            Id = weightlogToCreate.Id,
            UserId = weightlogToCreate.UserId,
            Value = weightlogToCreate.Value,
            LogDate = weightlogToCreate.LogDate,
        };
        response.Data = weightlogToReturn;
        return Created("", response);
        
    }
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();
        var weightlogToDelete = _context.Set<WeightLog>().FirstOrDefault(weightlog => weightlog.Id == id);

        if (weightlogToDelete == null)
        {
            response.AddError("id","weightlog not found");
            return NotFound(response);
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        
        _context.Set<WeightLog>().Remove(weightlogToDelete);
        _context.SaveChanges();
        response.Data = true;
        return Ok(response);
    }
}

