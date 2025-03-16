import React, { useState } from "react";
import { Button } from "react-bootstrap";
import MineralsTable from "./MineralsTable"; // Importăm tabelul de minerale

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

const SelectedFoodList = ({ selectedFoods, removeFood }) => {
  const [analysis, setAnalysis] = useState(""); // 🔥 Stocăm rezultatul analizei
  const [errorMessage, setErrorMessage] = useState(""); // 🔥 Stocăm mesajul de eroare
  let lastRequestTime = 0;

  const generateAnalysis = async () => {
    setErrorMessage(""); // Resetăm eroarea la fiecare request
    if (!selectedFoods || selectedFoods.length === 0) {
      setAnalysis("❌ Nu ai selectat alimente pentru analiză.");
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
    console.log("🔍 Nutrienți calculați:", totalNutrients);
    const now = Date.now();
    if (now - lastRequestTime < 3000) {
      // 🔥 Așteaptă 3 secunde între request-uri
      setAnalysis(
        "⚠️ Te rog așteaptă câteva secunde înainte de a încerca din nou."
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
              content:
                "Ești un expert în nutriție. Analizează aceste date nutriționale și oferă o evaluare a impactului asupra sănătății.",
            },
            {
              role: "user",
              content: `Am consumat o masă cu următoarele valori:
            - Calorii: ${totalNutrients.calories.toFixed(1)} kcal
            - Proteine: ${totalNutrients.protein.toFixed(1)} g
            - Carbohidrați: ${totalNutrients.carbs.toFixed(1)} g
            - Grăsimi: ${totalNutrients.fat.toFixed(1)} g
            - Fibre: ${totalNutrients.fiber.toFixed(1)} g
            
            Poți analiza impactul acestei mese asupra glicemiei, metabolismului și sănătății generale?`,
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
          `❌ Eroare API: ${response.status} - ${
            errorData.error?.message || "Răspuns necunoscut"
          }`
        );
        console.log("🚨 Mesaj eroare API:", errorMessage); // 🔥 Debugging
        return;
      }

      const result = await response.json();

      // Verificăm dacă API-ul a returnat un răspuns valid
      if (!result.choices || result.choices.length === 0) {
        setErrorMessage("❌ Eroare: Răspuns invalid de la API.");
        return;
      }

      setAnalysis(result.choices[0].message.content);
    } catch (error) {
      setErrorMessage("❌ Eroare: Nu s-a putut conecta la OpenAI.");
      console.error("🚨 Eroare OpenAI:", error);
    }
  };
  return (
    <div className="container mt-3">
      <div className="selected-foods-container">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="diet-info-title">Alimente Selectate</h5>
          <Button variant="info" size="sm" onClick={generateAnalysis}>
            Analiza AI
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
                  Șterge
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white">Nu ai selectat niciun aliment.</p>
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
        <div className="analysis-container mt-3 p-3 bg-dark text-white rounded">
          <h5>🔍 Analiza AI:</h5>
          <p>{analysis}</p>
        </div>
      )}
    </div>
  );
};

export default SelectedFoodList;
