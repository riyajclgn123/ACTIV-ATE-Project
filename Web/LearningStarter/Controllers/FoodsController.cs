using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;
namespace LearningStarter.Controllers;

[ApiController]
[Route("api/foods")]
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
        
        var data = _dataContext
            .Set<Foods>()
            .Select(foods => new FoodsGetDto
            {
                Id = foods.Id,
                Name = foods.Name,
                Description = foods.Description,
            })
            .ToList();

        response.Data = data;
        return Ok(response);
    }

    [HttpPost]
    public IActionResult Create([FromBody] FoodsCreateDto createDto)
    {
        var response = new Response();

        var FoodToCreate = new Foods
        {
            Name = createDto.Name,
            Description = createDto.Description,
        };

        _dataContext.Set<Foods>().Add(FoodToCreate);
        _dataContext.SaveChanges();

        var foodToReturn = new FoodsGetDto
        {
            Id = FoodToCreate.Id,
            Name = FoodToCreate.Name,
            Description = FoodToCreate.Description,
        };

        response.Data = foodToReturn;

        return Created("", response);
    }
    
    
}