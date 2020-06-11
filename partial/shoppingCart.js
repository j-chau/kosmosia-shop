
$("#pop-up-cart").hide();

$("#closeCart").click(function () {
    $("#pop-up-cart").animate({ width: "hide" });
});

function triggerAddCart() {
    let carts = $(".add-cart");
    for (i = 0; i < carts.length; i++) {
        carts[i].addEventListener("click", (event) => {
            $("#pop-up-cart").animate({ width: "show" });

            et = event.target.parentNode;
            prodIMG = et.parentNode.getElementsByClassName("card-img-top")[0].src;
            prodPrice = et.previousElementSibling.lastElementChild;
            prodName = et.previousElementSibling.firstElementChild;
            prodSKU = prodName.id;
            qty = 1;

            var purchaseItem = {
                "sku": "s" + prodSKU,
                "description": prodName.innerText,
                "imgURL": prodIMG,
                "price": prodPrice.innerText,
                "qty": qty
            }

            addCart(purchaseItem);
        });
    }
};

function addCart(purchaseItem) {
    var appendCart = true;
    cartItems = JSON.parse(sessionStorage.getItem("data"));

    if (cartItems !== null) {
        // check if items were already added during current session
        if (shoppingCart.length == 0) {
            shoppingCart = cartItems;
        }

        // if item has already been added to cart, increment qty
        if (cartItems.length > 0) {
            for (let i in shoppingCart) {
                if (purchaseItem.sku == shoppingCart[i].sku) {
                    updateQty(purchaseItem.sku, cartItems, true);
                    shoppingCart[i].qty = cartItems[i].qty;
                    appendCart = false;
                }
            }
        }
    }
    if (appendCart) {
        shoppingCart.push(purchaseItem);
        sessionStorage.setItem("data", JSON.stringify(shoppingCart));
        updateCart();
    }
}

function buildCartList(obj) {
    return `<div class="row no-gutters bg-white mb-4 mx-auto text-left" id="${obj.sku}">
    <div class="col-1 text-center my-auto pt-1">
        <ion-icon name="trash-outline" class="icon trash"></ion-icon>
    </div>
    <div class="col-4 py-3 text-center"><img src="${obj.imgURL}" class="img-fluid"></div>
    <div class="col-6 text-wrap my-auto pl-3">
        <h4>${obj.description}</h4>
        <span class="font-italic">${obj.price}</span>
    </div>
    <div class="col-1 text-center my-auto mx-auto">
        <ion-icon name="chevron-up-outline" class="icon incQty"></ion-icon>
        <div class="pb-1">${obj.qty}</div>
        <ion-icon name="chevron-down-outline" class="icon decQty"></ion-icon>
    </div>
</div>`;
}

function emptyNote() {
    return `<i>Your cart is currently empty</i>`
}
