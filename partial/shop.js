const spaceID = "fszoesgel2t5";
const tokenID = "uorRKXNyrH9SNIfTFQZylAHZal1r_QWxImNxAwWcTac";
const catalogue = "https://cdn.contentful.com/spaces/" + spaceID + "/entries?access_token=" + tokenID;

function buildShop(obj) {
    return `<div class="card mb-5 shopping-card">
        <img class="card-img-top" src="${obj.imgURL}">
        <div class="card-body text-center">
            <h5 class="card-title pb-3" id="${obj.sku}">${obj.description}</h5>
            <h6 class="card-subtitle mb-3 text-muted">${obj.price}</h6>
        </div>
        <div class="card-footer mx-auto">
            <button class="add-cart btn btn-light">Add to Cart</button>
        </div>
    </div>`
}
//updates home page with newest arrivals added to Contentful
fetch(catalogue, {
    method: "get"
})
    .then((response) => {
        return response.json();
    })
    .then((data) => {

        for (i = 0; i < (data.total - 1); i++) {
            let prodName = data.items[i].fields.productName;
            let price = data.items[i].fields.price;
            let sku = data.items[i].fields.sku;
            let imgURL = "";

            imgMatching = data.includes.Asset;
            for (let j in imgMatching) {
                if (imgMatching[j].fields.title == sku) {
                    imgURL = imgMatching[j].fields.file.url;
                    break;
                }
            }
            itemInfo = {
                description: prodName,
                sku: sku,
                price: "$" + price + " USD",
                imgURL: imgURL
            }

            $("#shopList").append(buildShop(itemInfo));
        }
        triggerAddCart();
    });

