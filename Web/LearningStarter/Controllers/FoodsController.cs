using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;
namespace LearningStarter.Controllers;

[ApiController]
[Route("api/food")]
public class FoodsController : ControllerBase
{
    private readonly DataContext _dataContext;
    
    public FoodsController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();
        
        var foodsToReturn = _dataContext
            .Set<Food>()
            .Select(food => new FoodGetDto
            {
                Id = food.Id,
                Name = food.Name,
                Description = food.Description,
            })
            .ToList();

        response.Data = foodsToReturn;
        return Ok(response);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var response = new Response();
        
        var foodToReturn = _dataContext
            .Set<Food>()
            .Select(food => new FoodGetDto
            {
                Id = food.Id,
                Name = food.Name,
                Description = food.Description,
            })
            .FirstOrDefault(food => food.Id == id);
        
        if (foodToReturn == null)
        {
            response.AddError("id", "Food not found");
            return BadRequest(response);
        }
        
        response.Data = foodToReturn;
        return Ok(response);
    }
    

    [HttpPost]
    public IActionResult Create([FromBody] FoodCreateDto createDto)
    {
        var response = new Response();

        if (string.IsNullOrEmpty(createDto.Name))
        {
            response.AddError(nameof(createDto.Name), "Name must not be empty");
            return BadRequest(response);
        }

        var foodToCreate = new Food
        {
            Name = createDto.Name,
            Description = createDto.Description,
        };

        _dataContext.Set<Food>().Add(foodToCreate);
        _dataContext.SaveChanges();

        var foodToReturn = new FoodGetDto
        {
            Id = foodToCreate.Id,
            Name = foodToCreate.Name,
            Description = foodToCreate.Description,
        };

        response.Data = foodToReturn;

        return Created("", response);
    }

    [HttpPut("{id}")]
    public IActionResult Update([FromBody] FoodUpdateDto updateDto, int id)
    {
        var response = new Response();
        
        if (string.IsNullOrEmpty(updateDto.Name))
        {
            response.AddError(nameof(updateDto.Name), "Name must not be empty");
            return BadRequest(response);
        }

        var foodToUpdate = _dataContext.Set<Food>()
            .FirstOrDefault(food => food.Id == id);
        
        if (foodToUpdate == null)
        {
            response.AddError("id", "Food not found");
            return BadRequest(response);
        }
        
        foodToUpdate.Name = updateDto.Name;
        foodToUpdate.Description = updateDto.Description;

        _dataContext.SaveChanges();

        var foodToReturn = new FoodGetDto
        {
            Id = foodToUpdate.Id,
            Name = updateDto.Name,
            Description = foodToUpdate.Description,
        };

        response.Data = foodToReturn;

        return Ok(response);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();

        var foodToDelete = _dataContext.Set<Food>()
            .FirstOrDefault(food => food.Id == id);

        if (foodToDelete == null)
        {
            response.AddError("id", "Food not found");
            return BadRequest(response);
        }

        _dataContext.Set<Food>().Remove(foodToDelete);
        _dataContext.SaveChanges();

        response.Data = true;
        return Ok(response);
    }
    
    
}