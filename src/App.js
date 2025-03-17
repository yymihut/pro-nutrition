import React, { useState, useEffect, useContext } from "react";
import BackgroundChanger from "./Components/BackgroundChanger";
import Header from "./Components/Header";
import SelectedFoodList from "./Components/SelectedFoodList";
import CategoryDropdown from "./Components/CategoryDropdown";
import foodsData from "./Data/foods.json";
import DietInfo from "./Components/DietInfo";
import Footer from "./Components/Footer";
import { LanguageContext } from "./LanguageContext";
import "./App.css";

const LOCAL_STORAGE_KEY = "selectedFoods";

const App = () => {
  const [search, setSearch] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedFoods, setSelectedFoods] = useState([]);
  const { language } = useContext(LanguageContext); // 🔥 Obținem limba curentă

  // ✅ Funcție pentru resetarea selecțiilor
  const resetSelections = () => {
    setSelectedFoods([]); // 🔥 Șterge toate alimentele selectate
    setSearch(""); // 🔥 Resetează căutarea alimentelor
    setQuantity(""); // 🔥 Resetează câmpul de cantitate
  };

  // Încarcă alimentele din localStorage la montare
  useEffect(() => {
    const storedFoods = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (storedFoods) setSelectedFoods(storedFoods);
  }, []);

  // Salvează lista de alimente selectate ori de câte ori se modifică
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(selectedFoods));
  }, [selectedFoods]);

  const addFood = (food, qty) => {
    if (!food || !qty) return;

    setSelectedFoods((prevFoods) => {
      const existingFoodIndex = prevFoods.findIndex(
        (f) => f.name === food.name
      );

      if (existingFoodIndex !== -1) {
        // Dacă alimentul există, actualizăm cantitatea
        return prevFoods.map((item, index) =>
          index === existingFoodIndex
            ? { ...item, quantity: item.quantity + parseInt(qty) }
            : item
        );
      } else {
        // Dacă alimentul este nou, îl adăugăm
        return [...prevFoods, { ...food, quantity: parseInt(qty) }];
      }
    });

    // Resetează câmpurile după adăugare
    setSearch("");
    setQuantity("");
  };

  const removeFood = (index) => {
    setSelectedFoods((prevFoods) => prevFoods.filter((_, i) => i !== index));
  };

  // Calculăm totalurile
  const totalCalories = selectedFoods.reduce(
    (acc, f) => acc + (f.calories * f.quantity) / 100,
    0
  );
  const totalProtein = selectedFoods.reduce(
    (acc, f) => acc + (f.protein * f.quantity) / 100,
    0
  );
  const totalCarbs = selectedFoods.reduce(
    (acc, f) => acc + (f.carbs * f.quantity) / 100,
    0
  );
  const totalFat = selectedFoods.reduce(
    (acc, f) => acc + (f.fat * f.quantity) / 100,
    0
  );
  const totalFiber = selectedFoods.reduce(
    (acc, f) => acc + (f.fiber * f.quantity) / 100,
    0
  );

  // 🔹 Calculăm totalul macronutrienților (fără fibre, doar proteine, carbohidrați și grăsimi)
  const totalMacronutrients = totalProtein + totalCarbs + totalFat;
  const proteinPercentage = totalMacronutrients
    ? (totalProtein / totalMacronutrients) * 100
    : 0;
  const carbsPercentage = totalMacronutrients
    ? (totalCarbs / totalMacronutrients) * 100
    : 0;
  const fatPercentage = totalMacronutrients
    ? (totalFat / totalMacronutrients) * 100
    : 0;

  const headerRef = React.useRef(null);

  const determineDietType = () => {
    const total = totalProtein + totalCarbs + totalFat;
    if (total === 0) return  language === "ro" ? "Dieta necunoscuta" : "Unknown Diet";

    const proteinRatio = (totalProtein / total) * 100;
    const carbRatio = (totalCarbs / total) * 100;
    const fatRatio = (totalFat / total) * 100;

    if (
      proteinRatio >= 15 &&
      proteinRatio <= 25 &&
      carbRatio >= 45 &&
      carbRatio <= 55 &&
      fatRatio >= 25 &&
      fatRatio <= 35
    )
      return language === "ro" ? "Dieta Echilibrată" : "Balanced Diet";

    if (
      proteinRatio >= 15 &&
      proteinRatio <= 25 &&
      carbRatio >= 5 &&
      carbRatio <= 10 &&
      fatRatio >= 65 &&
      fatRatio <= 80
    )
      return language === "ro" ? "Dieta Ketogenică" : "Ketogenic Diet"; 

    if (
      proteinRatio >= 20 &&
      proteinRatio <= 30 &&
      carbRatio >= 10 &&
      carbRatio <= 30 &&
      fatRatio >= 40 &&
      fatRatio <= 60
    )
      return language === "ro" ? "Dieta Low-Carb" : "Low-Carb Diet" ;

    if (
      proteinRatio >= 30 &&
      proteinRatio <= 50 &&
      carbRatio >= 20 &&
      carbRatio <= 40 &&
      fatRatio >= 20 &&
      fatRatio <= 30
    )
      return language === "ro" ? "Dieta High-Protein" : "High-Protein Diet";

    if (
      proteinRatio >= 15 &&
      proteinRatio <= 25 &&
      carbRatio >= 55 &&
      carbRatio <= 70 &&
      fatRatio >= 10 &&
      fatRatio <= 20
    )
      return language === "ro" ? "Dieta Low-Fat" : "Low-Fat Diet" ;

    if (
      proteinRatio >= 15 &&
      proteinRatio <= 20 &&
      carbRatio >= 40 &&
      carbRatio <= 50 &&
      fatRatio >= 30 &&
      fatRatio <= 40
    )
      return language === "ro" ? "Dieta Mediteraneană" : "Mediteranean Diet"  ;

    if (
      proteinRatio >= 10 &&
      proteinRatio <= 20 &&
      carbRatio >= 50 &&
      carbRatio <= 65 &&
      fatRatio >= 20 &&
      fatRatio <= 30
    )
      return language === "ro" ? "Dieta Vegetariană/Vegană" : "Vegan Diet" ;

    if (
      proteinRatio >= 20 &&
      proteinRatio <= 35 &&
      carbRatio >= 25 &&
      carbRatio <= 40 &&
      fatRatio >= 30 &&
      fatRatio <= 50
    )
      return language === "ro" ? "Dieta Paleo" : "Paleo Diet" ;

    return language === "ro" ? "Dietă Neclasificată" : "Unclasified Diet";
  };

  const dietType = determineDietType();

  return (
    
    <div>
      <BackgroundChanger />
      <div className="app-container">
        {/* HEADER FIX - acesta rămâne fix în partea de sus */}
        <Header
          foods={foodsData}
          search={search}
          setSearch={setSearch}
          quantity={quantity}
          setQuantity={setQuantity}
          addFood={addFood}
          totalCalories={
            isNaN(parseFloat(totalCalories))
              ? 0.0
              : parseFloat(totalCalories).toFixed(1)
          }
          totalProtein={
            isNaN(parseFloat(totalProtein))
              ? 0.0
              : parseFloat(totalProtein).toFixed(1)
          }
          totalCarbs={
            isNaN(parseFloat(totalCarbs))
              ? 0.0
              : parseFloat(totalCarbs).toFixed(1)
          }
          totalFat={
            isNaN(parseFloat(totalFat)) ? 0.0 : parseFloat(totalFat).toFixed(1)
          }
          totalFiber={
            isNaN(parseFloat(totalFiber))
              ? 0.0
              : parseFloat(totalFiber).toFixed(1)
          }
          proteinPercentage={proteinPercentage} // ✅ Adăugat
          carbsPercentage={carbsPercentage} // ✅ Adăugat
          fatPercentage={fatPercentage} // ✅ Adăugat
          headerRef={headerRef}
          dietType={dietType} // 🔹 Adaugă această linie pentru a transmite dietType
          resetSelections={resetSelections} // ✅ se reseteaza selectiile
        />

        {/* CONȚINUTUL paginii – se asigură că nu este acoperit de header */}
        <div className="content">
          {/* Lista alimentelor selectate */}
          <SelectedFoodList
            selectedFoods={selectedFoods}
            removeFood={removeFood}
            resetSelections={resetSelections} // ✅ Adăugat
          />

          {/* Dropdown-urile pe categorii – folosește layout-ul "row row-cols-*" */}
          <CategoryDropdown
            foods={foodsData}
            addFood={addFood}
            resetSelections={resetSelections}
          />
          <div className="App">
            {/* Alte componente */}
            <DietInfo />{" "}
            {/* ✅ Afișăm componenta cu informațiile despre diete */}
            <Footer /> {/* ✅ Afișează footer-ul */}
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default App;
