import React, { useState, useEffect, useRef, useContext } from "react";
import { Button } from "react-bootstrap";
import MineralsTable from "./MineralsTable";
import { LanguageContext } from "../LanguageContext";
//import axios from "axios";

//const DEEPSEEK_API_KEY = process.env.REACT_APP_DEEPSEEK_API_KEY;

const SelectedFoodList = ({ selectedFoods, removeFood }) => {
  const [analysis, setAnalysis] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const analysisRef = useRef(null);
  const { language } = useContext(LanguageContext);

  //let lastRequestTime = 0;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        analysisRef.current &&
        !analysisRef.current.contains(event.target) &&
        event.target.id !== "analyze-btn"
      ) {
        setAnalysis("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (selectedFoods.length === 0) {
      setErrorMessage("");
      setAnalysis("");
    }
  }, [selectedFoods]);

// CAND O SA FIE GRATIS api-ul, o sa folosesc functia de mai jos

 /*  const generateAnalysis = async () => {
    setErrorMessage("");
    if (!selectedFoods || selectedFoods.length === 0) {
      setAnalysis(
        language === "ro"
          ? "❌ Nu ai selectat alimente pentru analiză."
          : "❌ You have not selected any foods for analysis."
      );
      return;
    }

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

    const userRomanian = `Am consumat o masă cu următoarele valori:
    - Calorii: ${totalNutrients.calories.toFixed(1)} kcal
    - Proteine: ${totalNutrients.protein.toFixed(1)} g
    - Carbohidrați: ${totalNutrients.carbs.toFixed(1)} g
    - Grăsimi: ${totalNutrients.fat.toFixed(1)} g
    - Fibre: ${totalNutrients.fiber.toFixed(1)} g            
    Poți analiza impactul acestei mese asupra glicemiei, metabolismului și sănătății generale?`;
    const userEnglish = `I ate a meal with the following values:
    - Calories: ${totalNutrients.calories.toFixed(1)} kcal
    - Proteins: ${totalNutrients.protein.toFixed(1)} g
    - Carbohydrates: ${totalNutrients.carbs.toFixed(1)} g
    - Fats: ${totalNutrients.fat.toFixed(1)} g
    - Fibres: ${totalNutrients.fiber.toFixed(1)} g            
    Can you analyze the impact of this meal on blood sugar, metabolism, and overall health?`;

    const now = Date.now();
    if (now - lastRequestTime < 3000) {
      setAnalysis(
        language === "ro"
          ? "⚠️ Te rog așteaptă câteva secunde înainte de a încerca din nou."
          : "⚠️ Please wait a few seconds before trying again."
      );
      return;
    }
    lastRequestTime = now;

    let data = JSON.stringify({
      messages: [
        {
          role: "system",
          content: language === "ro" ? userRomanian : userEnglish,
        },
        {
          role: "user",
          content:
            language === "ro"
              ? "Ești un expert în nutriție. Analizează aceste date nutriționale și oferă o evaluare a impactului asupra sănătății."
              : "You are a nutrition expert. Analyze this nutritional data and provide a health impact assessment.",
        },
      ],
      model: "deepseek-reasoner",
      frequency_penalty: 0,
      max_tokens: 2048,
      presence_penalty: 0,
      response_format: {
        type: "text",
      },
      stop: null,
      stream: false,
      stream_options: null,
      temperature: 1,
      top_p: 1,
      tools: null,
      tool_choice: "none",
      logprobs: false,
      top_logprobs: null,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.deepseek.com/v1/chat/completions", // Asigură-te că endpoint-ul este corect
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      data: data,
    };

    axios(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setAnalysis(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(
          language === "ro"
            ? `❌ Eroare: Răspuns invalid de la API. ${error.message}`
            : `❌ API invalid response ${error.message}`
        );
      });
  }; */

  return (
    <div className="container mt-3">
      <div className="selected-foods-container">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="diet-info-title">
            {language === "ro" ? "Alimente Selectate" : "Selected Foods"}
          </h5>
          {/* CAND O SA FIE GRATIS API-UL O SA FOLOSESC BUTONUL DE MAI JOS */}
          {/* <Button
            variant="info"
            id="analyze-btn"
            size="sm"
            onClick={generateAnalysis}
          >
            {language === "ro" ? "Analiza AI" : "AI Analysis"}
          </Button> */}
        </div>

        {selectedFoods.length > 0 ? (
          <div id="selected-list" className="row justify-content-center">
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
                  {language === "ro" ? "Șterge" : "Delete"}
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
          <h5>🔍 {language === "ro" ? "Analiza AI:" : "AI Analysis:"}</h5>
          <p>{analysis}</p>
        </div>
      )}
    </div>
  );
};

export default SelectedFoodList;
