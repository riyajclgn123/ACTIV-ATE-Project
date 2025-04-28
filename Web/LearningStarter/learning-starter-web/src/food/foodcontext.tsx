import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

interface NutrientData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  date: string;
}

interface DailySummary {
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  calories: number;
}

interface FoodContextType {
  dailyNutrients: DailySummary;
  addFood: (food: NutrientData) => void;
}

const FoodContext = createContext<FoodContextType | undefined>(undefined);

export const FoodProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [foods, setFoods] = useState<NutrientData[]>([]);
  const [dailyNutrients, setDailyNutrients] = useState<DailySummary>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
  });

  const addFood = (food: NutrientData) => {
    setFoods((prev) => [...prev, food]);
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const todaysFoods = foods.filter((f) => f.date === today);

    const total = todaysFoods.reduce(
      (acc, food) => {
        acc.calories += food.calories;
        acc.protein += food.protein;
        acc.carbs += food.carbs;
        acc.fat += food.fat;
        acc.fiber += food.fiber;
        acc.sugar += food.sugar;
        return acc;
      },
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
      }
    );

    setDailyNutrients(total);
  }, [foods]);

  return (
    <FoodContext.Provider value={{ dailyNutrients, addFood }}>
      {children}
    </FoodContext.Provider>
  );
};

export const useFoodContext = () => {
  const context = useContext(FoodContext);
  if (!context) {
    throw new Error("useFoodContext must be used within a FoodProvider");
  }
  return context;
};
