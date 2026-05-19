import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import API from '../services/api';

const CategoryPage = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get(`/products?category=${id}`);
        setProducts(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, [id]);

  return (
    <div className="space-y-8">
      <div className="text-center py-8 luxury-gradient border border-pink-100 rounded-xl">
        <h2 className="text-3xl font-serif text-stone-900 font-bold">Category Collection</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map(prod => (
          <ProductCard key={prod._id} product={prod} />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
