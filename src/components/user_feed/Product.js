import React from "react";

class Product extends React.Component {
  handleAddToCart = () => {
    this.props.button({
      id: this.props.id,
      name: this.props.name,
      price: this.props.price,
      imgURL: this.props.imgURL,
    });
  };

  render() {
    return (
      // returns a card of a product with a button that adds the item to the shopping cart
      <div className="product-card">
        <div className="product-image"></div>
        <img src={this.props.imgURL}></img>
        <div className="product-info">
          <h3>{this.props.name}</h3>
          <p>{this.props.price}</p>
          <button
            class="add-to-cart"
            type="button"
            onClick={this.handleAddToCart}
          >
            Add to cart
          </button>
        </div>
      </div>
    );
  }
}

export default Product;
