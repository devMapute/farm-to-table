import React from "react";

class ShoppingCart extends React.Component {
  totalItems = () => {
    // summation of item quantities
    const cartItems = this.props.cartItems;
    const length = cartItems.length;

    if (length === 0) {
      return 0;
    }

    let total = 0;
    for (let i = 0; i < length; i++) {
      total = total + cartItems[i].props.quantity;
    }

    return total;
  };

  render() {
    return (
      <div className="container" id="shoppingCart">
        <h1>Shopping Cart</h1>
        <h2>Total: {this.totalItems()}</h2>
        <div className="cart-items">
          {this.props.cartItems.map((cartItem, index) => (
            <div key={index}>{cartItem}</div>
          ))}
        </div>
      </div>
    );
  }
}

export default ShoppingCart;
