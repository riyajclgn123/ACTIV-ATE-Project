using System;
using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace LearningStarter.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly DataContext _context;
    private readonly UserManager<User> _userManager;

    public UsersController(DataContext context,
        UserManager<User> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();

        response.Data = _context
            .Users
            .Select(x => new UserGetDto
            {
                Id = x.Id,
                FirstName = x.FirstName,
                LastName = x.LastName,
                UserName = x.UserName,
                Email = x.Email,
                DateofBirth = x.DateofBirth,
                Height = x.Height,
                Weight = x.Weight,
                CreateDate = x.CreateDate,
                UpdatedDate = x.UpdatedDate,
            })
            .ToList();

        return Ok(response);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(
        [FromRoute] int id)
    {
        var response = new Response();

        var user = _context.Users.FirstOrDefault(x => x.Id == id);

        if (user == null)
        {
            response.AddError("id", "There was a problem finding the user.");
            return NotFound(response);
        }

        var userGetDto = new UserGetDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            UserName = user.UserName,
            Email = user.Email,
            DateofBirth = user.DateofBirth,
            Height = user.Height,
            Weight = user.Weight,
            CreateDate = user.CreateDate,
            UpdatedDate = user.UpdatedDate,
        };

        response.Data = userGetDto;

        return Ok(response);
    }

    [HttpPost]
    public IActionResult Create(
        [FromBody] UserCreateDto userCreateDto)
    {
        var response = new Response();

        if (string.IsNullOrEmpty(userCreateDto.FirstName))
        {
            response.AddError("firstName", "First name cannot be empty.");
        }

        if (string.IsNullOrEmpty(userCreateDto.LastName))
        {
            response.AddError("lastName", "Last name cannot be empty.");
        }

        if (string.IsNullOrEmpty(userCreateDto.UserName))
        {
            response.AddError("userName", "User name cannot be empty.");
        }

        if (string.IsNullOrEmpty(userCreateDto.Password))
        {
            response.AddError("password", "Password cannot be empty.");
        }

        if (string.IsNullOrEmpty(userCreateDto.Email))
        {
            response.AddError("email", "Email cannot be empty.");
        }
        
        if (string.IsNullOrEmpty(userCreateDto.DateofBirth))
        {
            response.AddError("dateofBirth", "Date of birth cannot be empty.");
        }
        
        if (userCreateDto.Height == 0)
        {
            response.AddError("height", "Height cannot be empty.");
        }
        
        if (userCreateDto.Weight == 0)
        {
            response.AddError("weight", "Weight cannot be empty.");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        var userToCreate = new User
        {
            FirstName = userCreateDto.FirstName,
            LastName = userCreateDto.LastName,
            UserName = userCreateDto.UserName,
            Email = userCreateDto.Email,
            DateofBirth = userCreateDto.DateofBirth,
            Height = userCreateDto.Height,
            Weight = userCreateDto.Weight,
            CreateDate = DateTimeOffset.UtcNow,
        };

        _userManager.CreateAsync(userToCreate, userCreateDto.Password).Wait();
        _userManager.AddToRoleAsync(userToCreate, "Admin").Wait();
        _context.SaveChanges();

        var userGetDto = new UserGetDto
        {
            Id = userToCreate.Id,
            FirstName = userToCreate.FirstName,
            LastName = userToCreate.LastName,
            UserName = userToCreate.UserName,
            Email = userToCreate.Email,
            DateofBirth = userToCreate.DateofBirth,
            Height = userToCreate.Height,
            Weight = userToCreate.Weight,
            CreateDate = userToCreate.CreateDate,
            
        };

        response.Data = userGetDto;

        return Created("", response);
    }

    [HttpPut("{id}")]
    public IActionResult Edit(
        [FromRoute] int id, 
        [FromBody] UserUpdateDto userUpdateDto)
    {
        var response = new Response();

        if (userUpdateDto == null)
        {
            response.AddError("id", "There was a problem editing the user.");
            return NotFound(response);
        }
        
        var userToEdit = _context.Users.FirstOrDefault(x => x.Id == id);

        if (userToEdit == null)
        {
            response.AddError("id", "Could not find user to edit.");
            return NotFound(response);
        }

        if (string.IsNullOrEmpty(userUpdateDto.FirstName))
        {
            response.AddError("firstName", "First name cannot be empty.");
        }

        if (string.IsNullOrEmpty(userUpdateDto.LastName))
        {
            response.AddError("lastName", "Last name cannot be empty.");
        }

        if (string.IsNullOrEmpty(userUpdateDto.UserName))
        {
            response.AddError("userName", "User name cannot be empty.");
        }

        if (string.IsNullOrEmpty(userUpdateDto.Password))
        {
            response.AddError("password", "Password cannot be empty.");
        }
        
        if (string.IsNullOrEmpty(userUpdateDto.Email))
        {
            response.AddError("email", "Email cannot be empty.");
        }
        
        if (string.IsNullOrEmpty(userUpdateDto.DateofBirth))
        {
            response.AddError("dateofBirth", "Date of birth cannot be empty.");
        }
        
        if (userUpdateDto.Height == 0)
        {
            response.AddError("height", "Height cannot be empty.");
        }
        
        if (userUpdateDto.Weight == 0)
        {
            response.AddError("weight", "Weight cannot be empty.");
        }


        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        userToEdit.FirstName = userUpdateDto.FirstName;
        userToEdit.LastName = userUpdateDto.LastName;
        userToEdit.UserName = userUpdateDto.UserName;
        userToEdit.Email = userUpdateDto.Email;
        userToEdit.DateofBirth = userUpdateDto.DateofBirth;
        userToEdit.Height = userUpdateDto.Height;
        userToEdit.Weight = userUpdateDto.Weight;
        userToEdit.UpdatedDate = userUpdateDto.UpdatedDate;

        _context.SaveChanges();

        var userGetDto = new UserGetDto
        {
            Id = userToEdit.Id,
            FirstName = userToEdit.FirstName,
            LastName = userToEdit.LastName,
            UserName = userToEdit.UserName,
            Email = userToEdit.Email,
            DateofBirth = userToEdit.DateofBirth,
            Height = userToEdit.Height,
            Weight = userToEdit.Weight,
            UpdatedDate = userToEdit.UpdatedDate,
        };

        response.Data = userGetDto;
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();

        var user = _context.Users.FirstOrDefault(x => x.Id == id);

        if (user == null)
        {
            response.AddError("id", "There was a problem deleting the user.");
            return NotFound(response);
        }

        _context.Users.Remove(user);
        _context.SaveChanges();

        return Ok(response);
    }
}
