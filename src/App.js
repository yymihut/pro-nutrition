import React, { useState, useEffect, useContext } from "react";
import BackgroundChanger from "./Components/BackgroundChanger";
import Header from "./Components/Header";
import SelectedFoodList from "./Components/SelectedFoodList";
import foodsData from "./Data/foods.json";
import DietInfo from "./Components/DietInfo";
import Footer from "./Components/Footer";
import { LanguageContext } from "./LanguageContext";
import "./App.css";
import { initBilling, buyRemoveAds, hasRemoveAds } from "./Services/BillingService"
import { Capacitor }  from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

const dietLabels = {
  unknown: {
    ro: "Dietă Necunoscută",
    en: "Unknown Diet",
    fr: "Régime Inconnu",
    de: "Unbekannte Diät",
  },
  balanced: {
    ro: "Dieta Echilibrată",
    en: "Balanced Diet",
    fr: "Régime Équilibré",
    de: "Ausgewogene Ernährung",
  },
  keto: {
    ro: "Dieta Ketogenică",
    en: "Ketogenic Diet",
    fr: "Régime Cétogène",
    de: "Ketogene Diät",
  },
  lowCarb: {
    ro: "Dieta Low-Carb",
    en: "Low-Carb Diet",
    fr: "Régime Low-Carb",
    de: "Low-Carb-Diät",
  },
  highProtein: {
    ro: "Dieta High-Protein",
    en: "High-Protein Diet",
    fr: "Régime Hyperprotéiné",
    de: "High-Protein-Diät",
  },
  lowFat: {
    ro: "Dieta Low-Fat",
    en: "Low-Fat Diet",
    fr: "Régime Pauvre en Graisses",
    de: "Low-Fat-Diät",
  },
  mediterranean: {
    ro: "Dieta Mediteraneană",
    en: "Mediterranean Diet",
    fr: "Régime Méditerranéen",
    de: "Mittelmeer-Diät",
  },
  vegan: {
    ro: "Dieta Vegetariană/Vegană",
    en: "Vegan Diet",
    fr: "Régime Végétarien/Végétalien",
    de: "Vegetarische/Vegane Diät",
  },
  paleo: {
    ro: "Dieta Paleo",
    en: "Paleo Diet",
    fr: "Régime Paléo",
    de: "Paleo-Diät",
  },
  unclassified: {
    ro: "Dietă Neclasificată",
    en: "Unclassified Diet",
    fr: "Régime Non Classé",
    de: "Nicht Klassifizierte Diät",
  },
};

const LOCAL_STORAGE_KEY = "selectedFoods";

const App = () => {
  const [search, setSearch] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedFoods, setSelectedFoods] = useState([]);
  const { language } = useContext(LanguageContext); // 🔥 Obținem limba curentă
  const [selectedCategory, setSelectedCategory] = useState("");
  const [adsRemoved, setAdsRemoved] = useState(false);

  
  // ✅ Use computed name in rendering (if needed)
  // const getLocalizedName = (food) => food[`name_${language.toUpperCase()}`];

  // ✅ Funcție pentru resetarea selecțiilor
  const resetSelections = () => {
    setSelectedFoods([]); // 🔥 Șterge toate alimentele selectate
    setSearch(""); // 🔥 Resetează căutarea alimentelor
    setQuantity(""); // 🔥 Resetează câmpul de cantitate
    setSelectedCategory(""); // 🔁 Resetează categoria la toate
  };

 // doar o singură chemare – fără if/else încrucișat
const handleRemoveAds = () => {
  buyRemoveAds((owned) => setAdsRemoved(owned));
};

