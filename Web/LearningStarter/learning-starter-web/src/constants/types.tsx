//This type uses a generic (<T>).  For more information on generics see: https://www.typescriptlang.org/docs/handbook/2/generics.html
//You probably wont need this for the scope of this class :)
export type ApiResponse<T> = {
  data: T;
  errors: ApiError[];
  hasErrors: boolean;
};

export type ApiError = {
  property: string;
  message: string;
};

export type AnyObject = {
  [index: string]: any;
};

export type UserDto = {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  weight: number;
  height: number;
  dateofBirth: string;
  gender: string;
  createDate: string;
  updatedDate: string;

};

export type UserCreateDto = {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  weight: number;
  height: number;
  dateofBirth: string;
  gender: string;
  createDate: string;
};

export type ExerciseGetDto = {
  id: number;
  name: string;
  description: string;
};
export type ExerciseCreateDto = {
  name: string;
  description: string;
};
export type ExerciseUpdateDto = {
  name: string;
  description: string;
};

export type ExerciseLogCreateDto = {
  exerciseId: number;
  userId: number;
  duration: number;
  rep: number;
  createDate: string;
};

export type ExerciseLogGetDto = {
  id: number;
  exerciseId: number;
  exerciseName: string;
  userId: number;
  duration: string;
  rep: number;
  caloriesBurned: number;
  createDate: string;
  updatedDate: string;
};

export type ExerciseLogUpdateDto = {
  exerciseId: number;
  userId: number;
  duration: number;
  rep: number;
  updateDate: string;
};

export type FoodGetDto = {
  id: number;
  name: string;
  description: string;
};

export type FoodCreateDto = {
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
};

export type FoodUpdateDto = {
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
};



export type FoodLogGetDto = {
  id: number;
  userId: number;
  foodId: number;
  foodName: string;
  protein: number;
  carbs: number;
  fat: number;
  caloriesPerServing: number;
  servingSize: number;
  calories: number;
  createDate: string;
  updatedDate: string;
  calorieConsumed: number;
  mealTime: string;
};

export type FoodLogCreateDto = {
  foodId: number;
  userId: number;
  servingSize: number;
  createDate: string;
  mealTime: string;
};

export type FoodLogUpdateDto = {
  userId: number;
  foodId: number;
  servingSize: number;
  updateDate: string;
  mealTime: string;
};
export type NutrientGetDto = {
  id: number;
  nutrientTypeId : number;
  foodId: number;
  nutrientTypeName: string;
  value: number;
  unit: string;
};

export type WeightLogGetDto={
  id: number;
  userId: number;
  value: number;
  logDate: string;
}

export type WeightLogCreateDto={
  userId: number;
  value: number;
  logDate: string;
}

export type GoalGetDto={
  id: number; 
  userId: number;
  value: number;
  timePeriod: number;
  type: string;
  activityLevel: string;
  createDate: string;
  updatedDate: string;
  dailyCalorieGoal : number;
}

