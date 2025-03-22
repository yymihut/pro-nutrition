import React, { useContext } from "react";
import { LanguageContext } from "../LanguageContext";

// import { translations } from "../translations";
// const t = (key) => translations[key]?.[language] || translations[key]?.["en"];
// {t("total_calories")}

const dietsByLanguage = {
  ro: [
    {
      name: "Dieta Echilibrată (Clasică)",
      protein: "15-25%",
      carbs: "45-55%",
      fat: "25-35%",
      fiber: "25-30g/zi",
    },
    {
      name: "Dieta Ketogenică (LCHF)",
      protein: "15-25%",
      carbs: "5-10%",
      fat: "65-80%",
      fiber: "20-30g/zi",
    },
    {
      name: "Dieta Low-Carb",
      protein: "20-30%",
      carbs: "10-30%",
      fat: "40-60%",
      fiber: "20-35g/zi",
    },
    {
      name: "Dieta High-Protein",
      protein: "30-50%",
      carbs: "20-40%",
      fat: "20-30%",
      fiber: "30-40g/zi",
    },
    {
      name: "Dieta Low-Fat",
      protein: "15-25%",
      carbs: "55-70%",
      fat: "10-20%",
      fiber: "30-40g/zi",
    },
    {
      name: "Dieta Mediteraneană",
      protein: "15-20%",
      carbs: "40-50%",
      fat: "30-40%",
      fiber: "35-45g/zi",
    },
    {
      name: "Dieta Vegetariană/Vegană",
      protein: "10-20%",
      carbs: "50-65%",
      fat: "20-30%",
      fiber: "40-50g/zi",
    },
    {
      name: "Dieta Paleo",
      protein: "20-35%",
      carbs: "25-40%",
      fat: "30-50%",
      fiber: "35-50g/zi",
    },
  ],
  en: [
    {
      name: "Balanced Diet (Classic)",
      protein: "15-25%",
      carbs: "45-55%",
      fat: "25-35%",
      fiber: "25-30g/day",
    },
    {
      name: "Ketogenic Diet (LCHF)",
      protein: "15-25%",
      carbs: "5-10%",
      fat: "65-80%",
      fiber: "20-30g/day",
    },
    {
      name: "Low-Carb Diet",
      protein: "20-30%",
      carbs: "10-30%",
      fat: "40-60%",
      fiber: "20-35g/day",
    },
    {
      name: "High-Protein Diet",
      protein: "30-50%",
      carbs: "20-40%",
      fat: "20-30%",
      fiber: "30-40g/day",
    },
    {
      name: "Low-Fat Diet",
      protein: "15-25%",
      carbs: "55-70%",
      fat: "10-20%",
      fiber: "30-40g/day",
    },
    {
      name: "Mediterranean Diet",
      protein: "15-20%",
      carbs: "40-50%",
      fat: "30-40%",
      fiber: "35-45g/day",
    },
    {
      name: "Vegetarian/Vegan Diet",
      protein: "10-20%",
      carbs: "50-65%",
      fat: "20-30%",
      fiber: "40-50g/day",
    },
    {
      name: "Paleo Diet",
      protein: "20-35%",
      carbs: "25-40%",
      fat: "30-50%",
      fiber: "35-50g/day",
    },
  ],
  fr: [
    {
      name: "Régime équilibré (classique)",
      protein: "15-25%",
      carbs: "45-55%",
      fat: "25-35%",
      fiber: "25-30g/jour",
    },
    {
      name: "Régime cétogène (LCHF)",
      protein: "15-25%",
      carbs: "5-10%",
      fat: "65-80%",
      fiber: "20-30g/jour",
    },
    {
      name: "Régime Low-Carb",
      protein: "20-30%",
      carbs: "10-30%",
      fat: "40-60%",
      fiber: "20-35g/jour",
    },
    {
      name: "Régime High-Protein",
      protein: "30-50%",
      carbs: "20-40%",
      fat: "20-30%",
      fiber: "30-40g/jour",
    },
    {
      name: "Régime Low-Fat",
      protein: "15-25%",
      carbs: "55-70%",
      fat: "10-20%",
      fiber: "30-40g/jour",
    },
    {
      name: "Régime Méditerranéen",
      protein: "15-20%",
      carbs: "40-50%",
      fat: "30-40%",
      fiber: "35-45g/jour",
    },
    {
      name: "Régime Végétarien/Végétalien",
      protein: "10-20%",
      carbs: "50-65%",
      fat: "20-30%",
      fiber: "40-50g/jour",
    },
    {
      name: "Régime Paléo",
      protein: "20-35%",
      carbs: "25-40%",
      fat: "30-50%",
      fiber: "35-50g/jour",
    },
  ],
  de: [
    {
      name: "Ausgewogene Ernährung (Klassisch)",
      protein: "15-25%",
      carbs: "45-55%",
      fat: "25-35%",
      fiber: "25-30g/Tag",
    },
    {
      name: "Ketogene Diät (LCHF)",
      protein: "15-25%",
      carbs: "5-10%",
      fat: "65-80%",
      fiber: "20-30g/Tag",
    },
    {
      name: "Low-Carb-Diät",
      protein: "20-30%",
      carbs: "10-30%",
      fat: "40-60%",
      fiber: "20-35g/Tag",
    },
    {
      name: "High-Protein-Diät",
      protein: "30-50%",
      carbs: "20-40%",
      fat: "20-30%",
      fiber: "30-40g/Tag",
    },
    {
      name: "Low-Fat-Diät",
      protein: "15-25%",
      carbs: "55-70%",
      fat: "10-20%",
      fiber: "30-40g/Tag",
    },
    {
      name: "Mittelmeer-Diät",
      protein: "15-20%",
      carbs: "40-50%",
      fat: "30-40%",
      fiber: "35-45g/Tag",
    },
    {
      name: "Vegetarische/Vegane Diät",
      protein: "10-20%",
      carbs: "50-65%",
      fat: "20-30%",
      fiber: "40-50g/Tag",
    },
    {
      name: "Paleo-Diät",
      protein: "20-35%",
      carbs: "25-40%",
      fat: "30-50%",
      fiber: "35-50g/Tag",
    },
  ],
};

