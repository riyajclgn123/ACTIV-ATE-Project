// src/styles/authStyles.ts
import { createStyles } from "@mantine/emotion";

export const useStyles = createStyles(() => ({
  videoContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
    overflow: "hidden",
  },
  videoBackground: {
    objectFit: "cover",
    width: "100%",
    height: "100%",
  },
  generalErrors: {
    marginBottom: "8px",
  },
  loginButton: {
    marginTop: "8px",
  },
  formField: {
    marginBottom: "8px",
  },
  mainContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    width: "100%",
    padding: "20px",
  },
  splitContainer: {
    display: "flex",
    width: "100%",
    maxWidth: "1200px",
    gap: "40px",
  },
  titleSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    color: "white",
    padding: "40px",
  },
  mainTitle: {
    fontSize: "3rem",
    fontWeight: 500,
    lineHeight: 1.2,
    marginBottom: "20px",
    fontFamily: "Montserrat, sans-serif",
  },
  subTitle: {
    fontSize: "1.5rem",
    opacity: 0.9,
    fontFamily: "Montserrat, sans-serif",
  },
  formSection: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container1: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    color: "white",
    width: "100%",
    maxWidth: "500px",
    padding: "40px",
    backgroundColor: "rgba(17, 25, 40, 0.78)", // translucent dark background
    backdropFilter: "blur(16px) saturate(200%)",
    WebkitBackdropFilter: "blur(16px) saturate(200%)", // for Safari
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.125)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
  },
}));
