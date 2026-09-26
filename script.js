const transferForm = document.getElementById("transferForm");

const transferList = document.getElementById("transferList");


transferForm.addEventListener("submit", function(event) {

    event.preventDefault();


    // Get values from form

    const project =
        document.getElementById("project").value;

    const from =
        document.getElementById("from").value;

    const to =
        document.getElementById("to").value;

    const item =
        document.getElementById("item").value;

    const description =
        document.getElementById("description").value;

    const date =
        document.getElementById("date").value;


    // Create transfer card

    const transfer = document.createElement("div");

    transfer.classList.add("transfer-item");


    transfer.innerHTML = `

        <h3>${item}</h3>

        <p>
            <strong>Project:</strong>
            ${project}
        </p>

        <p>
            <strong>From:</strong>
            ${from}
        </p>

        <p>
            <strong>To:</strong>
            ${to}
        </p>

        <p>
            <strong>Date:</strong>
            ${date}
        </p>

        <p>
            <strong>Description:</strong>
            ${description}
        </p>

    `;


    // Remove "No transfers" message

    const emptyMessage =
        document.querySelector(".empty-message");

    if (emptyMessage) {
        emptyMessage.remove();
    }


    // Add transfer to page

    transferList.prepend(transfer);


    // Reset form

    transferForm.reset();


    alert("Transfer created successfully!");

});