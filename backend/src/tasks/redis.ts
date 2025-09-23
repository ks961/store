import { RedisClient } from "bun";
import { configs } from "@configs";
import { container } from "./container";
import { Task } from "@libs/lifecycle-manager";


const bunRedis = new RedisClient(configs.REDIS_URI);
export const redis = new Task(
    "Redis Client",
    () => {
        container.singleton(
            RedisClient,
            () => bunRedis
        );
    }, 
    () => bunRedis.close()
)