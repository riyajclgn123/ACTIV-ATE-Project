using System;
using System.Linq;
using System.Threading.Tasks;
using IdentityModel;
using LearningStarter.Data;
using LearningStarter.Entities;
using LearningStarter.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace LearningStarter;

public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    private IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddCors();
        services.AddControllers();

        services.AddHsts(options =>
        {
            options.MaxAge = TimeSpan.MaxValue;
            options.Preload = true;
            options.IncludeSubDomains = true;
        });

        services.AddDbContext<DataContext>(options =>
        {
            options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
        });

        services.AddIdentity<User, Role>(
                options =>
                {
                    options.SignIn.RequireConfirmedAccount = false;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequireLowercase = false;
                    options.Password.RequireUppercase = false;
                    options.Password.RequireDigit = false;
                    options.Password.RequiredLength = 8;
                    options.ClaimsIdentity.UserIdClaimType = JwtClaimTypes.Subject;
                    options.ClaimsIdentity.UserNameClaimType = JwtClaimTypes.Name;
                    options.ClaimsIdentity.RoleClaimType = JwtClaimTypes.Role;
                })
            .AddEntityFrameworkStores<DataContext>();

        services.AddMvc();

        services
            .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie(options =>
            {
                options.Events.OnRedirectToLogin = context =>
                {
                    context.Response.StatusCode = 401;
                    return Task.CompletedTask;
                };
            });

        services.AddAuthorization();

        // Swagger
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Learning Starter Server",
                Version = "v1",
                Description = "Description for the API goes here.",
            });

            c.CustomOperationIds(apiDesc => apiDesc.TryGetMethodInfo(out var methodInfo) ? methodInfo.Name : null);
            c.MapType(typeof(IFormFile), () => new OpenApiSchema { Type = "file", Format = "binary" });
        });

        services.AddSpaStaticFiles(config =>
        {
            config.RootPath = "learning-starter-web/build";
        });

        services.AddHttpContextAccessor();

        // configure DI for application services
        services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        services.AddScoped<IAuthenticationService, AuthenticationService>();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env, DataContext dataContext)
    {
        dataContext.Database.EnsureDeleted();
        dataContext.Database.EnsureCreated();
        
        app.UseHsts();
        app.UseHttpsRedirection();
        app.UseStaticFiles();
        app.UseSpaStaticFiles();
        app.UseStaticFiles();
        app.UseRouting();
        app.UseAuthentication();
        app.UseAuthorization();

        // global cors policy
        app.UseCors(x => x
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());

        // Enable middleware to serve generated Swagger as a JSON endpoint.
        app.UseSwagger(options =>
        {
            options.SerializeAsV2 = true;
        });

        // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
        // specifying the Swagger JSON endpoint.
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "Learning Starter Server API V1");
        });

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseEndpoints(x => x.MapControllers());

        app.UseSpa(spa =>
        {
            spa.Options.SourcePath = "learning-starter-web";
            if (env.IsDevelopment())
            {
                spa.UseProxyToSpaDevelopmentServer("http://localhost:3001");
            }
        });
        
        using var scope = app.ApplicationServices.CreateScope();
        var userManager = scope.ServiceProvider.GetService<UserManager<User>>();
        var roleManager = scope.ServiceProvider.GetService<RoleManager<Role>>();

        SeedRoles(dataContext, roleManager).Wait();
        SeedUsers(dataContext, userManager).Wait();
        SeedExercises(dataContext);
          SeedFoods(dataContext);
        SeedNutrientTypes(dataContext);
        SeedNutrient(dataContext);
    }
    
    public static void SeedExercises(DataContext dataContext)
    {
        if (dataContext.Exercises.Any())
        {
            return;
        }

        var seededExercise1 = new Exercise
        {
            Name = "Dumb bell",
            Description = "Big one",
        };
        var seededExercise2 = new Exercise
        {
            Name = "Leg press",
            Description = "Flat bench",
        };
        var seededExercise3 = new Exercise
        {
            Name = "Chest press",
            Description = "Inclined",
        };
        var seededExercise4 = new Exercise
        {
            Name = "Cardio",
            Description = "Manual one",
        };
        
        dataContext.Set<Exercise>().Add(seededExercise1);
        dataContext.Set<Exercise>().Add(seededExercise2);
        dataContext.Set<Exercise>().Add(seededExercise3);
        dataContext.Set<Exercise>().Add(seededExercise4);
        dataContext.SaveChanges();
    }
    
    public static void SeedNutrient(DataContext dataContext)
    {
        if (dataContext.Nutrients.Any())
        {
            return;
        }

        var seededNutrient1 = new Nutrient
        {
            NutrientTypeId = 1,
                FoodId = 1,
                Value = 300,
                Unit = "Calories",
        };
        var seededNutrient2 = new Nutrient
        {
            NutrientTypeId = 2,
            FoodId = 1,
            Value = 30,
            Unit = "gm",
        };
        var seededNutrient3 = new Nutrient
        {
            NutrientTypeId = 3,
            FoodId = 1,
            Value = 150,
            Unit = "gm",
        };
        var seededNutrient4 = new Nutrient
        {
            NutrientTypeId = 4,
            FoodId = 1,
            Value = 50,
            Unit = "gm",
        };
        var seededNutrient5 = new Nutrient
        {
            NutrientTypeId = 1,
            FoodId = 2,
            Value = 350,
            Unit = "Calories",
        };
        var seededNutrient6 = new Nutrient
        {
            NutrientTypeId = 2,
            FoodId = 2,
            Value = 40,
            Unit = "gm",
        };
        var seededNutrient7 = new Nutrient
        {
            NutrientTypeId = 3,
            FoodId = 2,
            Value = 200,
            Unit = "gm",
        };
        var seededNutrient8 = new Nutrient
        {
            NutrientTypeId = 4,
            FoodId = 2,
            Value = 40,
            Unit = "gm",
        };
        var seededNutrient9= new Nutrient
        {
            NutrientTypeId = 1,
            FoodId = 3,
            Value = 400,
            Unit = "Calories",
        };
        var seededNutrient10 = new Nutrient
        {
            NutrientTypeId = 2,
            FoodId = 3,
            Value = 70,
            Unit = "gm",
        };
        var seededNutrient11 = new Nutrient
        {
            NutrientTypeId = 3,
            FoodId = 3,
            Value = 390,
            Unit = "gm",
        };
        var seededNutrient12 = new Nutrient
        {
            NutrientTypeId = 4,
            FoodId = 3,
            Value = 65,
            Unit = "gm",
        };
        
        dataContext.Set<Nutrient>().Add(seededNutrient1);
        dataContext.Set<Nutrient>().Add(seededNutrient2);
        dataContext.Set<Nutrient>().Add(seededNutrient3);
        dataContext.Set<Nutrient>().Add(seededNutrient4);
        dataContext.Set<Nutrient>().Add(seededNutrient5);
        dataContext.Set<Nutrient>().Add(seededNutrient6);
        dataContext.Set<Nutrient>().Add(seededNutrient7);
        dataContext.Set<Nutrient>().Add(seededNutrient8);
        dataContext.Set<Nutrient>().Add(seededNutrient9);
        dataContext.Set<Nutrient>().Add(seededNutrient10);
        dataContext.Set<Nutrient>().Add(seededNutrient11);
        dataContext.Set<Nutrient>().Add(seededNutrient12);
        dataContext.SaveChanges();
    }

    public static void SeedFoods(DataContext dataContext)
    {
        if (dataContext.Foods.Any())
        {
            return;
        }

        var seededFood1 = new Food
        {
            Name = "Pizza",
            Description = "Made of Chicken",
        };
        var seededFood2 = new Food
        {
            Name = "Burger",
            Description = "Made of Chicken",
        };
        var seededFood3 = new Food
        {
            Name = "Biryani",
            Description = "Made of Chicken and rice",
        };
        var seededFood4 = new Food
        {
            Name = "Momo",
            Description = "Made of Chicken and wheat",
        };
        
        dataContext.Set<Food>().Add(seededFood1);
        dataContext.Set<Food>().Add(seededFood2);
        dataContext.Set<Food>().Add(seededFood3);
        dataContext.Set<Food>().Add(seededFood4);
        dataContext.SaveChanges();
    }
  
    
    public static void SeedNutrientTypes(DataContext dataContext)
    {
        if (dataContext.NutrientTypes.Any())
        {
            return;
        }

        var seededNutrientType1 = new NutrientType
        {
            Name="Calories",
        };
        var seededNutrientType2 = new NutrientType
        {
            Name="Protein",
        };
        var seededNutrientType3 = new NutrientType
        {
            Name="Carbohydrates",
        };
        var seededNutrientType4 = new NutrientType
        {
            Name="Sugar",
        };
        var seededNutrientType5 = new NutrientType
        {
            Name="Fiber",
        };
        var seededNutrientType6 = new NutrientType
        {
            Name="Fat",
        };
        dataContext.Set<NutrientType>().Add(seededNutrientType1);
        dataContext.Set<NutrientType>().Add(seededNutrientType2);
        dataContext.Set<NutrientType>().Add(seededNutrientType3);
        dataContext.Set<NutrientType>().Add(seededNutrientType4);
        dataContext.Set<NutrientType>().Add(seededNutrientType5);
        dataContext.Set<NutrientType>().Add(seededNutrientType6);
        dataContext.SaveChanges();
    }



    private static async Task SeedUsers(DataContext dataContext, UserManager<User> userManager)
    {
        var numUsers = dataContext.Users.Count();

        if (numUsers == 0)
        {
            var seededUser = new User
            {
                FirstName = "Seeded",
                LastName = "User",
                UserName = "admin",
                Email = "admin@admin.com",
                DateofBirth = "2004/06/14",
                Gender = "Male",
                Height = 176,
                Weight = 85,
                CreateDate = DateTimeOffset.UtcNow,
                UpdatedDate = DateTimeOffset.UtcNow,
            };

            await userManager.CreateAsync(seededUser, "Password");
            await userManager.AddToRoleAsync(seededUser, "Admin");
            await dataContext.SaveChangesAsync();
        }
    }
    
    private static async Task SeedRoles(DataContext dataContext, RoleManager<Role> roleManager)
    {
        var numRoles = dataContext.Roles.Count();

        if (numRoles == 0)
        {
            var seededRole = new Role
            {
                Name = "Admin"
            };

            await roleManager.CreateAsync(seededRole);
            await dataContext.SaveChangesAsync();
        }
    }
}