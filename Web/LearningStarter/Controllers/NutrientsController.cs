using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;

namespace LearningStarter.Controllers;

[ApiController]
[Route("api/nutrients")]
public class NutrientsController : ControllerBase
{
    private readonly DataContext _dataContext;
    
    public NutrientsController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();
        
        var nutrientToReturn = _dataContext
            .Set<Nutrient>()
            .Select(nutrient => new NutrientGetDto
            {
                Id = nutrient.Id,
                NutrientTypeId = nutrient.NutrientTypeId,
                FoodId = nutrient.FoodId,
                Unit = nutrient.Unit,
                Value = nutrient.Value
            })
            .ToList();

        response.Data = nutrientToReturn;
        return Ok(response);
    }
    
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var response = new Response();
        
        var nutrientToReturn = _dataContext
            .Set<Nutrient>()
            .Select(nutrient => new NutrientGetDto
            {
                Id = nutrient.Id,
                NutrientTypeId = nutrient.NutrientTypeId,
                FoodId = nutrient.FoodId,
                Unit = nutrient.Unit,
                Value = nutrient.Value
            })
            .FirstOrDefault(nutrient => nutrient.Id == id);
        
        if (nutrientToReturn == null)
        {
            response.AddError("id", "Nutrient not found");
            return BadRequest(response);
        }
        
        response.Data = nutrientToReturn;
        return Ok(response);
    }
    
    [HttpPost]
    public IActionResult Create([FromBody] NutrientCreateDto createDto)
    {
        var response = new Response();

        // TODO Add input validation here

        var nutrientToCreate = new Nutrient
        {
            NutrientTypeId = createDto.NutrientTypeId,
            FoodId = createDto.FoodId,
            Unit = createDto.Unit,
            Value = createDto.Value
        };

        _dataContext.Set<Nutrient>().Add(nutrientToCreate);
        _dataContext.SaveChanges();

        var nutrientToReturn = new NutrientGetDto
        {
            Id = nutrientToCreate.Id,
            NutrientTypeId = nutrientToCreate.NutrientTypeId,
            FoodId = nutrientToCreate.FoodId,
            Unit = nutrientToCreate.Unit,
            Value = nutrientToCreate.Value
        };

        response.Data = nutrientToReturn;
        return Created("", response);
    }
    
    [HttpPut("{id}")]
    public IActionResult Update([FromBody] NutrientUpdateDto updateDto, int id)
    {
        var response = new Response();
        
        // TODO add input validation here

        var nutrientToUpdate = _dataContext.Set<Nutrient>()
            .FirstOrDefault(nutrient => nutrient.Id == id);
        
        if (nutrientToUpdate == null)
        {
            response.AddError("id", "Nutrient not found");
            return BadRequest(response);
        }
        
        nutrientToUpdate.NutrientTypeId = updateDto.NutrientTypeId;
        nutrientToUpdate.FoodId = updateDto.FoodId;
        nutrientToUpdate.Unit = updateDto.Unit;
        nutrientToUpdate.Value = updateDto.Value;

        _dataContext.SaveChanges();
        
        var nutrientToReturn = new NutrientGetDto
        {
            Id = nutrientToUpdate.Id,
            NutrientTypeId = nutrientToUpdate.NutrientTypeId,
            FoodId = nutrientToUpdate.FoodId,
            Unit = nutrientToUpdate.Unit,
            Value = nutrientToUpdate.Value
        };
        
        response.Data = nutrientToReturn;
        return Ok(response);
    }
    
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();

        var nutrientToDelete = _dataContext.Set<Nutrient>()
            .FirstOrDefault(nutrient => nutrient.Id == id);

        if (nutrientToDelete == null)
        {
            response.AddError("id", "Nutrient not found");
            return BadRequest(response);
        }

        _dataContext.Set<Nutrient>().Remove(nutrientToDelete);
        _dataContext.SaveChanges();

        response.Data = true;
        return Ok(response);
    }
}
