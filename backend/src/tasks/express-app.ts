import app from "src/app";
import { Task } from "@libs/lifecycle-manager";
import { configs } from "@configs";


let server: ReturnType<typeof app.listen> | null = null;
export const expressApp = new Task(
    "Express App",
    () => {
        server = app.listen(configs.PORT);
    },
    async () => {

        if(!server) {
            throw new Error(
                "App Server hasn't started."
            );
        }

        await new Promise((res, rej) => {
            server!.close(err => err ? rej(err) : res(''))
        });
    }
);