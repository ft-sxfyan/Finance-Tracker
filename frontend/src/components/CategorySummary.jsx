function CategorySummary({ categories = {} }) {
  return (
    <section>
      <h3>Category Summary</h3>
      <ul>
        {Object.keys(categories).length === 0 ? (
          <li>No data available</li>
        ) : (
          Object.entries(categories).map(([cat, amt]) => (
            <li key={cat}>{cat}: Rs. {Number(amt).toLocaleString()}</li>
          ))
        )}
      </ul>
    </section>
  );
}

export default CategorySummary;
