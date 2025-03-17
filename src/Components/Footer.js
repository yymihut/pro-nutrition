import React, { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { LanguageContext } from "../LanguageContext";

const Footer = () => {
  const { language } = useContext(LanguageContext); // 🔥 Obținem limba curentă

  return (
    <footer id="footer" className="bg-dark text-white text-center py-3">
      <Container>
        <Row className="row-footer">
          <Col className="footer-col" md={4}>
            <h5>📍 Contact: </h5>
            <ul className="list-unstyled">
              <li>
                <a href="https://mail.google.com/" className="text-white">
                  pronutritionaiteam@gmail.com
                </a>
              </li>
            </ul>
          </Col>

          <Col className="footer-col" md={4}>
            <h5>📌 {language === "ro" ? "Urmărește-ne" : "Follow us"}</h5>
            <a href="https://www.tiktok.com" className="text-white mx-2">
              TikTok
            </a>
          </Col>
          <Col className="footer-col" md={4}>
            <h5>ℹ️ {language === "ro" ? "Despre noi" : "About us"}</h5>
            <p>
              {language === "ro"
                ? "Suntem o echipă pasionată de nutriție și sănătate, oferind un calculator nutrițional bazat pe normele UE."
                : "We are a team passionate about nutrition and health, offering a nutritional calculator based on EU norms."}
            </p>
          </Col>
        </Row>

        <hr className="bg-light" />
        <p>
        © 2025 by Pro-Nutrition-AI-Team | {language === "ro" ? "Date nutriționale preluate conform normelor UE - EFSA" : "Nutritional data taken according to EU rules - EFSA"}
        </p>
      </Container>
    </footer>
  );
};

export default Footer;

/* import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container-fluid text-center py-2 text-light">
        © 2025 by Mihut Marius
      </div>
    </footer>
  );
};

export default Footer;
 */
