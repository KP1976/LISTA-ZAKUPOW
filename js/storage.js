class Storage {
  constructor(product) {
    this.product = product;
  }

  addProductToLocalStorage() {
    localStorage.setItem('products', JSON.stringify(this.product));
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