useEffect(() => {
  if (Capacitor.isNativePlatform()) {
    const remove = initBilling((owned) => setAdsRemoved(owned));
    return () => remove();           // cleanup în dev/hot-reload
  }
}, []);

  // Încarcă alimentele din localStorage la montare
  useEffect(() => {
    const storedFoods = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (storedFoods) setSelectedFoods(storedFoods);
  }, []);

  // Salvează lista de alimente selectate ori de câte ori se modifică
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(selectedFoods));
  }, [selectedFoods]);

  // ✅ Funcție pentru a verifica dacă cantitatea este validă
  const isValidQuantity = (qty) => {
    const value = parseFloat(qty);
    return !isNaN(value) && value > 0;
  };

  // ✅ Funcție pentru a adăuga alimente
  const addFood = (food, qty) => {
    if (!food || !isValidQuantity(qty)) {
      alert(
        language === "ro"
          ? "❌ Introdu o cantitate validă (> 0)!"
          : "❌ Please enter a valid quantity (> 0)!"
      );
      return;
    }

    const newFood = {
      id: food.id,
      quantity: parseInt(qty),
      calories: parseFloat(food.calories) || 0,
      protein: parseFloat(food.protein) || 0,
      carbs: parseFloat(food.carbs) || 0,
      fat: parseFloat(food.fat) || 0,
      fiber: parseFloat(food.fiber) || 0,
    };

    setSelectedFoods((prevFoods) => {
      const existingFoodIndex = prevFoods.findIndex((f) => f.id === newFood.id);
      if (existingFoodIndex !== -1) {
        return prevFoods.map((item, index) =>
          index === existingFoodIndex
            ? { ...item, quantity: item.quantity + newFood.quantity }
            : item
        );
      } else {
        return [...prevFoods, newFood];
      }
    });

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
    if (total === 0)
      return dietLabels.unknown[language] || dietLabels.unknown.en;

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
      return dietLabels.balanced[language];

    if (
      proteinRatio >= 15 &&
      proteinRatio <= 25 &&
      carbRatio >= 5 &&
      carbRatio <= 10 &&
      fatRatio >= 65 &&
      fatRatio <= 80
    )
      return dietLabels.keto[language];

    if (
      proteinRatio >= 20 &&
      proteinRatio <= 30 &&
      carbRatio >= 10 &&
      carbRatio <= 30 &&
      fatRatio >= 40 &&
      fatRatio <= 60
    )
      return dietLabels.lowCarb[language];

    if (
      proteinRatio >= 30 &&
      proteinRatio <= 50 &&
      carbRatio >= 20 &&
      carbRatio <= 40 &&
      fatRatio >= 20 &&
      fatRatio <= 30
    )
      return dietLabels.highProtein[language];

    if (
      proteinRatio >= 15 &&
      proteinRatio <= 25 &&
      carbRatio >= 55 &&
      carbRatio <= 70 &&
      fatRatio >= 10 &&
      fatRatio <= 20
    )
      return dietLabels.lowFat[language];

    if (
      proteinRatio >= 15 &&
      proteinRatio <= 20 &&
      carbRatio >= 40 &&
      carbRatio <= 50 &&
      fatRatio >= 30 &&
      fatRatio <= 40
    )
      return dietLabels.mediterranean[language];

    if (
      proteinRatio >= 10 &&
      proteinRatio <= 20 &&
      carbRatio >= 50 &&
      carbRatio <= 65 &&
      fatRatio >= 20 &&
      fatRatio <= 30
    )
      return dietLabels.vegan[language];

    if (
      proteinRatio >= 20 &&
      proteinRatio <= 35 &&
      carbRatio >= 25 &&
      carbRatio <= 40 &&
      fatRatio >= 30 &&
      fatRatio <= 50
    )
      return dietLabels.paleo[language];

    return dietLabels.unclassified[language] || dietLabels.unclassified.en;
  };

  const dietType = determineDietType();

  // ✅ Funcție pentru a gestiona evenimentul de căutare
  const handleSearchInteractionEnd = () => {
    // Doar dacă nu s-a selectat aliment și cantitate
    if (!search && !quantity) return;
    const foundFood = foodsData.find(
      (food) =>
        food[`name_${language.toUpperCase()}`]?.toLowerCase() ===
        search?.toLowerCase()
    );
    // Dacă NU există aliment valid, resetăm
    if (!foundFood) {
      setSearch("");
      setQuantity("");
    }
  };

  return (
    <div>
      <BackgroundChanger />
      <div className="app-container">
        {/* HEADER FIX - acesta rămâne fix în partea de sus */}
        <Header
          adsRemoved={adsRemoved}
          removeAds={handleRemoveAds}
          foods={foodsData}
          search={search}
          setSearch={setSearch}
          quantity={quantity}
          setQuantity={setQuantity}
          addFood={addFood}
          onSearchInteractionEnd={handleSearchInteractionEnd}
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
          resetSelections={resetSelections} // ✅ se reseteaza selectiile
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* CONȚINUTUL paginii – se asigură că nu este acoperit de header */}
        <div className="content">
          {/* Lista alimentelor selectate */}
          <SelectedFoodList
            selectedFoods={selectedFoods}
            removeFood={removeFood}
            resetSelections={resetSelections} // ✅ Adăugat
            foodsData={foodsData}
            dietType={dietType} // 🔹 transmite dietType la componenta foodList
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
