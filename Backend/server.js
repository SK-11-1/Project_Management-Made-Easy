const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = 5000;

const DATA_FILE =
path.join(__dirname, "transfers.json");

app.use(cors());

app.use(express.json());

// ------------------------------------
// DATABASE HELPERS
// ------------------------------------

function readTransfers() {

```
try {

    const data =
        fs.readFileSync(
            DATA_FILE,
            "utf8"
        );

    return JSON.parse(data);

} catch (error) {

    return [];

}
```

}

function saveTransfers(transfers) {

fs.writeFileSync(

    DATA_FILE,

    JSON.stringify(
        transfers,
        null,
        2
    )

);

}

// ------------------------------------
// GET ALL TRANSFERS
// ------------------------------------

app.get(
"/api/transfers",
(req, res) => {

    const transfers =
        readTransfers();

    res.json(transfers);

}

);

// ------------------------------------
// CREATE TRANSFER
// ------------------------------------

app.post(
"/api/transfers",
(req, res) => {


    const {
        product,
        quantity,
        from,
        to,
        date
    } = req.body;


    // Validation

    if (
        !product ||
        !quantity ||
        !from ||
        !to ||
        !date
    ) {

        return res.status(400).json({

            message:
                "All fields are required."

        });

    }


    if (from === to) {

        return res.status(400).json({

            message:
                "Source and destination cannot be the same."

        });

    }


    if (Number(quantity) <= 0) {

        return res.status(400).json({

            message:
                "Quantity must be greater than zero."

        });

    }


    const transfers =
        readTransfers();


    const nextNumber =
        transfers.length + 1;


    const transfer = {

        id:
            `TRF-${String(nextNumber).padStart(3, "0")}`,

        product,

        quantity:
            Number(quantity),

        from,

        to,

        date,

        status:
            "Pending",

        createdAt:
            new Date().toISOString()

    };


    transfers.push(transfer);


    saveTransfers(transfers);


    res.status(201).json(transfer);

}


);

// ------------------------------------
// UPDATE TRANSFER
// ------------------------------------

app.patch(
"/api/transfers/:id",
(req, res) => {

```
    const transfers =
        readTransfers();


    const index =
        transfers.findIndex(
            transfer =>
                transfer.id === req.params.id
        );


    if (index === -1) {

        return res.status(404).json({

            message:
                "Transfer not found."

        });

    }


    const {
        status
    } = req.body;


    const allowedStatuses = [

        "Pending",
        "Completed",
        "Cancelled"

    ];


    if (
        !allowedStatuses.includes(status)
    ) {

        return res.status(400).json({

            message:
                "Invalid status."

        });

    }


    transfers[index].status =
        status;


    transfers[index].updatedAt =
        new Date().toISOString();


    saveTransfers(transfers);


    res.json(
        transfers[index]
    );

}

);

// ------------------------------------
// DELETE TRANSFER
// ------------------------------------

app.delete(
"/api/transfers/:id",
(req, res) => {

```
    const transfers =
        readTransfers();


    const newTransfers =
        transfers.filter(
            transfer =>
                transfer.id !== req.params.id
        );


    if (
        newTransfers.length ===
        transfers.length
    ) {

        return res.status(404).json({

            message:
                "Transfer not found."

        });

    }


    saveTransfers(newTransfers);


    res.json({

        message:
            "Transfer deleted successfully."

    });

}

);

// ------------------------------------
// SERVER
// ------------------------------------

app.listen(
PORT,
() => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

}

);