const DietInfo = () => {
  const { language } = useContext(LanguageContext); // 🔥 Obținem limba curentă
  const diets = dietsByLanguage[language] || dietsByLanguage["en"];

  return (
    <div className="container mt-4">
      <h2 className="diet-info-title">
        {language === "ro"
          ? "Informații despre diete"
          : language === "fr"
          ? "Informations sur les régimes"
          : language === "de"
          ? "Informationen über Diäten"
          : "Information about diets"}{" "}
      </h2>
      <div className="row justify-content-center">
        {diets.map((diet, index) => (
          <div key={index} className="col-md-6 col-lg-4 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{diet.name}</h5>
                <p className="mb-1">
                  <strong>
                    {language === "ro"
                      ? "Proteine"
                      : language === "fr"
                      ? "Protéines"
                      : language === "de"
                      ? "Proteine"
                      : "Proteins"}
                    :
                  </strong>{" "}
                  {diet.protein}
                </p>
                <p className="mb-1">
                  <strong>
                    {language === "ro"
                      ? "Carbohidrați"
                      : language === "fr"
                      ? "Glucides"
                      : language === "de"
                      ? "Kohlenhydrate"
                      : "Carbohydrates"}
                    :
                  </strong>{" "}
                  {diet.carbs}
                </p>
                <p className="mb-1">
                  <strong>
                    {language === "ro"
                      ? "Grăsimi"
                      : language === "fr"
                      ? "Lipides"
                      : language === "de"
                      ? "Fette"
                      : "Fats"}
                    :
                  </strong>{" "}
                  {diet.fat}
                </p>
                <p className="mb-1">
                  <strong>
                    {language === "ro"
                      ? "Fibre"
                      : language === "fr"
                      ? "Fibres"
                      : language === "de"
                      ? "Ballaststoffe"
                      : "Fibers"}
                    :
                  </strong>{" "}
                  {diet.fiber}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DietInfo;
