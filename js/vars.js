document.addEventListener('DOMContentLoaded', function() {
  App.init({
    wholeContainer: this.querySelector('.whole-container'),
    addBtn: this.querySelector('.btn-add'),
    productName: this.querySelector('.product-input'),
    productPrice: this.querySelector('[name="product-price"]'),
    containerDisplayProducts: this.querySelector('.container-display-products'),
    containerListProducts: this.querySelector('.container-list-products'),
    buttons: this.querySelector('.buttons'),
    modifyBtn: this.querySelector('.btn-modify'),
    removeBtn: this.querySelector('.btn-remove'),
    getBackBtn: this.querySelector('.btn-back'),
    summaryPriceContainer: this.querySelector('.summary-price-container'),
    summaryPrice: this.querySelector('.summary-price')
  });
});