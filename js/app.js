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
    vars.summaryPrice.textContent = `${totalPrice.toFixed(2).replace('.', ',')} zł`;
  }
  
  function removeProduct(id) {
    // Kliknięcie w przycisk usuń
    vars.removeBtn.addEventListener('click', _=> {
      const products = document.querySelectorAll('.list-product');
      const cogs = document.querySelectorAll('.product-modify-btn');

      cogs.forEach(cog => cog.classList.remove('disable-pointer-event'));

      products.forEach(product => {
        if(product.getAttribute('data-id') === id) {
          const price = parseFloat(document.querySelector(`[data-id="${id}"] .list-product-price`)
          .textContent
          .split(" ", 1)
          .join()
          .replace(',', '.'));
          
          data.totalPrice -= price;
          let totalPrice = Number(data.totalPrice.toFixed(2));
          
          console.log(totalPrice);

          if(totalPrice !== 0) {
            showSumPrice(totalPrice);
          } else {
            vars.summaryPriceContainer.classList.remove('visible');
          }

          document.querySelector(`[data-id="${id}"]`).remove();

          if(document.querySelector('.list-product') === null) {
            vars.containerDisplayProducts.classList.remove('visible', 'animated', 'rubberBand');
          }
        }
      });
      vars.buttons.classList.remove('show-buttons');
    });
  }

  function showButtons(e) {
    if(e.target.classList.contains('product-modify-btn')) {
      const cogs = document.querySelectorAll('.product-modify-btn');
      const id = e.target.parentNode.dataset.id;
      console.log(e.target.parentNode);

      cogs.forEach(cog => cog.classList.add('disable-pointer-event'));
      removeProduct(id);
    
      vars.buttons.classList.add('show-buttons');
      e.target.firstChild.classList.add('fa-spin');
    }
  }
  
  function displayProductsFromLocalStorage(products) {
    products.forEach(product => {
      showProduct(product);
      data.totalPrice += parseFloat(product.productPrice); 
    });
    showSumPrice(parseFloat(data.totalPrice.toFixed(2)));
  }

  function init(_vars) {
    vars = _vars;

    displayProductsFromLocalStorage(data.products);
    vars.addBtn.addEventListener('click', addProduct);
    vars.containerDisplayProducts.addEventListener('click', showButtons);
  }

  return {
    init
  };
})();