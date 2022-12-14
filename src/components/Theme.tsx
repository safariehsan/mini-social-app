import { Footer } from "./Footer";
import { Header } from "./Header";

export const Theme = ({ children }: any) => {
  return (
    <>
      <Header />
      <div className="container">{children}</div>
      <Footer />
    </>
  );
};
