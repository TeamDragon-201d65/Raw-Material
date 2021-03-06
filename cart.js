'use strict';

/*********************** ALL CART RELATED CODE *************************************************/

// Add item to cart (DONE)
/*Fetch cart items from local storage (DONE)
      - pull local storage items and add each item to cart
      - JSON Parse to take items out of local storage
      - GetItems
*/


// Will need to write method for rendering product in cart (DONE)
// Remove Items from Cart

/*Add last table row to Cart that has grandtotal (DONE)
    -will have to do some math here for totals row (keep in mind the cookies project, price * quantity = subtotal)
    - Add all subtotals to variable
    - Do all math in the lop where price and quantity exist*/





// Global vars
// created global var for cart so when eventhandler is used to remove items, it can remove them
var theCart;


// cart constructor
function Cart() {
  // an array of cartitem instances
  this.cartItems = [];
  this.total = 0; // the loop adds subtotals to grandtotal
}


//cartitem constructor
// the instance of the New cart item will be included in local storage section (we can save props or instance in LS)

// Used the push method to add new item into cart
var CartItem = function (name, src, price, quantity) {
  this.name = name;
  this.quantity = quantity;
  this.price = price;
  this.src = src;
};


// Created a new cart item and then push it into CartItems prop
// the three params are what is needed to add item to cart
Cart.prototype.addItem = function(name, src,price, quantity) {
  console.log('items are added to cart');
  var item = new CartItem(name, src,price, quantity);
  this.cartItems.push(item);
};


Cart.prototype.removeItem = function(name) {
  for (var i = 0; i < this.cartItems.length; i++) {
    if (this.cartItems[i].name === name) {
      this.cartItems.splice(i, 1);
      break;
    }
  }
};


// Method for rendering product in cart
Cart.prototype.renderCart = function() {
  var target = document.getElementById('cartItemList');
  //every time we call renderCart() old items will be removed
  target.innerHTML = '';
  // for loop here to cycle through this.cartitems
  for(var i = 0; i <this.cartItems.length; i++) {
    // this will calculate subtotal of items in cart and produce a grandtotal
    // at the end of the for loop subtotal is added in to the cartItems row so it will display with product
    // we will see image, name, price, quantity, subototal and then total at the bottom
    var subtotal = this.cartItems[i].quantity * this.cartItems[i].price;
    this.total = this.total + subtotal;
    var cartItemHome = document.createElement('tr');
    var displayedImage = document.createElement('td');
    var itemImage = document.createElement('img');
    itemImage.src = this.cartItems[i].src;
    itemImage.alt = this.cartItems[i].name;
    // added class to itemImage so we can style images on cart.html
    itemImage.setAttribute('class', 'cartImage');
    displayedImage.appendChild(itemImage);
    cartItemHome.appendChild(displayedImage);
    var displayedName = document.createElement('td');
    displayedName.textContent = this.cartItems[i].name;
    cartItemHome.appendChild(displayedName);
    var displayedPrice = document.createElement('td');
    displayedPrice.textContent = '$' + this.cartItems[i].price;
    cartItemHome.appendChild(displayedPrice);
    var displayedQuantity = document.createElement('td');
    displayedQuantity.textContent = 'Qty: ' + this.cartItems[i].quantity;
    cartItemHome.appendChild(displayedQuantity);
    var subtotalsRowData = document.createElement('td');
    subtotalsRowData.textContent = toDollars(subtotal);
    cartItemHome.appendChild(subtotalsRowData);
    var removeBtnCell = document.createElement('td');
    var removeBtnInput = document.createElement('input');
    removeBtnInput.value = 'Remove';
    removeBtnInput.type = 'submit';
    removeBtnCell.appendChild(removeBtnInput);
    cartItemHome.appendChild(removeBtnCell);
    removeBtnInput.addEventListener('click', removeProductFromCart);
    target.appendChild(cartItemHome);
  }

  var totalRow = document.createElement('tr');
  var totalRowData = document.createElement('td');
  totalRowData.textContent = 'Total ' + toDollars(this.total);
  totalRowData.setAttribute('class','total');
  totalRow.appendChild(totalRowData);
  target.appendChild(totalRow);
};


function initializeCart() {
  // to initialize the cart, added instance of object
  theCart = new Cart();
  // used code from Busmall as template to loop through items from LS
  var storedProducts = localStorage.getItem('rawMaterials');
  if(storedProducts !== null) {
    var parsedProducts = JSON.parse(storedProducts); // extracted properties of object so we can send to constructor
    for(var i = 0; i < parsedProducts.length; i++) {
      var name = parsedProducts[i].name;
      var quantity = parsedProducts[i].quantity;
      var src = parsedProducts[i].src;
      var price = parsedProducts[i].price;
      theCart.addItem(name, src, price, quantity);
    }
    //console.log(parsedProducts);
    console.log(theCart);
    //called renderCart() function here because we need to render cart after we intialize
    // if we remove item from cart, we will have to rerender it
    theCart.renderCart();
  }
}
initializeCart();

// copied from app to prevent adding app.js to html to prevent issues for me to use in remove product from cart function
function saveToLocalStorage(productDataArray) {
  var rawMaterialArrayString = JSON.stringify(productDataArray);
  localStorage.setItem('rawMaterials', rawMaterialArrayString);
  console.log(productDataArray.length + ' items in Cart'); // the number of items in the cart is here
}


function toDollars(amount) {
  var string = '$' + amount + '.00';
  console.log(string);
  return string;
}


function removeProductFromCart(event) {
  var removeBtnTarget = event.target;
  var parentTR = removeBtnTarget.closest('tr');
  var name = parentTR.children[1].textContent;
  theCart.removeItem(name);
  saveToLocalStorage(theCart.cartItems);
  theCart.renderCart();
}



