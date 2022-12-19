const cartButton = document.querySelector(".cart-btn");
const cartModal = document.querySelector(".cart");
const backDrop = document.querySelector(".backdrop");
const closeModal = document.querySelector(".confirm-cart-item");

const productsDOM = document.querySelector(".products-center");
const cartItems= document.querySelector(".cart-items");
const cartTotal=document.querySelector(".cart-total-price");
const cartContent=document.querySelector(".cart-content");


import { productsData } from "/products.js";

let cart = [];
// get products
class Products {
  getProducts() {
    return productsData;
  }
}

//display products
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((product) => {
      result += `<div class="product">
          <div class="image-container">
            <img src=${product.imageUrl} alt="" class="product-image" />
          </div>
          <div class="product-name">${product.title}</div>
          <div class="product-price-addbtn">
            <div class="product-price">
              <div class="price-title">Price</div>
              <div class="price-number">$ ${product.price}</div>
            </div>
            <button class="btn product-add-btn" data-id=${product.id}>
              <i class="fa-solid fa-cart-shopping fa-lg"></i>
            </button>
          </div>
        </div>`;
      productsDOM.innerHTML = result;
    });
  }

  getAddToCartBtn() {
    const addToCartBtn = document.querySelectorAll(".product-add-btn");
    const addButtons = [...addToCartBtn];
    const btnIcon = document.querySelectorAll(".product-add-btn i");
    addButtons.forEach((btn) => {
      const id = btn.dataset.id;
      const isInCart = cart.find((p) => p.id == id);
      if (isInCart) {
        btnIcon[id - 1].classList.toggle("fa-cart-arrow-down");
        addButtons[id - 1].classList.toggle("btn-selected");
        btn.disabled = true;
      }

      btn.addEventListener("click", () => {
        btnIcon[id - 1].classList.toggle("fa-cart-arrow-down");
        addButtons[id - 1].classList.toggle("btn-selected");
        btn.disabled = true;
        
       //get product from product
        const addedProduct={...Storage.getProduct(id), quantity: 1};
        //add products to cart
        cart= [...cart,addedProduct];
        //save cart in local storage
        Storage.saveCart(cart);
        //set cart values
        this.setCartValue(cart);
        //display cart item
        this.addCartItem(addedProduct);
      });
    });
  }
  setCartValue(cart){
    let cartItemsCount=0;
    const totalPrice= cart.reduce((acc,curr)=> {
      cartItemsCount += curr.quantity;
      return curr.quantity * curr.price + acc;}, 0);
      cartTotal.innerText= `Total price: $${parseFloat(totalPrice).toFixed(2)}`;
      cartItems.innerText= cartItemsCount;
  
    }

  addCartItem(cart){
    const div= document.createElement("div");
    div.classList.add('cart-item');
    div.innerHTML = ` <div>
              <img src=${cart.imageUrl} alt="" class="cart-item-img" />
            </div>
            <div class="cart-item-description">
              <h4>${cart.title}</h4>
              <h5 class="cart-item-price">$${cart.price}</h5>
            </div>
            <div class="cart-item-controls">
              <i class="fa-solid fa-circle-minus fa-lg"></i>
              <p>${cart.quantity}</p>
              <i class="fa-solid fa-circle-plus fa-lg"></i>
              <i class="fas fa-trash-alt fa-lg"></i>
            </div>`;
    cartContent.appendChild(div);
    }
  populateCart(cart){
    cart.forEach((item)=>this.addCartItem(item));
  }
  setupApp(){
    cart= Storage.getCart();
    this.setCartValue(cart);
    this.populateCart(cart);
  }
  }



// Storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    const _products = JSON.parse(localStorage.getItem("products"));
    return _products.find((p)=> p.id==id );
  }
  static saveCart(cart){
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart(){
    return localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const ui = new UI();
  const productsData = products.getProducts();
  ui.setupApp()
  ui.displayProducts(productsData);
  ui.getAddToCartBtn();

  Storage.saveProducts(productsData);
});
function showModalFunction() {
  backDrop.style.display = "block";
  cartModal.style.opacity = "1";
  cartModal.style.top = "20%";
}

function closeModalFunction() {
  backDrop.style.display = "none";
  cartModal.style.opacity = "0";
  cartModal.style.top = "-100%";
}

cartButton.addEventListener("click", showModalFunction);
backDrop.addEventListener("click", closeModalFunction);
closeModal.addEventListener("click", closeModalFunction);
