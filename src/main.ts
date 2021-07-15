import server from "./server";
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
server.listen(
    Number(process.env.PORT ?? 3000),
    "0.0.0.0",
    (err) => {
        if (err) {
            console.error(err.message);
            process.exit(1);
        }
        console.log(`Listening on ${Number(process.env.PORT ?? 3000)}`);
    }
);