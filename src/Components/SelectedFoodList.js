import React, { useState, useEffect, useRef, useContext } from "react";
import { Button } from "react-bootstrap";
import MineralsTable from "./MineralsTable"; // Importăm tabelul de minerale
import { LanguageContext } from "../LanguageContext";

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

const SelectedFoodList = ({ selectedFoods, removeFood, resetSelections }) => {
  const [analysis, setAnalysis] = useState(""); // 🔥 Stocăm rezultatul analizei
  const [errorMessage, setErrorMessage] = useState(""); // 🔥 Stocăm mesajul de eroare
  const analysisRef = useRef(null); // 🔥 Referință pentru analiză
  const { language } = useContext(LanguageContext); // 🔥 Obținem limba curentă

  let lastRequestTime = 0;

  // 🔹 Detectăm clicul în afara analizei și o ascundem
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        analysisRef.current &&
        !analysisRef.current.contains(event.target) &&
        event.target.id !== "analyze-btn" // 🔥 Evităm să ascundem când dăm clic pe butonul "Analiza AI"
      ) {
        setAnalysis(""); // 🔥 Ascunde analiza AI
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (selectedFoods.length === 0) {
      setErrorMessage(""); // 🔥 Șterge eroarea când lista se golește
      setAnalysis(""); // 🔥 Șterge analiza AI când lista se golește
    }
  }, [selectedFoods]);

  const generateAnalysis = async () => {
    setErrorMessage(""); // Resetăm eroarea la fiecare request
    if (!selectedFoods || selectedFoods.length === 0) {
      setAnalysis(
        `${
          language === "ro"
            ? "❌ Nu ai selectat alimente pentru analiză."
            : " You have not selected any foods for analysis."
        }`
      );
      return;
    }

    // 🛑 Verificăm dacă fiecare aliment are date valide
    const totalNutrients = selectedFoods.reduce(
      (totals, food) => ({
        calories:
          totals.calories + ((food.calories || 0) * (food.quantity || 0)) / 100,
        protein:
          totals.protein + ((food.protein || 0) * (food.quantity || 0)) / 100,
        carbs: totals.carbs + ((food.carbs || 0) * (food.quantity || 0)) / 100,
        fat: totals.fat + ((food.fat || 0) * (food.quantity || 0)) / 100,
        fiber: totals.fiber + ((food.fiber || 0) * (food.quantity || 0)) / 100,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );

    const { userRomanian } = `Am consumat o masă cu următoarele valori:
    - Calorii: ${totalNutrients.calories.toFixed(1)} kcal
    - Proteine: ${totalNutrients.protein.toFixed(1)} g
    - Carbohidrați: ${totalNutrients.carbs.toFixed(1)} g
    - Grăsimi: ${totalNutrients.fat.toFixed(1)} g
    - Fibre: ${totalNutrients.fiber.toFixed(1)} g            
    Poți analiza impactul acestei mese asupra glicemiei, metabolismului și sănătății generale?`;
    const { userEnglish } = `I ate a meal with the following values:
    - Calories: ${totalNutrients.calories.toFixed(1)} kcal
    - Proteins: ${totalNutrients.protein.toFixed(1)} g
    - Carbohydrates: ${totalNutrients.carbs.toFixed(1)} g
    - Fats: ${totalNutrients.fat.toFixed(1)} g
    - Fibres: ${totalNutrients.fiber.toFixed(1)} g            
    Can you analyze the impact of this meal on blood sugar, metabolism, and overall health?`;

    const now = Date.now();
    if (now - lastRequestTime < 3000) {
      // 🔥 Așteaptă 3 secunde între request-uri
      setAnalysis(
        `${
          language === "ro"
            ? "⚠️ Te rog așteaptă câteva secunde înainte de a încerca din nou."
            : "⚠️Please wait a few seconds before trying again."
        }`
      );
      return;
    }
    lastRequestTime = now;

    try {
      const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `${
                language === "ro"
                  ? "Ești un expert în nutriție. Analizează aceste date nutriționale și oferă o evaluare a impactului asupra sănătății."
                  : "You are a nutrition expert. Analyze this nutritional data and provide a health impact assessment."
              }`,
            },
            {
              role: "user",
              content: `${language === "ro" ? userRomanian : userEnglish}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 300,
        }),
      });
      // Verificăm dacă API-ul a returnat un status de eroare
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(
          `${language === "ro" ? "❌ Eroare API" : "❌ API Error"}: ${
            response.status
          } - ${
            errorData.error?.message || language === "ro"
              ? "Răspuns necunoscut"
              : "Unknown response"
          }`
        );
        return;
      }

      const result = await response.json();

      // Verificăm dacă API-ul a returnat un răspuns valid
      if (!result.choices || result.choices.length === 0) {
        setErrorMessage(
          language === "ro"
            ? "❌ Eroare: Răspuns invalid de la API."
            : "❌ API invalid response"
        );
        return;
      }

      setAnalysis(result.choices[0].message.content);
    } catch (error) {
      setErrorMessage(
        language === "ro"
          ? "❌ Eroare: Nu s-a putut conecta server AI."
          : "❌ AI Server Error"
      );
    }
  };
  return (
    <div className="container mt-3">
      <div className="selected-foods-container">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="diet-info-title">
            {language === "ro" ? "Alimente Selectate" : "Selected Foods"}
          </h5>
          <Button
            variant="info"
            id="analyze-btn"
            size="sm"
            onClick={generateAnalysis}
          >
            {language === "ro" ? "Analiza AI" : "AI Analisys"}
          </Button>
        </div>

        {selectedFoods.length > 0 ? (
          <div className="row justify-content-center">
            {selectedFoods.map((item, index) => (
              <div key={index} className="col-12 food-item">
                <div className="food-name">
                  {item.name} - {item.quantity} g/ml
                </div>
                <Button
                  className="delete-button"
                  size="sm"
                  onClick={() => removeFood(index)}
                >
                  {language === "ro" ? "Sterge" : "Delete"}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white">
            {language === "ro"
              ? "Nu ai selectat nici un aliment"
              : "There is no food selected"}
          </p>
        )}
      </div>
      {errorMessage && (
        <div className="error-container mt-2 p-2 bg-danger text-white rounded">
          {errorMessage}
        </div>
      )}
      {selectedFoods.length > 0 && (
        <MineralsTable selectedFoods={selectedFoods} />
      )}

      {analysis && (
        <div
          ref={analysisRef}
          className="analysis-container mt-3 p-3 bg-dark text-white rounded"
        >
          <h5>🔍 {language === "ro" ? "Analiza AI:" : "AI analisys:"}</h5>
          <p>{analysis}</p>
        </div>
      )}
    </div>
  );
};

export default SelectedFoodList;
