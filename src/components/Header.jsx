import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, Icon } from "semantic-ui-react";
import { logoutUser } from "../redux/userSlice";
import { COLORS } from "../utils/designConstants";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const getRoleName = (role) => {
    const roles = {
      student: "طالب",
      teacher: "مدرس",
      admin: "إداري",
    };
    return roles[role] || role;
  };

  const getDashboardRoute = () => {
    if (!user) return "/";
    switch (user.role) {
      case "student":
        return "/student";
      case "teacher":
        return "/teacher";
      case "admin":
        return "/admin";
      default:
        return "/";
    }
  };

  const navigateToDashboard = () => {
    navigate(getDashboardRoute());
    setMobileMenuOpen(false);
  };

  return (
    <header
      style={{
        background: `linear-gradient(135deg, ${COLORS.primaryRed} 0%, #a01820 100%)`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        position: "relative",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          maxWidth: "1600px",
          margin: "0 auto",
          padding: "0 clamp(1rem, 3vw, 2rem)",
        }}
      >
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: "70px",
            gap: "1rem",
          }}
        >
          {/* Logo Section */}
          <div
            onClick={() => !isAuthenticated && navigate("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.8rem",
              color: COLORS.textWhite,
              cursor: isAuthenticated ? "default" : "pointer",
              transition: "opacity 0.3s ease",
              flex: "0 0 auto",
            }}
            onMouseEnter={(e) =>
              !isAuthenticated && (e.currentTarget.style.opacity = "0.85")
            }
            onMouseLeave={(e) =>
              !isAuthenticated && (e.currentTarget.style.opacity = "1")
            }
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(10px)",
                flexShrink: 0,
              }}
            >
              <Icon
                name="university"
                style={{
                  fontSize: "1.5rem",
                  margin: 0,
                  color: COLORS.textWhite,
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.1rem",
              }}
            >
              <span
                style={{
                  fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
                  fontWeight: "800",
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                }}
              >
                جامعة مؤتة
              </span>
              <span
                style={{
                  fontSize: "clamp(0.75rem, 2vw, 0.9rem)",
                  fontWeight: "400",
                  opacity: 0.95,
                  whiteSpace: "nowrap",
                }}
              >
                نظام حجز قاعات الامتحانات
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              flex: "0 0 auto",
            }}
          >
            {!isAuthenticated ? (
              <>
                {/* Home Link - Desktop */}
                <button
                  onClick={() => navigate("/")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    background: "transparent",
                    border: "none",
                    color: COLORS.textWhite,
                    fontSize: "1rem",
                    fontWeight: "600",
                    padding: "0.6rem 1rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(255,255,255,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                  }}
                >
                  <Icon name="home" style={{ margin: 0, fontSize: "1.1rem" }} />
                  <span
                    style={{
                      display: window.innerWidth < 768 ? "none" : "inline",
                    }}
                  >
                    الرئيسية
                  </span>
                </button>

                {/* Login Button */}
                <Button
                  onClick={() => navigate("/login")}
                  style={{
                    background: COLORS.textWhite,
                    color: COLORS.primaryRed,
                    fontWeight: "700",
                    fontSize: "1rem",
                    padding: "0.7rem 1.8rem",
                    borderRadius: "10px",
                    border: "none",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
                  }}
                >
                  <Icon name="sign in" style={{ margin: 0 }} />
                  تسجيل الدخول
                </Button>
              </>
            ) : (
              <>
                {/* Dashboard Link - Desktop */}
                <button
                  onClick={navigateToDashboard}
                  style={{
                    display: window.innerWidth < 768 ? "none" : "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    background: "transparent",
                    border: "none",
                    color: COLORS.textWhite,
                    fontSize: "1rem",
                    fontWeight: "600",
                    padding: "0.6rem 1rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(255,255,255,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                  }}
                >
                  <Icon
                    name="dashboard"
                    style={{ margin: 0, fontSize: "1.1rem" }}
                  />
                  <span>لوحة التحكم</span>
                </button>

                {/* User Dropdown - Desktop */}
                <div
                  style={{
                    position: "relative",
                    display: window.innerWidth < 768 ? "none" : "block",
                  }}
                >
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.8rem",
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(10px)",
                      border: "2px solid rgba(255,255,255,0.2)",
                      color: COLORS.textWhite,
                      padding: "0.5rem 1rem",
                      borderRadius: "12px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(255,255,255,0.25)";
                      e.target.style.borderColor = "rgba(255,255,255,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(255,255,255,0.15)";
                      e.target.style.borderColor = "rgba(255,255,255,0.2)";
                    }}
                  >
                    <Icon
                      name="user circle"
                      style={{ margin: 0, fontSize: "1.8rem" }}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "0.1rem",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "700",
                          fontSize: "0.95rem",
                          lineHeight: 1.2,
                        }}
                      >
                        {user?.name}
                      </span>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          opacity: 0.9,
                          fontWeight: "500",
                        }}
                      >
                        {getRoleName(user?.role)}
                      </span>
                    </div>
                    <Icon
                      name={dropdownOpen ? "chevron up" : "chevron down"}
                      style={{ margin: 0, fontSize: "0.9rem" }}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <>
                      <div
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          position: "fixed",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          zIndex: 999,
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "calc(100% + 0.5rem)",
                          right: 0,
                          background: "white",
                          borderRadius: "12px",
                          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                          minWidth: "200px",
                          overflow: "hidden",
                          zIndex: 1000,
                          animation: "slideDown 0.3s ease",
                        }}
                      >
                        <button
                          onClick={navigateToDashboard}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.8rem",
                            padding: "1rem 1.2rem",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            fontSize: "0.95rem",
                            fontWeight: "600",
                            color: COLORS.textPrimary,
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = "#f8f9fa";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = "transparent";
                          }}
                        >
                          <Icon
                            name="user"
                            style={{ margin: 0, color: COLORS.primaryRed }}
                          />
                          الملف الشخصي
                        </button>

                        <div
                          style={{
                            height: "1px",
                            background: "#e9ecef",
                            margin: "0 0.8rem",
                          }}
                        />

                        <button
                          onClick={handleLogout}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.8rem",
                            padding: "1rem 1.2rem",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            fontSize: "0.95rem",
                            fontWeight: "600",
                            color: "#dc3545",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = "#fff5f5";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = "transparent";
                          }}
                        >
                          <Icon name="sign out" style={{ margin: 0 }} />
                          تسجيل الخروج
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  style={{
                    display: window.innerWidth >= 768 ? "none" : "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "42px",
                    height: "42px",
                    background: "rgba(255,255,255,0.15)",
                    border: "2px solid rgba(255,255,255,0.2)",
                    borderRadius: "10px",
                    color: COLORS.textWhite,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(255,255,255,0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(255,255,255,0.15)";
                  }}
                >
                  <Icon
                    name={mobileMenuOpen ? "close" : "bars"}
                    style={{ margin: 0, fontSize: "1.3rem" }}
                  />
                </button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        {isAuthenticated && mobileMenuOpen && (
          <div
            style={{
              paddingBottom: "1rem",
              animation: "slideDown 0.3s ease",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                borderRadius: "12px",
                padding: "0.5rem",
                backdropFilter: "blur(10px)",
              }}
            >
              <button
                onClick={navigateToDashboard}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.8rem",
                  padding: "1rem",
                  background: "transparent",
                  border: "none",
                  borderRadius: "8px",
                  color: COLORS.textWhite,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontSize: "1rem",
                  fontWeight: "600",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                }}
              >
                <Icon
                  name="dashboard"
                  style={{ margin: 0, fontSize: "1.2rem" }}
                />
                لوحة التحكم
              </button>

              <button
                onClick={navigateToDashboard}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.8rem",
                  padding: "1rem",
                  background: "transparent",
                  border: "none",
                  borderRadius: "8px",
                  color: COLORS.textWhite,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontSize: "1rem",
                  fontWeight: "600",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                }}
              >
                <Icon name="user" style={{ margin: 0, fontSize: "1.2rem" }} />
                الملف الشخصي
              </button>

              <div
                style={{
                  height: "1px",
                  background: "rgba(255,255,255,0.2)",
                  margin: "0.5rem 0.5rem",
                }}
              />

              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.8rem",
                  padding: "1rem",
                  background: "transparent",
                  border: "none",
                  borderRadius: "8px",
                  color: "#ffcccc",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontSize: "1rem",
                  fontWeight: "600",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                }}
              >
                <Icon
                  name="sign out"
                  style={{ margin: 0, fontSize: "1.2rem" }}
                />
                تسجيل الخروج
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
