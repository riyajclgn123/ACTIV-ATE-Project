using System;
using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;
namespace LearningStarter.Controllers;

[ApiController]
[Route("api/nutrient-types")]
public class NutrientTypesController : ControllerBase
{
    private readonly DataContext _dataContext;
    
    public NutrientTypesController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();
        
        var nutrientTypeToReturn = _dataContext
            .Set<NutrientTypes>()
            .Select(nutrientType => new NutrientTypesGetDto
            {
                Id = nutrientType.Id,
                Name = nutrientType.Name,
                CreatedAt = nutrientType.CreatedAt,
                UpdatedAt = nutrientType.UpdatedAt
            })
            .ToList();

        response.Data = nutrientTypeToReturn;
        return Ok(response);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var response = new Response();
        
        var nutrientTypeToReturn = _dataContext
            .Set<NutrientTypes>()
            .Select(nutrientType => new NutrientTypesGetDto
            {
                Id = nutrientType.Id,
                Name = nutrientType.Name,
                CreatedAt = nutrientType.CreatedAt,
                UpdatedAt = nutrientType.UpdatedAt
            })
            .FirstOrDefault(nutrientType => nutrientType.Id == id);
        
        if (nutrientTypeToReturn == null)
        {
            response.AddError("id", "Nutrient type not found");
            return BadRequest(response);
        }
        
        response.Data = nutrientTypeToReturn;
        return Ok(response);
    }
    

    [HttpPost]
    public IActionResult Create([FromBody] NutrientTypesCreateDto createDto)
    {
        var response = new Response();

        if (string.IsNullOrEmpty(createDto.Name))
        {
            response.AddError(nameof(createDto.Name), "Name must not be empty");
            return BadRequest(response);
        }

        var nutrientTypeToCreate = new NutrientTypes
        {
            Name = createDto.Name,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = null,
        };

        _dataContext.Set<NutrientTypes>().Add(nutrientTypeToCreate);
        _dataContext.SaveChanges();

        var nutrientTypeToReturn = new NutrientTypesGetDto
        {
            Id = nutrientTypeToCreate.Id,
            Name = nutrientTypeToCreate.Name,
            CreatedAt = nutrientTypeToCreate.CreatedAt,
            UpdatedAt = nutrientTypeToCreate.UpdatedAt
        };

        response.Data = nutrientTypeToReturn;

        return Created("", response);
    }

    [HttpPut("{id}")]
    public IActionResult Update([FromBody] NutrientTypesUpdateDto updateDto, int id)
    {
        var response = new Response();
        
        if (string.IsNullOrEmpty(updateDto.Name))
        {
            response.AddError(nameof(updateDto.Name), "Name must not be empty");
            return BadRequest(response);
        }

        var nutrientTypeToUpdate = _dataContext.Set<NutrientTypes>()
            .FirstOrDefault(nutrientType => nutrientType.Id == id);
        
        if (nutrientTypeToUpdate == null)
        {
            response.AddError("id", "Nutrient Type not found");
            return BadRequest(response);
        }
        
        nutrientTypeToUpdate.Name = updateDto.Name;
        nutrientTypeToUpdate.UpdatedAt = DateTime.UtcNow;

        _dataContext.SaveChanges();

        var nutrientTypeToReturn = new NutrientTypesGetDto
        {
            Id = nutrientTypeToUpdate.Id,
            Name = nutrientTypeToUpdate.Name,
            UpdatedAt = nutrientTypeToUpdate.UpdatedAt,
            CreatedAt = nutrientTypeToUpdate.CreatedAt
        };

        response.Data = nutrientTypeToReturn;

        return Ok(response);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();

        var nutrientTypeToDelete = _dataContext.Set<NutrientTypes>()
            .FirstOrDefault(nutrientType => nutrientType.Id == id);

        if (nutrientTypeToDelete == null)
        {
            response.AddError("id", "Nutrient type not found");
            return BadRequest(response);
        }

        _dataContext.Set<NutrientTypes>().Remove(nutrientTypeToDelete);
        _dataContext.SaveChanges();

        response.Data = true;
        return Ok(response);
    }
    
    
}