const App = (_=> {
  // Klasa Product do tworzenia obiektów z identyfikatorem, nazwą i ceną produktu
  class Product {
    constructor(id, productName, productPrice) {
      this.id = id;
      this.productName = productName;
      this.productPrice = productPrice;
    }
  }

  // W zmiennej data przechowywany jest obiekt z danymi: produkty, obecny produkt, suma cen
  const data = {
    products: Storage.getProductsFromLocalStorage(),
    currentProduct: null,
    totalPrice: 0
  };

  // Po wciśnięciu przycisku DODAJ odpalana jest poniższa funkcja
  function addProduct() {
    const prodName = vars.productName.value;
    // String zamieniany jest na floata z dwoma cyframi po przecinku
    const prodPrice = parseFloat(vars.productPrice.value).toFixed(2);

    // Sprawdzanie czy nie ma pustych inputów lub czy cena nie jest ujemna i wyświetlenie odpowiedniego komunikatu
    if(prodName !== '' && (prodPrice !== '' && prodPrice > 0) && !isNaN(prodPrice)) {
      // Stworzenie nwego produktu
      const newProduct = createProduct(prodName, prodPrice);

      // Zapisanie w danych (data) całkowitej ceny produktów z zamianą stringa na float
      data.totalPrice += parseFloat(newProduct.productPrice);

      // Utworzenie struktury html do wyświetlenia produktów i całkowitej ceny produktów
      showProduct(newProduct);
      showSumPrice(data.totalPrice);
      
      // Czyszczenie inputów po dodaniu produktu
      clearInputs();
       
      // Zapisanie nowego produktu w LocalStorage
      Storage.addProductToLocalStorage(newProduct);
      
    } else {
      vars.addBtn.classList.add('alert');
      vars.addBtn.textContent = 'wypełnij puste pola!!!';
      setTimeout(_=> {
        vars.addBtn.classList.remove('alert');
        vars.addBtn.textContent = 'dodaj';
      }, 2000);
    }

    if(prodName !== '' && prodPrice < 0) {
      vars.addBtn.classList.add('alert');
      vars.addBtn.textContent = 'cena produktu musi być dodatnia!!!';
      setTimeout(_=> {
        vars.addBtn.classList.remove('alert');
        vars.addBtn.textContent = 'dodaj';
      }, 2000);
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

    // Włączenie obsługi zdarzeń dla przycisków edycji produktów (ikona zębatki)
    enablePointerEvents();

    // Wyłączenie wyświetlania na stronie butonów (modyfikacja, skasuj, powrót)
    vars.buttons.classList.remove('show-buttons');

    // Zapis całkowitej sumy produktów z zamianą kropki na przecinek i dodanie zł na końcu
    vars.summaryPrice.textContent = `${data.totalPrice.toString().replace('.', ',')} zł`;
  }

  // Po wciśnięciu przycisku SKASUJ odpalana jest poniższa funkcja
  function removeProduct() {
    // Kasowanie obecnego produktu o danym id
    deleteCurrentProduct(data.currentProduct.id);

    // Odjęcie całkowitej sumy cen produktów od ceny produktu skasowanego
    data.totalPrice -= data.currentProduct.productPrice; 
    let totalPrice = data.totalPrice.toFixed(2);
    data.totalPrice = Number(totalPrice);

    // Aktualizacja produktów w strukturze danych i w html
    updateProducts();

    // Usunięcie produktu z LocalStorage
    Storage.removeProductFromLocalStorage(data.currentProduct.id);

    // Jeżeli całkowita suma cen produktów będzie równa 0 to nie pokazuj sumy i ramki z produktami
    if(data.totalPrice === 0) {
      vars.containerDisplayProducts.classList.remove('visible', 'animated', 'rubberBand');
      vars.summaryPriceContainer.classList.remove('visible');
    }

    // Pokaż przycisk DODAJ
    vars.addBtn.classList.add('visible');

    // Czyszczenie inputów po dodaniu produktu
    clearInputs();
  }

  function deleteCurrentProduct(id) {
    const ids = data.products.map(product => product.id);
    const index = ids.indexOf(id);

    data.products.splice(index, 1);
  }

  // Po wciśnięciu przycisku MODYFIKUJ odpalana jest poniższa funkcja
  function modifyProduct() {
    const productName = vars.productName.value;
    const productPrice = parseFloat(vars.productPrice.value).toFixed(2);
    let tabOfTotalPrice;
    
    // Do struktury danych zapisujemy zmienioną nazwę i cenę produktu pobrana z inputów
    data.currentProduct.productName = productName;
    data.currentProduct.productPrice = productPrice;
   
    // Aktualizacja produktów w strukturze danych i w html
    updateProducts();

    // Aktualizacja produktu w LocalStorage
    Storage.updateProductInLocalStorage(data.currentProduct);

    // Pokaż przycisk DODAJ
    vars.addBtn.classList.add('visible');

    // Utworzenie tablicy z cenami wszystkich produktów
    tabOfTotalPrice = data.products.map(product => {
      return Number(product.productPrice);
    });

    // Aktualizacja całkowitej ceny produktów
    data.totalPrice = tabOfTotalPrice.reduce((a, b) => {
      return a + b;
    });

    // Zapis całkowitej sumy produktów z zamianą kropki na przecinek i dodanie zł na końcu
    vars.summaryPrice.textContent = `${data.totalPrice.toString().replace('.', ',')} zł`;

    // Czyszczenie inputów po dodaniu produktu
    clearInputs();
  }

  // Po wciśnięciu przycisku z ikoną zębatki odpalana jest poniższa funkcja
  function showButtons(e) {
    if(e.target.classList.contains('product-modify-btn')) {
      // Pobranie id z atrybutu data-id
      const id = e.target.parentNode.dataset.id;
      const cogs = document.querySelectorAll('.product-modify-btn');
      
      // Wyłączenie obsługi zdarzeń dla przycisków edycji produktów (ikona zębatki)
      cogs.forEach(cog => cog.classList.add('disable-pointer-event'));
      
      // Włączenie wyświetlania na stronie butonów (modyfikacja, skasuj, powrót)
      vars.buttons.classList.add('show-buttons');

      // Włączenie animacji zębatki
      e.target.firstChild.classList.add('fa-spin');
      
      const productToEdit = getProductById(id);
      data.currentProduct = productToEdit;
      
      // Ukryj przycisk DODAJ
      vars.addBtn.classList.remove('visible');

      // Umieszczenie w inputach danych o nazwie i cenie produktu
      vars.productName.value = data.currentProduct.productName;
      vars.productPrice.value = data.currentProduct.productPrice;
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

  // Po wciśnięciu przycisku POWRÓT odpalana jest poniższa funkcja
  function getBack(e) {
    const cogs = document.querySelectorAll('.product-modify-btn');

    // Wyłączenie wyświetlania na stronie butonów (modyfikacja, skasuj, powrót)
    vars.buttons.classList.remove('show-buttons');

    // Włączenie obsługi zdarzeń dla przycisków edycji produktów (ikona zębatki)
    enablePointerEvents();

    // Wyłączenie animacji zębatek
    cogs.forEach(cog => cog.firstChild.classList.remove('fa-spin'));

    // Pokaż przycisk DODAJ
    vars.addBtn.classList.add('visible');

    // Czyszczenie inputów po dodaniu produktu
    clearInputs();
  }

  function clearInputs() {
    vars.productName.value = '';
    vars.productPrice.value = '';
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
    vars.modifyBtn.addEventListener('click', modifyProduct);
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