emptyNote();
updateCart();

$(window).on("load", function () {
    shippingCost = sessionStorage.getItem("shipping");
    if (shippingCost > 0) {
        showShipping(shippingCost);
        for (let i in shippingInfo) {
            if (shippingCost == shippingInfo[i].cost) {
                $("#dropdownFront").text(shippingInfo[i].country);
            }
        }
    }
});

function buildCartList(obj) {
    price = parseInt(obj.price.replace(/\D/g, ''));
    quantity = obj.qty;
    singleTotal = price * quantity;

    return `<div class="row no-gutters bg-white py-2" id="${obj.sku}">
        <div class="col-2 text-center"><img class="img-fluid"
                src="${obj.imgURL}">
        </div>
        <div class="col-4 my-auto pl-3">
            <h4>${obj.description}</h4>
        </div>
        <div class="col-2 my-auto text-center">${obj.price}</div>
        <div class="col-1 text-center my-auto">
            <ion-icon name="chevron-up-outline" class="icon incQty"></ion-icon>
            <div class="pb-1">${obj.qty}</div>
            <ion-icon name="chevron-down-outline" class="icon decQty"></ion-icon>
        </div>
        <div class="col-2 my-auto text-right font-weight-bold">$${singleTotal} USD</div>
        <div class="col-1 text-center my-auto pt-1">
            <ion-icon name="trash-outline" class="icon trash"></ion-icon>
        </div>
        </div>
        <hr>`;
}

function emptyNote() {
    return `<p class="text-center"><i>Your cart is currently empty</i></p>
    <p class="text-center"><a href="shop.html">Continue Shopping</a></p>
    <hr>`
}

$("#shipCountry").click(function () {
    countryName = event.target.innerText;
    countryCode = event.target.value;
    $("#dropdownFront").text(countryName);
    for (let i in shippingInfo) {
        if (countryCode === shippingInfo[i].country_code) {
            price = shippingInfo[i].cost;
            showShipping(price);
        }
    }
});

$("#cartList").click(function () {
    if (event.target.classList.contains("icon")) {
        finalTotal();
    };
});