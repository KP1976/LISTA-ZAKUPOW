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
}
