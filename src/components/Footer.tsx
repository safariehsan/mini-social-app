export const Footer = ({ mode }: any) => {
  return (
    <footer
      className={`p-1 shadow ${
        mode === "dark" ? "text-bg-dark" : "text-bg-light"
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
