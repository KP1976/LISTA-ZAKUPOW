const App = (_=> {
  class Product {
    constructor(id, productName, productPrice) {
      this.id = id;
      this.productName = productName;
      this.productPrice = productPrice;
    }
  }

  const data = {
    products: [],
    currentProduct: null,
    totalPrice: 0
  };

  function productAddSubmit() {
    const prodName = vars.productName.value;
    const prodPrice = vars.productPrice.value;

    if(prodName !== '' || vars.productPrice.value !== '') {
      const newProduct = createProduct(prodName, prodPrice);

      data.totalPrice += parseFloat(newProduct.productPrice);
      showSumPrice(data.totalPrice);
      showProduct(newProduct);

      vars.productName.value = '';
      vars.productPrice.value = '';

    }
    console.log(data.products);
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

  function modifyProduct(e) {
    animCogStart(e);
    vars.buttons.classList.add('show-buttons', 'animated', 'rubberBand');
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

  function animCogStop(e) {
    if(e.target.parentNode.classList.contains('product-modify-btn')) {
      e.target.parentNode.firstChild.classList.remove('fa-spin');
    }
  }
 
  function init(_vars) {
    vars = _vars;

    vars.addBtn.addEventListener('click', productAddSubmit);
    vars.containerDisplayProducts.addEventListener('click', modifyProduct);
    // vars.wholeContainer.addEventListener('click', animCogStop);
  }

  return {
    init
  };
})();