using System;

namespace LearningStarter.Entities;

public class Goal
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public decimal Value { get; set; }
    public string TimePeriod { get; set; }
    public DateTimeOffset CreateDate { get; set; }
    public DateTimeOffset UpdatedDate { get; set; }
    public string Type { get; set; }
}

public class Goal 

