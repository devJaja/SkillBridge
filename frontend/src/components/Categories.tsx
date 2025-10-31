import React from "react";

const categories: string[] = [
  "Developers",
  "Engineers",
  "Carpenters",
  "Tailors",
  "Doctors",
  "Teachers"
];

const Categories: React.FC = () => {
  return (
    <section id="categories" className="py-20 px-6 bg-white">
      <h2 className="text-3xl font-semibold text-center mb-12">Services You Can Find</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {categories.map((s, i) => (
          <div
            key={i}
            className="bg-gray-100 rounded-2xl shadow p-6 text-center font-medium hover:bg-blue-50 transition"
          >
            {s}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
