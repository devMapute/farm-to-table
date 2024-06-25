import React from "react";

class CartItem extends React.Component {
  render() {
    return (
      // returns a card of a product with a button that deletes the item in the shopping cart
      <div className="cart-card">
        <div className="cart-image">
          <img src={this.props.imgURL}></img>
        </div>
        <div className="cart-item">
          <div className="cart-item-name">
            <h3>{this.props.name}</h3>
          </div>
          <div className="cart-item-price">
            <p>{this.props.price}</p>
          </div>
          <div className="cart-item-quantity">{this.props.quantity}</div>
          <button
            class="add-to-cart"
            type="button"
            onClick={() => this.props.onDelete(this.props.id)}
          >
            X
          </button>
        </div>
      </div>
    );
  }
}

export default CartItem;
