const Table = ({ children }) => {
  return (
    <div className="table-container">
      <table className="table">
        {children}
      </table>
    </div>
  );
};

export default Table;