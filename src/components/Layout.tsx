import { Footer } from "./Footer";
import { Header } from "./Header";

export const Theme = ({ children }: any) => {
  return (
    <div className="layout d-flex justify-content-center flex-column w-50 m-auto">
      <Header />
      <main className="container p-5">{children}</main>
      <Footer />
    </div>
  );
};
