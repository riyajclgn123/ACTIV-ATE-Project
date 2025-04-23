using System;
using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/dailyReports")]
public class DailyReportsController : ControllerBase
{
    private readonly DataContext _dataContext;

    public DailyReportsController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    [HttpGet("user/{userId}/daily")]
    public IActionResult GetDailyReport(
        [FromRoute] int userId,
        [FromQuery] DateTime date)
    {
        var response = new Response();

        // Get all food logs for the user on the specified date
        var foodLogs = _dataContext.Set<FoodLog>()
            .Where(fl => fl.UserId == userId && fl.UpdatedDate.Date == date.Date)
            .ToList();

        if (!foodLogs.Any())
        {
            response.AddError("date", "No food logs found for the specified date");
            return BadRequest(response);
        }

        // Group by meal time (case-insensitive) and calculate totals
        var dailyReport = foodLogs
            .GroupBy(fl => fl.MealTime, StringComparer.OrdinalIgnoreCase) // Case-insensitive grouping
            .Select(g => new DailyReportGetDto
            {
                UserId = userId,
                Date = date.Date,
                MealTime = CapitalizeFirstLetter(g.Key), // Standardize casing
                TotalCalories = g.Sum(fl => fl.Calories)
            })
            .ToList();

        response.Data = dailyReport;
        return Ok(response);
    }

// Helper method to standardize meal time casing
    private string CapitalizeFirstLetter(string input)
    {
        if (string.IsNullOrEmpty(input))
            return input;
        
        return char.ToUpper(input[0]) + input.Substring(1).ToLower();
    }
    
    
    [HttpGet("user/{userId}/range")]
    public IActionResult GetReportByDateRange(
        [FromRoute] int userId,
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate)
    {
        var response = new Response();

        // Get all food logs for the user within the date range
        var foodLogs = _dataContext.Set<FoodLog>()
            .Where(fl => fl.UserId == userId && 
                        fl.UpdatedDate.Date >= startDate.Date && 
                        fl.UpdatedDate.Date <= endDate.Date)
            .ToList();

        if (!foodLogs.Any())
        {
            response.AddError("date", "No food logs found for the specified date range");
            return BadRequest(response);
        }

        // Group by date and meal time
        var reports = foodLogs
            .GroupBy(fl => new { fl.UpdatedDate.Date, fl.MealTime })
            .Select(g => new DailyReportGetDto
            {
                UserId = userId,
                Date = g.Key.Date,
                MealTime = g.Key.MealTime,
                TotalCalories = g.Sum(fl => fl.Calories)
            })
            .OrderBy(r => r.Date)
            .ThenBy(r => r.MealTime)
            .ToList();

        response.Data = reports;
        return Ok(response);
    }
}