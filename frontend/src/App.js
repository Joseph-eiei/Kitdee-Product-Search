import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const response = await fetch("http://localhost:3001/products");
      const data = await response.json();
      setAllProducts(data);
    } catch (error) {
      console.error("Error fetching all products:", error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setHasSearched(true);
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3001/search?query=${encodeURIComponent(searchTerm)}`,
      );
      const data = await response.json();
      setSearchResults(data);
      setShowAllProducts(false);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setHasSearched(false);
  };

  const toggleShowAllProducts = () => {
    setShowAllProducts(!showAllProducts);
    setHasSearched(false);
    if (!showAllProducts) {
      fetchAllProducts();
    }
  };

  const toggleAddProductForm = () => {
    setShowAddProductForm(!showAddProductForm);
  };

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/products/${productId}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        // If deletion is successful, update the product list
        setAllProducts(
          allProducts.filter((product) => product.id !== productId),
        );
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = () => {
    fetchAllProducts();
    setEditingProduct(null);
  };

  const renderProductList = (products) => (
    <ul className="product-list">
      {products.map((product, index) => (
        <li key={product.id} className="product-item">
          <span className="product-number">{index + 1}.</span>
          <img
            src={`http://localhost:3001${product.imageUrl}`}
            alt={product.name}
            className="product-image"
          />
          <div className="product-details">
            <span className="product-name">{product.name}</span>
            <span className="product-brand">{product.brand}</span>
            <span className="product-price">฿{product.price.toFixed(2)}</span>
            {product.remark && (
              <span className="product-remark">หมายเหตุ: {product.remark}</span>
            )}
          </div>
          <button className="edit-button" onClick={() => handleEdit(product)}>
            Edit
          </button>
          <button
            className="delete-button"
            onClick={() => handleDelete(product.id)}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <Router>
      <div className="App">
        <h1>ค้นหาราคาสินค้า</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ป้อนชื่อสินค้า"
          />
          <button type="submit">ค้นหา</button>
          <button type="button" onClick={handleClearSearch}>
            ล้างการค้นหา
          </button>
        </form>
        <div className="button-group">
          <button className="showAllButton" onClick={toggleShowAllProducts}>
            {showAllProducts
              ? "ซ่อนสินค้าทั้งหมด"
              : `แสดงสินค้าทั้งหมด (${allProducts.length})`}
          </button>
          <button onClick={toggleAddProductForm}>
            {showAddProductForm ? "ยกเลิก" : "เพิ่มสินค้าใหม่"}
          </button>
        </div>
        {showAddProductForm && (
          <div className="add-product-container">
            <AddProduct
              onAddProduct={() => {
                fetchAllProducts();
                setShowAddProductForm(false);
              }}
            />
          </div>
        )}
        {editingProduct && (
          <div className="edit-product-container">
            <EditProduct
              product={editingProduct}
              onUpdateProduct={handleUpdateProduct}
              onCancel={() => setEditingProduct(null)}
            />
          </div>
        )}
        {showAllProducts ? (
          <div className="results">
            <h2>สินค้าทั้งหมด:</h2>
            {renderProductList(allProducts)}
          </div>
        ) : hasSearched ? (
          searchResults.length > 0 ? (
            <div className="results">
              <h2>ผลการค้นหา:</h2>
              {renderProductList(searchResults)}
            </div>
          ) : (
            <p className="no-results">ไม่พบสินค้า</p>
          )
        ) : null}
      </div>
    </Router>
  );
}

export default App;
