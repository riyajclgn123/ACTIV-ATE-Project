import { BMIIndicator } from "../pages/BMI-Indicator/bmiIndicator";
import { MacroNutrient } from "../pages/MacroNutrient-pages/MacroNutrient";


//This is where you will declare all of your routes (the ones that show up in the search bar)
export const routes = {
  root: `/`,
  home: `/home`,
  user: `/user`,
  exercises: `/exercises`,
  exerciseCreate: `/exercises/create`,
  exerciseUpdate: `/exercises/update/:id`,
  exerciseLogCreate: `/exercise-logs/create/:id`,
  exerciseLogUpdate: `/exercise-logs/update/:id`,
  exerciseLog: `/exercise-logs`,
  foods: `/foods`,
  foodUpdate: `/foods/update/:id`,
  foodCreate: `/foods/create`,
  foodLog: `/food-logs`,
  foodLogCreate: `/food-logs/create`,
  foodLogUpdate: `/food-logs/update/:id`,
  bmi: `/bmi`,
  mealplanner: `/mealplanner`,
  profile: `/profile`,
  macroNutrient: `/macroNutrient`,
  weeklyReport: `/weeklyReport`,
  goals: `/goals`,
  
};