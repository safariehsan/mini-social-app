export const Footer = ({ mode }: any) => {
  return (
    <footer
      className={`p-3 ${
        mode === "dark" ? "bg-dark text-light" : "bg-light text-dark"
      }`}
    >
      <div className="container">
        <p className="py-2 text-center my-0">
          Copyright | All rights reserved | 2023, 1401
        </p>
      </div>
    </footer>
  );
};
