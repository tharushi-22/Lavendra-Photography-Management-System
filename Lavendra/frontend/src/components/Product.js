import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Rating from './Rating';
import { Store } from '../Store';
import axios from 'axios';
import Badge from 'react-bootstrap/Badge';

function Product(props) {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>

      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />

        <Card.Text>{product.price} LKR</Card.Text>

        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Out of stock
          </Button>
        ) : (
          <Button
            className="add-to-cart-btn"
            onClick={() => addToCartHandler(product)}
          >
            Add to Cart
          </Button>
        )}
      </Card.Body>

      <style jsx>{`
        .add-to-cart-btn {
          background-color: #6a1b9a;
          border-color: #6a1b9a;
          color: white;
        }
        
        .add-to-cart-btn:hover {
          background-color: #7b1fa2;
          border-color: #7b1fa2;
        }
      `}</style>
    </Card>
  );
}

export default Product;