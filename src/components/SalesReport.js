import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SalesReport.css"; // Import the CSS file

const SalesReport = () => {
  const [period, setPeriod] = useState("weekly");
  const [salesReport, setSalesReport] = useState(null);

  useEffect(() => {
    const fetchSalesReport = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:3001/sales-report/${period}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        setSalesReport(response.data);
      } catch (error) {
        console.error("Error fetching sales report:", error);
      }
    };

    fetchSalesReport();
  }, [period]);

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  const truncateDecimal = (number) => {
    return number.toFixed(2); // Truncate to two decimal places
  };

  return (
    <div className="sales-report-container">
      <div>
        <label>
          Period:
          <select value={period} onChange={handlePeriodChange}>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="annually">Annually</option>
          </select>
        </label>
      </div>
      {salesReport ? (
        <div>
          <h4>{`Sales Report (${period})`}</h4>
          <p>{`Start Date: ${new Date(salesReport.startDate).toLocaleDateString()}`}</p>
          <p>{`End Date: ${new Date(salesReport.endDate).toLocaleDateString()}`}</p>
          <table className="sales-report-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Product Type</th>
                <th>Total Sales</th>
                <th>Total Quantity</th>
              </tr>
            </thead>
            <tbody>
              {salesReport.salesData.map((item) => (
                <tr key={item._id}>
                  <td>{item.productName}</td>
                  <td>{item.productType}</td>
                  <td>{truncateDecimal(item.totalSales)}</td> 
                  <td>{item.totalQuantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default SalesReport;
