import { Route, Routes as Switch, Navigate } from "react-router-dom";
import { LandingPage } from "../pages/landing-page/landing-page";
import { NotFoundPage } from "../pages/not-found";
import { useUser } from "../authentication/use-auth";
import { UserPage } from "../pages/user-page/user-page";
import { PageWrapper } from "../components/page-wrapper/page-wrapper";
import { routes } from ".";
import { ExerciseListing } from "../pages/Exercises-page/exercise-listing";
import { FoodListing } from "../pages/Foods-page/food-listing";
import { MealPlanner } from "../pages/MealPlanner/mealplanner";
import { FoodCreate } from "../pages/Foods-page/food-create";
import { FoodUpdate } from "../pages/Foods-page/food-update";
import { ExerciseCreate } from "../pages/Exercises-page/exercise-create";
import { ExerciseUpdate } from "../pages/Exercises-page/exercise-update";
import { ExerciseLogCreate } from "../pages/ExerciseLog-page/exerciselog-create";
import { ExerciseLogListing } from "../pages/ExerciseLog-page/exerciselog-listing";
import { ExerciseLogUpdate } from "../pages/ExerciseLog-page/exerciselog-update";


//This is where you will tell React Router what to render when the path matches the route specified.
export const Routes = () => {
  //Calling the useUser() from the use-auth.tsx in order to get user information
  const user = useUser();
  return (
    <>
      {/* The page wrapper is what shows the NavBar at the top, it is around all pages inside of here. */}
      <PageWrapper user={user}>
        <Switch>
          {/* When path === / render LandingPage */}
          <Route path={routes.home} element={<LandingPage />} />
          {/* When path === /iser render UserPage */}
          <Route path={routes.user} element={<UserPage />} />

          <Route path={routes.exercises} element={<ExerciseListing />} />
          <Route path={routes.exerciseCreate} element={<ExerciseCreate />} />
          <Route path={routes.exerciseUpdate} element={<ExerciseUpdate />} />

          <Route path={routes.exerciseLogCreate} element={<ExerciseLogCreate />} />
          <Route path={routes.exerciseLogUpdate} element={<ExerciseLogUpdate />} />
          <Route path={routes.exerciseLog} element={<ExerciseLogListing />} />

          {/* When path === /foods render FoodListing */}`

          <Route path={routes.foods} element={<FoodListing />} />
          <Route path={routes.foodCreate} element={<FoodCreate />} />
          <Route path={routes.foodUpdate} element={<FoodUpdate />} />


          <Route path={routes.mealplanner} element={<MealPlanner />} />

          {/* Going to route "localhost:5001/" will go to homepage */}
          <Route path={routes.root} element={<Navigate to={routes.home} />} />
          

          {/* This should always come last.  
            If the path has no match, show page not found */}
          <Route path="*" element={<NotFoundPage />} />
        </Switch>
      </PageWrapper>
    </>
  );
};
