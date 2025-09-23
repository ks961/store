import { registerSingleton } from "@contexts/singleton";
import { DIContainer } from "@libs/di";
import { Task } from "@libs/lifecycle-manager";


export const container: DIContainer = new DIContainer();
export const diContainerRegistery = new Task(
    "DI container",
    () => {
        registerSingleton(container);
    },
    () => container.clearAll()
);