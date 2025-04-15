import { Anchor, Container, Group } from "@mantine/core";
import Logo from "../../assets/Activ-Ate.png";
import { createStyles } from "@mantine/emotion";

const links = [
  { link: "#", label: "Contact" },
  { link: "#", label: "Privacy" },
  { link: "#", label: "Blog" },
  { link: "#", label: "Careers" },
];

export function FooterSimple() {
  const { classes } = useStyles();
  const items = links.map((link) => (
    <Anchor<"a">
      c="dimmed"
      key={link.label}
      href={link.link}
      onClick={(event) => event.preventDefault()}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <footer className={classes.container}>
      <p>&copy; {new Date().getFullYear()} ACTIV-ATE || All rights reserved.</p>
    </footer>
  );
}

const useStyles = createStyles(() => {
  return {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "purple", // Dark theme background
        fontSize: "15px",
        width: "100%",  // Ensures the footer takes full width of the screen
        marginTop: "10px",
    
        [`@media (maxWidth: 1024px)`]: {
          fontSize: "18px",  // Slightly reduce font size for medium screens (laptops/tablets)
        },
    
        [`@media (maxWidth: 768px)`]: {
          fontSize: "16px",  // Reduce font size further for tablets
          padding: "12px",   // Reduce padding for smaller screens
        },
    
        [`@media (maxWidth: 480px)`]: {
          fontSize: "14px",  // Even smaller font size for mobile
          padding: "10px",   // Less padding on mobile for space efficiency
          textAlign: "center",  // Ensure text is centered on small screens
        },
    },
  };
});
