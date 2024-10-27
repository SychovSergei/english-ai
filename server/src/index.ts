import app from "./bin/app";
import conf from "./config";

const start = () => {
    try {
        const PORT = conf.port;
        app.listen(PORT, () => console.log(`[server]: Server is running at PORT:${PORT}`));
    }
    catch (e) {
        console.log("Start() ERROR, e");
    }
};

start();
