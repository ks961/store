
export type StartupHandler = () => Promise<void> | void;
export type ShutdownHandler = () => Promise<void> | void;

export class Task {
    constructor(
        public readonly name: string,
        public readonly startupHandler: StartupHandler,
        public readonly shutdownHandler: ShutdownHandler,
    ) {};
}

export class LifecycleManager {
    private tasks: Task[] = [];
    private shuttingDown = false;
    
    register(
        task: Task
    ) {
        this.tasks.push(task);
    }

    async startup() {

        for(let i = 0; i < this.tasks.length; i++) {
            const task = this.tasks[i];
            try {
                console.log(`Starting up: '${task?.name}'`);
                await task?.startupHandler();
            } catch(err: unknown) {
                console.error(`Failed to start task: '${task?.name}'`);
                console.log(err);
                await this.shutdown(Math.max(0, i - 1));
                process.exit(1);
            }
        }
        this.bindProcessSignals();
    }
    
    async shutdown(
        index: number = this.tasks.length - 1
    ) {
        if(this.shuttingDown) return;
        this.shuttingDown = true;

        for(let i = index; i >= 0; i--) {
            const task = this.tasks[i];
            try {
                console.log(`Shutting down: '${task?.name}'`);
                await task?.shutdownHandler();
            } catch(err: unknown) {
                console.log(err);
                console.error(`Failed to stop running task: '${task?.name}'`);
            }
        }
    }

    private bindProcessSignals() {
        ["SIGINT", "SIGTERM"].forEach(signal => {
            process.on(signal, async () => {
                await this.shutdown();
                process.exit(0);
            });
        });
    }
}