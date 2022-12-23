import { Footer } from "./Footer";
import { Header } from "./Header";

export const Theme = ({ children, mode }: any) => {
  return (
    <div
      className={`layout d-flex justify-content-center flex-column w-50 m-auto ${
        mode === "dark" ? "dark" : "light"
      }`}
    >
      <Header />
      <main
        className={`container p-3 ${
          mode === "dark" ? "bg-dark text-light" : "bg-light text-dark"
        }`}
      >
        {children}
      </main>
      <Footer mode={mode} />
    </div>
  );
};
