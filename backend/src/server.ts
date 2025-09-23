import { redis } from "@tasks/redis";
import { db } from "@tasks/database";
import { expressApp } from "@tasks/express-app";
import { fileLogger } from "@tasks/file-logger";
import { diContainerRegistery } from "@tasks/container";
import { LifecycleManager } from "@libs/lifecycle-manager";


const lifeCycleManager = new LifecycleManager();

lifeCycleManager.register(db);
lifeCycleManager.register(redis);
lifeCycleManager.register(fileLogger);

lifeCycleManager.register(diContainerRegistery);

lifeCycleManager.register(expressApp);


try {
    await lifeCycleManager.startup();
} catch(err: unknown) {
    console.error(err);
    await lifeCycleManager.shutdown();
    process.exit(1);
}