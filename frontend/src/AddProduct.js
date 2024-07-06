import React, { useState } from "react";
import "./AddProduct.css";

function AddProduct({ onAddProduct }) {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    brand: "",
    remark: "",
  });
  const [productImage, setProductImage] = useState(null);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("brand", newProduct.brand);
    formData.append("remark", newProduct.remark);
    if (productImage) {
      formData.append("image", productImage);
    }

    try {
      const response = await fetch("http://localhost:3001/add-product", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        await response.json();
        setNewProduct({ name: "", price: "", brand: "", remark: "" });
        setProductImage(null);
        onAddProduct();
      } else {
        console.error("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProductImage(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleAddProduct} className="add-product-form">
      <h2>เพิ่มสินค้าใหม่</h2>
      <input
        type="text"
        value={newProduct.name}
        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        placeholder="ชื่อสินค้า"
        required
      />
      <input
        type="number"
        value={newProduct.price}
        onChange={(e) =>
          setNewProduct({ ...newProduct, price: e.target.value })
        }
        placeholder="ราคา"
        step="0.01"
        required
      />
      <input
        type="text"
        value={newProduct.brand}
        onChange={(e) =>
          setNewProduct({ ...newProduct, brand: e.target.value })
        }
        placeholder="แบรนด์"
      />
      <textarea
        value={newProduct.remark}
        onChange={(e) =>
          setNewProduct({ ...newProduct, remark: e.target.value })
        }
        placeholder="หมายเหตุ"
      />
      <div className="image-upload">
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          id="image-upload"
        />
        <label htmlFor="image-upload">
          {productImage ? productImage.name : "เลือกหรือลากไฟล์ภาพมาวางที่นี่"}
        </label>
      </div>
      <button className="submit-button" type="submit">
        เพิ่มสินค้า
      </button>
    </form>
  );
}

export default AddProduct;
