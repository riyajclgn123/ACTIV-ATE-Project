import { Anchor, useMantineColorScheme} from "@mantine/core";
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

const useStyles = createStyles((theme) => {
   const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === "dark";
  return {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: isDark ? theme.white : theme.black,
        backgroundColor: "#008b84", 
        fontSize: "15px",
        width: "100%",  
        marginTop: "auto",
        fontWeight: "revert",
    
        [`@media (maxWidth: 1024px)`]: {
          fontSize: "18px", 
        },
    
        [`@media (maxWidth: 768px)`]: {
          fontSize: "16px", 
          padding: "12px",  
        },
    
        [`@media (maxWidth: 480px)`]: {
          fontSize: "14px",  
          padding: "10px",   
          textAlign: "center",
        },
    },
  };
});
