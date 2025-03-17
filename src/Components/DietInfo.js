import React, {useContext } from "react";
import { LanguageContext } from "../LanguageContext";

const dietsRomanian = [
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
];

const dietsEnglish = [
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
    name: "Mediteranean Diet",
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
];

const DietInfo = () => {
  const { language } = useContext(LanguageContext); // 🔥 Obținem limba curentă
  return (
    <div className="container mt-4">
      <h2 className="diet-info-title">{language === "ro" ? "Informații despre diete" : "Information about diets"}</h2>
      <div className="row justify-content-center">
        {language === "ro"
          ? dietsRomanian.map((diet, index) => (
              <div key={index} className="col-md-6 col-lg-4 mb-3">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{diet.name}</h5>
                    <p className="mb-1">
                      <strong>Proteine:</strong> {diet.protein}
                    </p>
                    <p className="mb-1">
                      <strong>Carbohidrați:</strong> {diet.carbs}
                    </p>
                    <p className="mb-1">
                      <strong>Grăsimi:</strong> {diet.fat}
                    </p>
                    <p className="mb-1">
                      <strong>Fibre:</strong> {diet.fiber}
                    </p>
                  </div>
                </div>
              </div>
            ))
          : dietsEnglish.map((diet, index) => (
              <div key={index} className="col-md-6 col-lg-4 mb-3">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{diet.name}</h5>
                    <p className="mb-1">
                      <strong>Proteins:</strong> {diet.protein}
                    </p>
                    <p className="mb-1">
                      <strong>Carbohydrates:</strong> {diet.carbs}
                    </p>
                    <p className="mb-1">
                      <strong>Fats:</strong> {diet.fat}
                    </p>
                    <p className="mb-1">
                      <strong>Fibers:</strong> {diet.fiber}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        `
      </div>
    </div>
  );
};

export default DietInfo;
