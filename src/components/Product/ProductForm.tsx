// components/Product/ProductForm.tsx
"use client";

import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";

interface ProductFormProps {
  onSuccess?: () => void;
}

const ProductForm = ({ onSuccess }: ProductFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    inventory: "",
    featured: false,
    imageUrl: "", // We'll start with a single image for simplicity
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate form
      if (!formData.name || !formData.description || !formData.price) {
        throw new Error("Please fill out all required fields");
      }

      if (formData.imageUrl && formData.imageUrl.length > 1800) {
        throw new Error("Image URL is too long. Please use a shorter URL.");
      }

      // Create product object
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        inventory: parseInt(formData.inventory) || 10,
        featured: formData.featured,
        images: [formData.imageUrl],
        createdAt: new Date(),
      };

      // Add to Firestore
      await addDoc(collection(db, "products"), productData);

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        inventory: "",
        featured: false,
        imageUrl: "",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error adding product:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormInput
        label="Product Name"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Price"
          id="price"
          name="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Inventory"
          id="inventory"
          name="inventory"
          type="number"
          value={formData.inventory}
          onChange={handleChange}
        />
      </div>

      <FormInput
        label="Category"
        id="category"
        name="category"
        value={formData.category}
        onChange={handleChange}
      />

      <FormInput
        label="Image URL"
        id="imageUrl"
        name="imageUrl"
        value={formData.imageUrl}
        onChange={handleChange}
        placeholder="https://example.com/image.jpg"
      />

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="featured"
          name="featured"
          checked={formData.featured}
          onChange={handleChange}
          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <label htmlFor="featured" className="text-sm font-medium text-gray-700">
          Featured Product
        </label>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Button type="submit" isLoading={isLoading}>
        Add Product
      </Button>
    </form>
  );
};

export default ProductForm;
