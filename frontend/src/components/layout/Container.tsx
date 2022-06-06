import useTheme from "../theme/hooks/useTheme";
import Footer from "./Footer";
import Header from "./Header";

type ContainerProps = {
  children: React.ReactNode;
};

const Container: React.FC<ContainerProps> = ({ children }) => {
  const { themed } = useTheme();
  return (
    <div className={themed("themer")} >
      <div className="container">
        <Header />
        {children}
        <Footer />
      </div>
    </div>
  );
};

export default Container;
