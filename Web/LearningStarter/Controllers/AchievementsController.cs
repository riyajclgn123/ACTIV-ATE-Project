
using System;
using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;

namespace LearningStarter.Controllers;
[ApiController]
[Route("api/achievements")]
public class AchievementsController : ControllerBase
{
    private readonly DataContext _dataContext;
    public AchievementsController(DataContext dataContext)
    {
     _dataContext = dataContext;   
    }

    [HttpGet]
    public IActionResult SGetAll()
    {
        var response = new Response();
        
        var data = _dataContext
            .Set<Achievement>()
            .Select(achievements => new AchievementGetDto
            {
                Id = achievements.Id,
                UserId = achievements.UserId,
                Type = achievements.Type,
                Description = achievements.Description,
                CreateDate = achievements.CreateDate,

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
            .Set<Achievement>()
            .Select(achievements => new AchievementGetDto
            {
                Id = achievements.Id,
                UserId = achievements.UserId,
                Type = achievements.Type,
                Description = achievements.Description,
                CreateDate = achievements.CreateDate,

            })
            .FirstOrDefault(achievements => achievements.Id == id);
        
        response.Data = data;   
        
        return Ok(response);
    }

    [HttpPost]
    public IActionResult Create([FromBody] AchievementCreateDto createDto)
    {
        var response = new Response();

        if (string.IsNullOrEmpty(createDto.Type))
        {
            response.AddError(nameof(createDto.Type),"Type is required");
        }

        if (string.IsNullOrEmpty(createDto.Description))
        {
            response.AddError(nameof(createDto.Description),"Description is required");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        
        var achievementsToCreate = new Achievement
        {
            UserId = createDto.UserId,
            Type = createDto.Type,
            Description = createDto.Description,
            CreateDate = createDto.CreateDate,
        };
        _dataContext.Set<Achievement>().Add(achievementsToCreate);
        _dataContext.SaveChanges();

        var achievementsToReturn = new Achievement
        {
            Id = achievementsToCreate.Id,
            UserId = achievementsToCreate.UserId,
            Type = achievementsToCreate.Type,
            Description = achievementsToCreate.Description,
            CreateDate = achievementsToCreate.CreateDate,
        };
            response.Data = achievementsToReturn;
            return Created("", response); 
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] AchievementUpdateDto updateDto)
    {
        var response = new Response();
        
        if (string.IsNullOrEmpty(updateDto.Type))
        {
            response.AddError(nameof(updateDto.Type),"Type is required");
        }

        if (string.IsNullOrEmpty(updateDto.Description))
        {
            response.AddError(nameof(updateDto.Description),"Description is required");
        }
        
        var achievementsToUpdate = _dataContext.Set<Achievement>()
            .FirstOrDefault(achievements => achievements.Id == id);
        
        if (achievementsToUpdate == null)
        {
            response.AddError("id", "Achievement not found");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        achievementsToUpdate.UserId = updateDto.UserId;
        achievementsToUpdate.Type = updateDto.Type;
        achievementsToUpdate.Description = updateDto.Description;
        achievementsToUpdate.CreateDate = updateDto.CreateDate;
        _dataContext.SaveChanges();

        var achievementsToReturn = new AchievementGetDto
        {
            Id = achievementsToUpdate.Id,
            UserId = achievementsToUpdate.UserId,
            Type = achievementsToUpdate.Type,
            Description = achievementsToUpdate.Description,
            CreateDate = achievementsToUpdate.CreateDate,
        };
        
        response.Data = achievementsToReturn;
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();
        var achievementsToDelete = _dataContext.Set<Achievement>()
            .FirstOrDefault(achievements => achievements.Id == id);

        if (achievementsToDelete == null)
        {
            response.AddError("id", "Achievement not found");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        _dataContext.Set<Achievement>().Remove(achievementsToDelete);
        _dataContext.SaveChanges();

        response.Data = true;
        return Ok(response);


    }
}


