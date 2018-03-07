const App = (_=> {
  class Product {
    constructor(id, productName, productPrice) {
      this.id = id;
      this.productName = productName;
      this.productPrice = productPrice;
    }
  }

  const data = {
    products: Storage.getProductsFromLocalStorage(),
    currentProduct: null,
    totalPrice: 0
  };

  function addProduct() {
    const prodName = vars.productName.value;
    const prodPrice = vars.productPrice.value;

    if(prodName !== '' || prodPrice !== '') {
      const newProduct = createProduct(prodName, prodPrice);

      data.totalPrice += parseFloat(newProduct.productPrice);
      showProduct(newProduct);
      showSumPrice(data.totalPrice);

      vars.productName.value = '';
      vars.productPrice.value = '';

      products = new Storage(data.products);
      products.addProductToLocalStorage();
    }
  }

  function createProduct(prodName, prodPrice) {
    let id;

    if(data.products.length > 0) {
      id = data.products[data.products.length - 1].id + 1;
    } else {
      id = 1;
    }

    newProduct = new Product(id, prodName, prodPrice);
    data.products.push(newProduct);
    return newProduct;
  }

  function showProduct(newProduct) {
    const listProduct = document.createElement('li');

    vars.containerDisplayProducts.classList.add('visible', 'animated', 'rubberBand');
    listProduct.classList.add('list-product');
    listProduct.setAttribute('data-id', `${newProduct.id}`);
    listProduct.innerHTML = `
      <span class="list-product-name">${newProduct.productName}: </span>
      <span class="list-product-price">${newProduct.productPrice.replace('.', ',')} zł</span>
      <button class="product-modify-btn"><i class="fas fa-cog"></i></button>
    `;

    vars.containerListProducts.appendChild(listProduct);
  }
  
  function showSumPrice(totalPrice) {
    vars.summaryPriceContainer.classList.add('visible');
    vars.summaryPrice.textContent = `${totalPrice.toFixed(2).toString().replace('.', ',')} zł`;
  }

  function removeProduct(e) {
    console.log(e.target);
  }

  function removeProductByID(e) {
    let id;
    if(e.target.parentNode.parentNode.classList.contains('list-product')) {
      id = e.target.parentNode.parentNode.dataset.id;
    } else if(e.target.parentNode.parentNode.parentNode.classList.contains('list-product')) {
      id = e.target.parentNode.parentNode.parentNode.dataset.id;
    }
    
    console.log(Number(id));

    data.products.filter(product => {
      if(product.id === id) {
        return product;
      }
    });
  }

  function showButtons(e) {
    if(e.target.parentNode.classList.contains('product-modify-btn') || 
      e.target.parentNode.parentNode.classList.contains('product-modify-btn')) {
      vars.buttons.classList.toggle('show-buttons');
    }
    removeProductByID(e);
  }
  
  // function modifyProduct(e) {
  //   animCogStart(e);
  //   vars.buttons.classList.add('show-buttons', 'animated', 'rubberBand');
  // }
  
  function displayProductsFromLocalStorage(products) {
    products.forEach(product => {
      showProduct(product);
      data.totalPrice += parseFloat(product.productPrice); 
    });
    showSumPrice(parseFloat(data.totalPrice.toFixed(2)));
  }

  function animCogStart(e) {
    if(e.target.classList.contains('product-modify-btn')) {
      e.target.firstChild.classList.add('fa-spin');
    }

    if(e.target.parentNode.classList.contains('product-modify-btn')) {
      e.target.parentNode.firstChild.classList.add('fa-spin');
    }

    if(e.target.parentNode.parentNode.classList.contains('product-modify-btn')) {
      e.target.parentNode.parentNode.firstChild.classList.add('fa-spin');
    }
  }

  function init(_vars) {
    vars = _vars;

    displayProductsFromLocalStorage(data.products);
    vars.addBtn.addEventListener('click', addProduct);
    vars.removeBtn.addEventListener('click', removeProduct);
    vars.containerDisplayProducts.addEventListener('click', showButtons);
  }

  return {
    init
  };
})();