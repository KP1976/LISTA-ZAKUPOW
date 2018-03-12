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

      data.totalPrice += Number(newProduct.productPrice);
      showProduct(newProduct);
      showSumPrice(data.totalPrice);
      console.log(newProduct);
      console.log(data.totalPrice);
      
      vars.productName.value = '';
      vars.productPrice.value = '';
      
      Storage.addProductToLocalStorage(newProduct);
      
    } else {
      alert('Wypełnij puste pola!!!');
    }
  }
  
  function createProduct(prodName, prodPrice) {
    let id;
    
    if(data.products.length > 0) {
      id = data.products[data.products.length - 1].id + 1;
    } else {
      id = 0;
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
    totalPrice = Number(totalPrice);
    vars.summaryPriceContainer.classList.add('visible');
    vars.summaryPrice.textContent = `${totalPrice.toFixed(2).replace('.', ',')} zł`;
  }

  function enablePointerEvents() {
    const cogs = document.querySelectorAll('.product-modify-btn');
    cogs.forEach(cog => cog.classList.remove('disable-pointer-event'));
  }

  function updateProducts() {
    let html = '';

    data.products.forEach(product => {
      html += `
      <li class="list-product" data-id="${product.id}">
        <span class="list-product-name">${product.productName}: </span>
        <span class="list-product-price">${product.productPrice.replace('.', ',')} zł</span>
        <button class="product-modify-btn"><i class="fas fa-cog"></i></button>
      </li>
      `;
    });
    
    vars.containerListProducts.innerHTML = html;
    enablePointerEvents();
    vars.buttons.classList.remove('show-buttons');
    vars.summaryPrice.textContent = `${data.totalPrice.toString().replace('.', ',')} zł`;
  }

  function removeProduct() {
    deleteCurrentProduct(data.currentProduct.id);

    data.totalPrice -= data.currentProduct.productPrice; 
    let totalPrice = data.totalPrice.toFixed(2);
    data.totalPrice = Number(totalPrice);

    updateProducts();
    Storage.removeProductFromLocalStorage(data.currentProduct.id);

    if(data.totalPrice === '0.00') {
      vars.containerDisplayProducts.classList.remove('visible', 'animated', 'rubberBand');
      vars.summaryPriceContainer.classList.remove('visible');
    }
  }

  function deleteCurrentProduct(id) {
    const ids = data.products.map(product => product.id);
    const index = ids.indexOf(id);

    data.products.splice(index, 1);
  }

  function showButtons(e) {
    if(e.target.classList.contains('product-modify-btn')) {
      const id = e.target.parentNode.dataset.id;
      const cogs = document.querySelectorAll('.product-modify-btn');

      cogs.forEach(cog => cog.classList.add('disable-pointer-event'));
      vars.buttons.classList.add('show-buttons');
      e.target.firstChild.classList.add('fa-spin');

      const productToEdit = getProductById(id);
      data.currentProduct = productToEdit;
    }
  }

  function getProductById(id) {
    let foundProductById = null;

    data.products.forEach(product => {
      if(product.id === Number(id)) {
        foundProductById = product;
      }
    });
    return foundProductById;
  }

  function getBack(e) {
    const cogs = document.querySelectorAll('.product-modify-btn');

    vars.buttons.classList.remove('show-buttons');
    enablePointerEvents();
    cogs.forEach(cog => cog.firstChild.classList.remove('fa-spin'));
  }
  
  function displayProductsFromLocalStorage(products) {
    if (products.length !== 0) {
      products.forEach(product => {
        showProduct(product);
        data.totalPrice += parseFloat(product.productPrice); 
      });
      showSumPrice(parseFloat(data.totalPrice.toFixed(2)));
   }
  }

  function clickEvents() {
    vars.addBtn.addEventListener('click', addProduct);
    vars.removeBtn.addEventListener('click', removeProduct);
    vars.getBackBtn.addEventListener('click', getBack);
    vars.containerDisplayProducts.addEventListener('click', showButtons);
  }

  function init(_vars) {
    vars = _vars;
    displayProductsFromLocalStorage(data.products);
    clickEvents();
  }

  return {
    init
  };
})();