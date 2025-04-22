

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
    
    [HttpGet("check-weight-goal/{userId}")]
public IActionResult CheckWeightGoalAchievement(int userId)
{
    var response = new Response();
    
    // Get user's latest goal
    var latestGoal = _dataContext.Set<Goal>()
        .Where(g => g.UserId == userId && g.Type == "weight")
        .OrderByDescending(g => g.CreateDate)
        .FirstOrDefault();

    if (latestGoal == null)
    {
        response.AddError("goal", "No weight goal found for this user");
        return NotFound(response);
    }

    // Get user's latest weight log
    var latestWeightLog = _dataContext.Set<WeightLog>()
        .Where(w => w.UserId == userId)
        .OrderByDescending(w => w.LogDate)
        .FirstOrDefault();

    if (latestWeightLog == null)
    {
        response.AddError("weight", "No weight data found for this user");
        return NotFound(response);
    }

    // Use decimal consistently
    decimal goalValue = latestGoal.Value;
    decimal currentValue = latestWeightLog.Value;
    decimal tolerance = 0.1m; // Note the 'm' suffix for decimal
    
    // Check if goal is achieved (with a small tolerance for floating point comparison)
    bool isGoalAchieved = Math.Abs(currentValue - goalValue) < tolerance;
    
    // Check if achievement already exists to avoid duplicates
    var existingAchievement = _dataContext.Set<Achievement>()
        .FirstOrDefault(a => a.UserId == userId && 
                           a.Type == "weight_goal" && 
                           a.Description.Contains($"Target: {latestGoal.Value}kg"));

    var achievementDto = new AchievementCheckDto
    {
        GoalWeight = goalValue,
        CurrentWeight = currentValue,
        IsAchieved = isGoalAchieved,
        HasExistingAchievement = existingAchievement != null,
        Achievement = existingAchievement != null ? new AchievementGetDto
        {
            Id = existingAchievement.Id,
            UserId = existingAchievement.UserId,
            Type = existingAchievement.Type,
            Description = existingAchievement.Description,
            CreateDate = existingAchievement.CreateDate
        } : null
    };

    // If goal is achieved and no existing achievement, create one
    if (isGoalAchieved && existingAchievement == null)
    {
        var newAchievement = new Achievement
        {
            UserId = userId,
            Type = "weight_goal",
            Description = $"Reached target weight of {latestGoal.Value}kg!",
            CreateDate = DateTime.Now
        };
        
        _dataContext.Set<Achievement>().Add(newAchievement);
        _dataContext.SaveChanges();
        
        achievementDto.Achievement = new AchievementGetDto
        {
            Id = newAchievement.Id,
            UserId = newAchievement.UserId,
            Type = newAchievement.Type,
            Description = newAchievement.Description,
            CreateDate = newAchievement.CreateDate
        };
    }

    response.Data = achievementDto;
    return Ok(response);
}
    
}


