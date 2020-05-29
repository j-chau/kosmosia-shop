
$("#pop-up-cart").hide();

function cartQtyTotal(count) {
    $("#shoppingCount").text(count);
}

$(document).ready(() => {

    $("#closeCart").click(function () {
        $("#pop-up-cart").animate({ width: "hide" });
    });

    let carts = $(".add-cart");
    for (i = 0; i < carts.length; i++) {
        carts[i].addEventListener("click", (event) => {
            $("#pop-up-cart").animate({ width: "show" });

            prodIMG = event.target.parentNode.parentNode.getElementsByClassName("card-img-top")[0].src;
            prodPrice = event.target.previousElementSibling;
            prodName = prodPrice.previousElementSibling;
            prodSKU = prodName.id;
            qty = 1;

            var purchaseItem = {
                "sku": "s" + prodSKU,
                "description": prodName.innerText,
                "imgURL": prodIMG,
                "price": prodPrice.innerText,
                "qty": qty
            }

            addCart(cartItems, purchaseItem);
        });
    }

    var shoppingCart = [];
    function addCart(cartItems, purchaseItem) {
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
        }
        updateCart();
    }

    function buildCartList(obj) {
        return `<div class="row no-gutters bg-light mb-4 mx-auto"  id="${obj.sku}">
    <div class="col-1 text-center my-auto pt-1">
        <ion-icon name="trash-outline" class="iconHover trash"></ion-icon>
    </div>
    <div class="col-3 py-3 text-center"><img src="${obj.imgURL}" height="115px"></div>
    <div class="col-7 my-auto pl-3">
        <h4>${obj.description}</h4>
        <span class="font-italic">${obj.price}</span>
    </div>
    <div class="col-1 text-center my-auto pr-4">
        <ion-icon name="chevron-up-outline" class="iconHover incQty"></ion-icon>
        <div class="pb-1">${obj.qty}</div>
        <ion-icon name="chevron-down-outline" class="iconHover decQty"></ion-icon>
    </div>
</div>`;
    }

    $("#cartList").click(function () {

        cartItems = JSON.parse(sessionStorage.getItem("data"));
        prodID = event.target.parentElement.parentElement.id;

        // increase quantity
        if (event.target.classList.contains("incQty")) {
            updateQty(prodID, cartItems, true);
        }

        //decrease quantity
        if (event.target.classList.contains("decQty")) {
            currentQty = event.target.previousElementSibling.innerText;
            if (currentQty == 1) {
                $(".modal-title").removeAttr("id").attr("id", prodID);
                $("#zeroQty").addClass("show-zero");
                $(".blackout").addClass("black-on");
            }
            else {
                updateQty(prodID, cartItems, false);
            }
        }

        //remove item
        if (event.target.classList.contains("trash")) {
            removeItem(prodID, cartItems);
        }
        updateCart();
    });

    function updateQty(prodID, cart, up) {
        for (let i in cart) {
            if (prodID == cart[i].sku) {
                up ? cart[i].qty++ : cart[i].qty--;
            }
        }
        sessionStorage.setItem("data", JSON.stringify(cart));
    }

    function removeItem(prodID, cart) {
        for (let i in cart) {
            if (prodID == cart[i].sku) {
                cart.splice(i, 1);
                shoppingCart.splice(i, 1);
            }
        }
        sessionStorage.setItem("data", JSON.stringify(cart));
    }

    $("#removeZero").click(function () {
        prodID = $(".modal-title").attr("id");
        cartItems = JSON.parse(sessionStorage.getItem("data"));

        removeItem(prodID, cartItems)
        updateCart();
        closeZero();
    });

    $("#closeModal").click(closeZero = () => {
        $("#zeroQty").removeClass("show-zero");
        $(".blackout").removeClass("black-on");
    });

    function updateCart() {
        cartItems = JSON.parse(sessionStorage.getItem("data"));
        total = 0;
        $("#cartList").text("");
        for (let i in cartItems) {
            $("#cartList").append(buildCartList(cartItems[i]));
            price = parseInt(cartItems[i].price.replace(/\D/g, ''));
            quantity = cartItems[i].qty;
            total += price * quantity;
        }
        $("#subtotal").text(total);
        countCart();
    }

    $("#Checkout").click(function () {
        sessionStorage.clear();
        shoppingCart = [];
        cartQtyTotal(0);
        $("#cartList").text("");
    });
});

