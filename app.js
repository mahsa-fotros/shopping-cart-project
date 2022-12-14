const cartButton = document.querySelector(".cart-btn");
const cartModal = document.querySelector(".cart");
const backDrop = document.querySelector(".backdrop");
const closeModal = document.querySelector(".confirm-cart-item");

const productsDOM = document.querySelector(".products-center");



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
    addButtons.forEach((btn) => {
      const id = btn.dataset.id;
      const isInCart = cart.find((p) => p.id === id);
      if (isInCart) {
        btn.disabled = true;
      }

      btn.addEventListener("click", (event) => {
        const btnIcon = document.querySelectorAll(".product-add-btn i");
        const btnIconArray = [...btnIcon];
        btnIcon[id - 1].classList.toggle("fa-cart-arrow-down");
        addButtons[id - 1].classList.toggle("btn-selected");
        btn.disabled=true;
       //get product from products
        const addedProducts={...Storage.getProduct(id), quantity: 1};
        //add products to cart
        cart= [...cart,addedProducts];
        //save cart in local storage
        Storage.saveCart(cart);

        console.log(event.target.dataset.id);
      });
    });
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
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const ui = new UI();
  const productsData = products.getProducts();
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
