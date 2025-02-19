export default function Cart() {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  return (
    <div className="bg-finesse-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-playfair text-4xl font-bold mb-12">Shopping Cart</h1>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-8">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-finesse-gray-900 p-6 rounded-sm flex space-x-6">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-24 h-24 object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-playfair text-xl font-semibold mb-2">{item.name}</h3>
                        <p className="text-finesse-gold font-playfair">
                          ${item.price.toLocaleString()}
                        </p>
                      </div>
                      <button className="text-finesse-gray-400 hover:text-white">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="mt-4 flex items-center space-x-4">
                      <label className="font-raleway text-sm">Quantity:</label>
                      <select 
                        value={item.quantity}
                        className="bg-finesse-gray-800 px-3 py-1 rounded-sm font-raleway text-sm focus:outline-none focus:ring-2 focus:ring-finesse-gold"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-finesse-gray-900 p-6 rounded-sm h-fit">
              <h2 className="font-playfair text-2xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4 font-raleway">
                <div className="flex justify-between">
                  <span className="text-finesse-gray-400">Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-finesse-gray-400">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-finesse-gray-800 pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-finesse-gold">${total.toLocaleString()}</span>
                  </div>
                </div>
                <button className="w-full bg-finesse-gold text-finesse-black px-6 py-3 rounded-sm font-raleway font-medium hover:bg-finesse-gold/90 transition-colors flex items-center justify-center space-x-2 mt-6">
                  <span>Proceed to Checkout</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="font-raleway text-xl text-finesse-gray-400 mb-6">Your cart is empty</p>
            <a 
              href="/collections"
              className="bg-finesse-gold text-finesse-black px-8 py-3 rounded-sm font-raleway font-medium hover:bg-finesse-gold/90 transition-colors inline-flex items-center space-x-2"
            >
              <span>Browse Collections</span>
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}