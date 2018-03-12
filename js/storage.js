class Storage {
  static addProductToLocalStorage(newProduct) {
    let products;
    if(localStorage.getItem('products') === null) {
      console.log(newProduct);
      products = [];
      products.push(newProduct);
      localStorage.setItem('products', JSON.stringify(products));
    } else {
      products = JSON.parse(localStorage.getItem('products'));
      products.push(newProduct);
      localStorage.setItem('products', JSON.stringify(products));
    }
  }

  static getProductsFromLocalStorage() {
    let products;

    if(localStorage.getItem('products') === null) {
      products = [];
    } else {
      products = JSON.parse(localStorage.getItem('products'));
    }
    return products;
  }

  static removeProductFromLocalStorage(id) {
    let products = Storage.getProductsFromLocalStorage();

    products.forEach((product, index) => {
      if(product.id === id) {
        products.splice(index, 1);
      }
    });
    localStorage.setItem('products', JSON.stringify(products));
  }
}
