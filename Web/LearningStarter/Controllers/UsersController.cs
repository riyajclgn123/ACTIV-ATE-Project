using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Http;
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
                Gender = x.Gender,
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
            Gender = user.Gender,
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
        
        if (string.IsNullOrEmpty(userCreateDto.Gender))
        {
            response.AddError("gender", "Gender cannot be empty.");
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
            Gender = userCreateDto.Gender,
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
            Gender = userToCreate.Gender,
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
        if (string.IsNullOrEmpty(userUpdateDto.Email))
        {
            response.AddError("email", "Email cannot be empty.");
        }
        
        if (string.IsNullOrEmpty(userUpdateDto.DateofBirth))
        {
            response.AddError("dateofBirth", "Date of birth cannot be empty.");
        }
        if (string.IsNullOrEmpty(userUpdateDto.Gender))
        {
            response.AddError("gender", "Gender cannot be empty.");
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
        userToEdit.Gender = userUpdateDto.Gender;
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
            Gender = userToEdit.Gender,
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
    
    [HttpPost("{id}/profile-picture")]
    public async Task<IActionResult> UploadProfilePicture(int id, IFormFile file)
    {
        var response = new Response();
    
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null)
        {
            response.AddError("id", "User not found");
            return NotFound(response);
        }

        if (file == null || file.Length == 0)
        {
            response.AddError("file", "No file uploaded");
            return BadRequest(response);
        }

        // Validate file type and size
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(extension))
        {
            response.AddError("file", "Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed.");
            return BadRequest(response);
        }

        if (file.Length > 5 * 1024 * 1024) // 5MB limit
        {
            response.AddError("file", "File size exceeds 5MB limit");
            return BadRequest(response);
        }

        // Create uploads directory if it doesn't exist
        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        // Generate unique filename
        var uniqueFileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        // Save the file
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Update user's profile picture URL
        user.ProfilePictureUrl = $"/uploads/{uniqueFileName}";
        user.UpdatedDate = DateTimeOffset.UtcNow;
        await _userManager.UpdateAsync(user);

        response.Data = new { ProfilePictureUrl = user.ProfilePictureUrl };
        return Ok(response);
    }
}
