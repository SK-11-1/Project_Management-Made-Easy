function getProducts() {
    return JSON.parse(localStorage.getItem("products")) || [];
}


function saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
}


function addProduct() {

    const name = prompt("Enter product name:");
    if (!name) return;

    const sku = prompt("Enter SKU:");
    if (!sku) return;

    const category = prompt(
        "Enter category:\nRaw Material\nFurniture\nElectronics"
    );

    if (!category) return;

    const stock = parseInt(
        prompt("Enter initial stock:")
    );

    if (isNaN(stock) || stock < 0) {
        alert("Please enter a valid stock quantity.");
        return;
    }

    const warehouse = prompt("Enter warehouse:");
    if (!warehouse) return;

    const product = {
        id: Date.now(),
        name: name,
        sku: sku,
        category: category,
        stock: stock,
        warehouse: warehouse
    };

    const products = getProducts();

    products.push(product);

    saveProducts(products);

    alert("Product added successfully!");

    displayProducts();
    updateStatistics();
}


function displayProducts() {

    const products = getProducts();

    const tbody = document.querySelector("#productsTable tbody");

    if (!tbody) return;

    tbody.innerHTML = "";

    products.forEach(product => {

        let status = "";
        let statusClass = "";

        if (product.stock === 0) {
            status = "Out of Stock";
            statusClass = "out-stock";
        }
        else if (product.stock <= 20) {
            status = "Low Stock";
            statusClass = "low-stock";
        }
        else {
            status = "In Stock";
            statusClass = "in-stock";
        }

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <div class="product-name">
                    <div class="product-icon">📦</div>
                    <strong>${product.name}</strong>
                </div>
            </td>

            <td>${product.sku}</td>

            <td>${product.category}</td>

            <td>${product.stock} units</td>

            <td>
                <span class="status ${statusClass}">
                    ${status}
                </span>
            </td>

            <td>${product.warehouse}</td>

            <td>
                <button
                    class="action-btn"
                    onclick="viewProduct(${product.id})">
                    View
                </button>
            </td>
        `;

        tbody.appendChild(row);
    });
}


function updateStatistics() {

    const products = getProducts();

    let total = products.length;
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;

    products.forEach(product => {

        if (product.stock === 0) {
            outOfStock++;
        }
        else if (product.stock <= 20) {
            lowStock++;
        }
        else {
            inStock++;
        }

    });

    const stats = document.querySelectorAll(".stat-card strong");

    if (stats.length >= 4) {

        stats[0].innerText = total;
        stats[1].innerText = inStock;
        stats[2].innerText = lowStock;
        stats[3].innerText = outOfStock;

    }
}


function viewProduct(id) {

    const products = getProducts();

    const product = products.find(p => p.id === id);

    if (!product) return;

    alert(
        "Product Details\n\n" +
        "Name: " + product.name + "\n" +
        "SKU: " + product.sku + "\n" +
        "Category: " + product.category + "\n" +
        "Stock: " + product.stock + "\n" +
        "Warehouse: " + product.warehouse
    );
}


function searchProducts() {

    const input =
        document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const rows =
        document.querySelectorAll(
            "#productsTable tbody tr"
        );

    rows.forEach(row => {

        const text =
            row.innerText.toLowerCase();

        row.style.display =
            text.includes(input) ? "" : "none";

    });
}


function filterProducts() {

    const filter =
        document.getElementById("categoryFilter").value;

    const rows =
        document.querySelectorAll(
            "#productsTable tbody tr"
        );

    rows.forEach(row => {

        const category =
            row.cells[2].innerText;

        if (
            filter === "all" ||
            category === filter
        ) {
            row.style.display = "";
        }
        else {
            row.style.display = "none";
        }

    });
}


document.addEventListener("DOMContentLoaded", function() {

    displayProducts();
    updateStatistics();

});