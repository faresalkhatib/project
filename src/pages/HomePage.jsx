import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Grid, Icon } from "semantic-ui-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { COLORS, SPACING, SHADOWS } from "../utils/designConstants";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        direction: "rtl",
      }}
    >
      {/* Header with proper spacing */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Header />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1 }}>
        {/* Hero Section - Full Width */}
        <div
          style={{
            background: `linear-gradient(135deg, ${COLORS.primaryRed} 0%, #c41e3a 100%)`,
            padding: "clamp(3rem, 8vw, 8rem) 1rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative Background Pattern */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
            }}
          />

          <Container style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                textAlign: "center",
                maxWidth: "900px",
                margin: "0 auto",
              }}
            >
              <h1
                style={{
                  color: COLORS.textWhite,
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  fontWeight: "800",
                  marginBottom: "1.5rem",
                  lineHeight: 1.2,
                  textShadow: "0 2px 20px rgba(0,0,0,0.2)",
                }}
              >
                نظام حجز قاعات الامتحانات
              </h1>

              <p
                style={{
                  color: "rgba(255,255,255,0.95)",
                  fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
                  marginBottom: "2.5rem",
                  fontWeight: "300",
                  lineHeight: 1.6,
                }}
              >
                جامعة مؤتة - إدارة الامتحانات بكل سهولة وفعالية
              </p>

              <Button
                size="massive"
                style={{
                  backgroundColor: COLORS.textWhite,
                  color: COLORS.primaryRed,
                  padding: "1.2rem 3.5rem",
                  fontSize: "clamp(1rem, 2vw, 1.25rem)",
                  fontWeight: "bold",
                  borderRadius: "50px",
                  border: "none",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-3px)";
                  e.target.style.boxShadow = "0 15px 40px rgba(0,0,0,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 10px 30px rgba(0,0,0,0.3)";
                }}
                onClick={() => navigate("/login")}
              >
                تسجيل الدخول
                <Icon name="arrow left" style={{ marginLEft: "0.8rem" }} />
              </Button>
            </div>
          </Container>
        </div>

        {/* Features Section */}
        <Container
          style={{
            padding: "clamp(3rem, 8vw, 6rem) 1rem",
            maxWidth: "1400px",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              color: COLORS.textPrimary,
              fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
              fontWeight: "700",
              marginBottom: "clamp(2rem, 5vw, 4rem)",
            }}
          >
            الخدمات المتاحة
          </h2>

          <Grid columns={3} stackable style={{ margin: 0 }}>
            <Grid.Column style={{ padding: "1rem" }}>
              <div
                style={{
                  padding: "clamp(2rem, 4vw, 3rem)",
                  textAlign: "center",
                  backgroundColor: COLORS.bgLight,
                  borderRadius: "20px",
                  boxShadow: "0 5px 25px rgba(0,0,0,0.08)",
                  height: "100%",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  border: "2px solid transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 40px rgba(0,0,0,0.12)";
                  e.currentTarget.style.borderColor = COLORS.primaryRed;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 5px 25px rgba(0,0,0,0.08)";
                  e.currentTarget.style.borderColor = "transparent";
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    margin: "0 auto 1.5rem",
                    background: `linear-gradient(135deg, ${COLORS.primaryRed}, #c41e3a)`,
                    borderRadius: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 20px rgba(139, 0, 0, 0.3)",
                  }}
                >
                  <Icon
                    name="student"
                    style={{
                      color: COLORS.textWhite,
                      fontSize: "2.5rem",
                      margin: 0,
                    }}
                  />
                </div>

                <h3
                  style={{
                    color: COLORS.textPrimary,
                    fontSize: "clamp(1.3rem, 2.5vw, 1.6rem)",
                    fontWeight: "700",
                    marginBottom: "1rem",
                  }}
                >
                  الطلاب
                </h3>

                <p
                  style={{
                    color: COLORS.textSecondary,
                    fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
                    lineHeight: 1.7,
                  }}
                >
                  عرض جدول الامتحانات والمواد المسجلة بطريقة واضحة ومنظمة
                </p>
              </div>
            </Grid.Column>

            <Grid.Column style={{ padding: "1rem" }}>
              <div
                style={{
                  padding: "clamp(2rem, 4vw, 3rem)",
                  textAlign: "center",
                  backgroundColor: COLORS.bgLight,
                  borderRadius: "20px",
                  boxShadow: "0 5px 25px rgba(0,0,0,0.08)",
                  height: "100%",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  border: "2px solid transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 40px rgba(0,0,0,0.12)";
                  e.currentTarget.style.borderColor = COLORS.primaryRed;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 5px 25px rgba(0,0,0,0.08)";
                  e.currentTarget.style.borderColor = "transparent";
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    margin: "0 auto 1.5rem",
                    background: `linear-gradient(135deg, ${COLORS.primaryRed}, #c41e3a)`,
                    borderRadius: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 20px rgba(139, 0, 0, 0.3)",
                  }}
                >
                  <Icon
                    name="user"
                    style={{
                      color: COLORS.textWhite,
                      fontSize: "2.5rem",
                      margin: 0,
                    }}
                  />
                </div>

                <h3
                  style={{
                    color: COLORS.textPrimary,
                    fontSize: "clamp(1.3rem, 2.5vw, 1.6rem)",
                    fontWeight: "700",
                    marginBottom: "1rem",
                  }}
                >
                  المدرسون
                </h3>

                <p
                  style={{
                    color: COLORS.textSecondary,
                    fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
                    lineHeight: 1.7,
                  }}
                >
                  حجز القاعات للامتحانات وإدارة الحجوزات بكل مرونة
                </p>
              </div>
            </Grid.Column>

            <Grid.Column style={{ padding: "1rem" }}>
              <div
                style={{
                  padding: "clamp(2rem, 4vw, 3rem)",
                  textAlign: "center",
                  backgroundColor: COLORS.bgLight,
                  borderRadius: "20px",
                  boxShadow: "0 5px 25px rgba(0,0,0,0.08)",
                  height: "100%",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  border: "2px solid transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 40px rgba(0,0,0,0.12)";
                  e.currentTarget.style.borderColor = COLORS.primaryRed;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 5px 25px rgba(0,0,0,0.08)";
                  e.currentTarget.style.borderColor = "transparent";
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    margin: "0 auto 1.5rem",
                    background: `linear-gradient(135deg, ${COLORS.primaryRed}, #c41e3a)`,
                    borderRadius: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 20px rgba(139, 0, 0, 0.3)",
                  }}
                >
                  <Icon
                    name="settings"
                    style={{
                      color: COLORS.textWhite,
                      fontSize: "2.5rem",
                      margin: 0,
                    }}
                  />
                </div>

                <h3
                  style={{
                    color: COLORS.textPrimary,
                    fontSize: "clamp(1.3rem, 2.5vw, 1.6rem)",
                    fontWeight: "700",
                    marginBottom: "1rem",
                  }}
                >
                  الإدارة
                </h3>

                <p
                  style={{
                    color: COLORS.textSecondary,
                    fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
                    lineHeight: 1.7,
                  }}
                >
                  الموافقة على الحجوزات وإدارة القاعات بكفاءة عالية
                </p>
              </div>
            </Grid.Column>
          </Grid>
        </Container>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
