import React, { useState, useEffect } from "react";
import "./EditProduct.css";

function EditProduct({ product, onUpdateProduct, onCancel }) {
  const [updatedProduct, setUpdatedProduct] = useState(product);
  const [productImage, setProductImage] = useState(null);

  useEffect(() => {
    setUpdatedProduct(product);
  }, [product]);

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", updatedProduct.name);
    formData.append("price", updatedProduct.price);
    formData.append("brand", updatedProduct.brand);
    formData.append("remark", updatedProduct.remark);
    if (productImage) {
      formData.append("image", productImage);
    }

    try {
      const response = await fetch(
        `http://localhost:3001/products/${product.id}`,
        {
          method: "PUT",
          body: formData,
        },
      );
      if (response.ok) {
        await response.json();
        onUpdateProduct();
      } else {
        console.error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProductImage(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleUpdateProduct} className="edit-product-form">
      <h2>แก้ไขสินค้า</h2>
      <input
        type="text"
        value={updatedProduct.name}
        onChange={(e) =>
          setUpdatedProduct({ ...updatedProduct, name: e.target.value })
        }
        placeholder="ชื่อสินค้า"
        required
      />
      <input
        type="number"
        value={updatedProduct.price}
        onChange={(e) =>
          setUpdatedProduct({ ...updatedProduct, price: e.target.value })
        }
        placeholder="ราคา"
        step="0.01"
        required
      />
      <input
        type="text"
        value={updatedProduct.brand}
        onChange={(e) =>
          setUpdatedProduct({ ...updatedProduct, brand: e.target.value })
        }
        placeholder="แบรนด์"
      />
      <textarea
        value={updatedProduct.remark}
        onChange={(e) =>
          setUpdatedProduct({ ...updatedProduct, remark: e.target.value })
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
        อัปเดตสินค้า
      </button>
      <button className="cancel-button" type="button" onClick={onCancel}>
        ยกเลิก
      </button>
    </form>
  );
}

export default EditProduct;
