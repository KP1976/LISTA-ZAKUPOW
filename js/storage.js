class Storage {
  constructor(product) {
    this.product = product;
  }

  addProduct() {
    localStorage.setItem('products', JSON.stringify(this.product));
  }

  static getProductsFromLocalStorage() {
    let products;

    if(localStorage.getItem('products') === null) {
      products = [];
    } else {
      products = JSON.parse(localStorage.getItem('products'));
    }
    console.log(products);
    return products;
  }
}
