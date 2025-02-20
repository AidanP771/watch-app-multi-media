import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity } = useCart();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="pt-24 px-6 min-h-screen bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-col items-center gap-6">
            <ShoppingBag className="w-16 h-16 text-gray-light" />
            <h1 className="text-3xl font-serif text-white">Your Cart is Empty</h1>
            <p className="text-gray-light">Discover our collection of luxury timepieces.</p>
            <button
              onClick={() => navigate('/collections')}
              className="bg-secondary hover:bg-secondary-light text-primary px-8 py-3 rounded font-semibold transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 px-6 pb-32 min-h-screen bg-primary">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-serif text-white mb-8">Shopping Cart</h1>

        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.id} className="bg-primary-light rounded-lg p-6">
              <div className="flex items-center gap-6">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-serif text-white">{item.name}</h3>
                  <p className="text-secondary">${item.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="text-gray-light hover:text-white transition"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="text-gray-light hover:text-white transition"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-light hover:text-secondary transition p-2 rounded-full hover:bg-secondary/10"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-right min-w-[100px]">
                  <p className="text-white font-semibold">
                    ${(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-primary-light rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-white">Total</span>
            <span className="text-2xl font-serif text-secondary">
              ${total.toLocaleString()}
            </span>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/collections')}
              className="flex-1 border border-gray-dark hover:border-secondary text-white px-6 py-3 rounded font-semibold transition"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate('/checkout')}
              className="flex-1 bg-secondary hover:bg-secondary-light text-primary px-6 py-3 rounded font-semibold transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;