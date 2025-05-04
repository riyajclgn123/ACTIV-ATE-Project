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
            Name = "Dumbbell",
            Description = "Big one",
        };
        var seededExercise2 = new Exercise
        {
            Name = "Leg Press",
            Description = "Flat bench",
        };
        var seededExercise3 = new Exercise
        {
            Name = "Chest Press",
            Description = "Inclined",
        };
        var seededExercise4 = new Exercise
        {
            Name = "Cardio",
            Description = "Manual one",
        };
        var seededExercise5 = new Exercise
        {
            Name = "Inclined Bench Press",
            Description = "Manual one",
        };
        var seededExercise6 = new Exercise
        {
            Name = "Flat Bench Press",
            Description = "Manual one",
        };
        var seededExercise7 = new Exercise
        {
            Name = "Squat",
            Description = "Manual one",
        };
        var seededExercise8 = new Exercise
        {
            Name = "Cycling",
            Description = "Manual one",
        };
        // var seededExercise9 = new Exercise
        // {
        //     Name = "cable machine",
        //     Description = "Manual one",
        // };
        
        dataContext.Set<Exercise>().Add(seededExercise1);
        dataContext.Set<Exercise>().Add(seededExercise2);
        dataContext.Set<Exercise>().Add(seededExercise3);
        dataContext.Set<Exercise>().Add(seededExercise4);
        dataContext.Set<Exercise>().Add(seededExercise5);
        dataContext.Set<Exercise>().Add(seededExercise6);
        dataContext.Set<Exercise>().Add(seededExercise7);
        dataContext.Set<Exercise>().Add(seededExercise8);
        //dataContext.Set<Exercise>().Add(seededExercise9);
        dataContext.SaveChanges();
    }
    
    public static void SeedNutrient(DataContext dataContext)
    {
        if (dataContext.Nutrients.Any())
        {
            return;
        }
        //nutrient type 1: calories
        //nutrient type 2: protein
        //nutrient type 3: carbohydrates
        //nutrient type 4: sugar
        //nutrient type 5: fiber
        //nutrient type 6: fat
        
        // for food 1, pizza
        var seededNutrient1 = new Nutrient
        {
            NutrientTypeId = 1,
                FoodId = 1,
                Value = 260,
                Unit = "Calories",
        };
        var seededNutrient2 = new Nutrient
        {
            NutrientTypeId = 2,
            FoodId = 1,
            Value = 12,
            Unit = "gm",
        };
        var seededNutrient3 = new Nutrient
        {
            NutrientTypeId = 3,
            FoodId = 1,
            Value = 33,
            Unit = "gm",
        };
        var seededNutrient4 = new Nutrient
        {
            NutrientTypeId = 6,
            FoodId = 1,
            Value = 10,
            Unit = "gm",
        };
        
        // for food 2, burger
        var seededNutrient5 = new Nutrient
        {
            NutrientTypeId = 1,
            FoodId = 2,
            Value = 370,
            Unit = "Calories",
        };
        var seededNutrient6 = new Nutrient
        {
            NutrientTypeId = 2,
            FoodId = 2,
            Value = 15,
            Unit = "gm",
        };
        var seededNutrient7 = new Nutrient
        {
            NutrientTypeId = 3,
            FoodId = 2,
            Value = 36,
            Unit = "gm",
        };
        var seededNutrient8 = new Nutrient
        {
            NutrientTypeId = 6,
            FoodId = 2,
            Value = 19,
            Unit = "gm",
        };
        
        // for food 3, fried chicken leg
        var seededNutrient9= new Nutrient
        {
            NutrientTypeId = 1,
            FoodId = 3,
            Value = 280,
            Unit = "Calories",
        };
        var seededNutrient10 = new Nutrient
        {
            NutrientTypeId = 2,
            FoodId = 3,
            Value = 22,
            Unit = "gm",
        };
        var seededNutrient11 = new Nutrient
        {
            NutrientTypeId = 3,
            FoodId = 3,
            Value = 11,
            Unit = "gm",
        };
        var seededNutrient12 = new Nutrient
        {
            NutrientTypeId = 6,
            FoodId = 3,
            Value = 16,
            Unit = "gm",
        };
        
        // for food 4, mashed potatoes
        var seededNutrient13 = new Nutrient
        {
            NutrientTypeId = 1,
            FoodId = 4,
            Value = 290,
            Unit = "Calories",
        };
        var seededNutrient14 = new Nutrient
        {
            NutrientTypeId = 2,
            FoodId = 4,
            Value = 4,
            Unit = "gm",
        };
        var seededNutrient15 = new Nutrient
        {
            NutrientTypeId = 3,
            FoodId = 4,
            Value = 44,
            Unit = "gm",
        };
        var seededNutrient16 = new Nutrient
        {
            NutrientTypeId = 6,
            FoodId = 4,
            Value = 11,
            Unit = "gm",
        };
        
        // for food 5, egg sandwich
        var seededNutrient17 = new Nutrient
        {
            NutrientTypeId = 1,
            FoodId = 5,
            Value = 300,
            Unit = "Calories",
        };
        var seededNutrient18 = new Nutrient
        {
            NutrientTypeId = 2,
            FoodId = 5,
            Value = 18,
            Unit = "gm",
        };
        var seededNutrient19 = new Nutrient
        {
            NutrientTypeId = 3,
            FoodId = 5,
            Value = 30,
            Unit = "gm",
        };
        var seededNutrient20 = new Nutrient
        {
            NutrientTypeId = 6,
            FoodId = 5,
            Value = 12,
            Unit = "gm",
        };
        
        // for food 6, t-bone steak
        var seededNutrient21 = new Nutrient
        {
            NutrientTypeId = 1,
            FoodId = 6,
            Value = 610,
            Unit = "Calories",
        };
        var seededNutrient22 = new Nutrient
        {
            NutrientTypeId = 2,
            FoodId = 6,
            Value = 52,
            Unit = "gm",
        };
        var seededNutrient23 = new Nutrient
        {
            NutrientTypeId = 3,
            FoodId = 6,
            Value = 1,
            Unit = "gm",
        };
        var seededNutrient24 = new Nutrient
        {
            NutrientTypeId = 6,
            FoodId = 6,
            Value = 41,
            Unit = "gm",
        };
        
        // for food 7, french fries
        var seededNutrient25 = new Nutrient
        {
            NutrientTypeId = 1,
            FoodId = 7,
            Value = 340,
            Unit = "Calories",
        };
        var seededNutrient26 = new Nutrient
        {
            NutrientTypeId = 2,
            FoodId = 7,
            Value = 4,
            Unit = "gm",
        };
        var seededNutrient27 = new Nutrient
        {
            NutrientTypeId = 3,
            FoodId = 7,
            Value = 44,
            Unit = "gm",
        };
        var seededNutrient28 = new Nutrient
        {
            NutrientTypeId = 6,
            FoodId = 7,
            Value = 16,
            Unit = "gm",
        };
        
        // for food 8, protein shake
        var seededNutrient29 = new Nutrient
        {
            NutrientTypeId = 1,
            FoodId = 8,
            Value = 160,
            Unit = "Calories",
        };
        var seededNutrient30 = new Nutrient
        {
            NutrientTypeId = 2,
            FoodId = 8,
            Value = 30,
            Unit = "gm",
        };
        var seededNutrient31 = new Nutrient
        {
            NutrientTypeId = 3,
            FoodId = 8,
            Value = 5,
            Unit = "gm",
        };
        var seededNutrient32 = new Nutrient
        {
            NutrientTypeId = 6,
            FoodId = 8,
            Value = 3,
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
        dataContext.Set<Nutrient>().Add(seededNutrient13);
        dataContext.Set<Nutrient>().Add(seededNutrient14);
        dataContext.Set<Nutrient>().Add(seededNutrient15);
        dataContext.Set<Nutrient>().Add(seededNutrient16);
        dataContext.Set<Nutrient>().Add(seededNutrient17);
        dataContext.Set<Nutrient>().Add(seededNutrient18);
        dataContext.Set<Nutrient>().Add(seededNutrient19);
        dataContext.Set<Nutrient>().Add(seededNutrient20);
        dataContext.Set<Nutrient>().Add(seededNutrient21);
        dataContext.Set<Nutrient>().Add(seededNutrient22);
        dataContext.Set<Nutrient>().Add(seededNutrient23);
        dataContext.Set<Nutrient>().Add(seededNutrient24);
        dataContext.Set<Nutrient>().Add(seededNutrient25);
        dataContext.Set<Nutrient>().Add(seededNutrient26);
        dataContext.Set<Nutrient>().Add(seededNutrient27);
        dataContext.Set<Nutrient>().Add(seededNutrient28);
        dataContext.Set<Nutrient>().Add(seededNutrient29);
        dataContext.Set<Nutrient>().Add(seededNutrient30);
        dataContext.Set<Nutrient>().Add(seededNutrient31);
        dataContext.Set<Nutrient>().Add(seededNutrient32);
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
            Description = "Doughy, saucy, cheesy, and delicious.",
        };
        var seededFood2 = new Food
        {
            Name = "Burger",
            Description = "Bread, meat, cheese, and lettuce.",
        };
        var seededFood3 = new Food
        {
            Name = "Fried chicken leg",
            Description = "Tender, juicy, and crispy.",
        };
        var seededFood4 = new Food
        {
            Name = "Mashed potatoes",
            Description = "Creamy and fluffy.",
        };
        var seededFood5 = new Food
        {
            Name = "Egg sandwich",
            Description = "Toasted bread with an egg and cheese.",
        };
        var seededFood6 = new Food
        {
            Name = "T-bone steak",
            Description = "Seared to perfection.",
        };
        var seededFood7 = new Food
        {
            Name = "French fries",
            Description = "Soft on the inside and crispy on the outside.",
        };
        var seededFood8 = new Food
        {
            Name = "Protein shake",
            Description = "Healthy and delicious",
        };
        
        dataContext.Set<Food>().Add(seededFood1);
        dataContext.Set<Food>().Add(seededFood2);
        dataContext.Set<Food>().Add(seededFood3);
        dataContext.Set<Food>().Add(seededFood4);
        dataContext.Set<Food>().Add(seededFood5);
        dataContext.Set<Food>().Add(seededFood6);
        dataContext.Set<Food>().Add(seededFood7);
        dataContext.Set<Food>().Add(seededFood8);
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