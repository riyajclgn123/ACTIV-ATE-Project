using System;
using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace LearningStarter.Controllers;

[ApiController]
[Route("api/goal")]
public class GoalController : ControllerBase
{
    private readonly DataContext _dataContext;

    public GoalController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();

        var data = _dataContext
            .Set<Goal>()
            .Select(goal => new GoalGetDto
            {
                Id = goal.Id,
                UserId = goal.UserId,
                Value = goal.Value,
                TimePeriod = goal.TimePeriod,
                CreateDate = goal.CreateDate,
                UpdateDate = goal.UpdateDate,
                Type = goal.Type,

            })
            .ToList();

        response.Data = data;
        
        return Ok(response);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var response = new Response();

        var data = _dataContext
            .Set<Goal>()
            .Select(goal => new GoalGetDto
            {
                Id = goal.Id,
                UserId = goal.UserId,
                Value = goal.Value,
                TimePeriod = goal.TimePeriod,
                CreateDate = goal.CreateDate,
                UpdateDate = goal.UpdateDate,
                Type = goal.Type,
            })
            .FirstOrDefault(goal => goal.Id == id);
        
        response.Data = data;
        
        return Ok(response);
    }

    [HttpPost]
    public IActionResult Create([FromBody] GoalCreateDto createDto)
    {
        var response = new Response();

        var goalToCreate = new Goal
        {
            UserId = createDto.UserId,
            Value = createDto.Value,
            TimePeriod = createDto.TimePeriod,
            CreateDate = createDto.CreateDate,
            UpdateDate = createDto.UpdateDate,
            Type = createDto.Type,
        };
        _dataContext.Add(goalToCreate);
        _dataContext.SaveChanges();

        var goalToReturn = new Goal
        {
            Id = goalToCreate.Id,
            UserId = goalToCreate.UserId,
            Value = goalToCreate.Value,
            TimePeriod = goalToCreate.TimePeriod,
            CreateDate = goalToCreate.CreateDate,
            UpdateDate = goalToCreate.UpdateDate,
            Type = goalToCreate.Type,
        };
        response.Data = goalToReturn;
        return Created("", response);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] GoalUpdateDto updateDto)
    {
        var response = new Response();

        if (string.IsNullOrEmpty(updateDto.TimePeriod))
        {
           response.AddError(nameof(updateDto.TimePeriod), "TimePeriod is required"); 
        }

        if (string.IsNullOrEmpty(updateDto.Type))
        {
            response.AddError(nameof(updateDto.Type), "Type is required");
        }
        
        var GoalToUpdate = _dataContext
            .Set<Goal>()
            .FirstOrDefault(x => x.Id == id);
        if (GoalToUpdate == null)
        {
            response.AddError("Id", "Goal not found");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        
        GoalToUpdate.Value = updateDto.Value;
        GoalToUpdate.TimePeriod = updateDto.TimePeriod;
        GoalToUpdate.CreateDate = updateDto.CreateDate;
        GoalToUpdate.UpdateDate = updateDto.UpdateDate;
        _dataContext.SaveChanges();

        var goalToReturn = new GoalGetDto
        {
            UserId = updateDto.UserId,
            Value = updateDto.Value,
            TimePeriod = updateDto.TimePeriod,
            CreateDate = updateDto.CreateDate,
            UpdateDate = updateDto.UpdateDate,
            Type = updateDto.Type,
        };
        response.Data = goalToReturn;
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();

        var goalToDelete = _dataContext.Set<Goal>()
            .FirstOrDefault(goal => goal.Id == id);
        
        if (goalToDelete == null)
        {
            response.AddError("Id","Goal not found");
        }
        if (response.HasErrors)
        {
           return BadRequest(response); 
        }
        
        _dataContext.Remove(goalToDelete);
        _dataContext.SaveChanges();

        response.Data = true;
        return Ok(response);
    }
}


    


