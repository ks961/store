
export type ScopedContainer = {
    resolve: <T>(ctor: Ctor<T>) => T;
}

declare global {
  namespace Express {
    interface Request { scope: ScopedContainer; }
  }
}

export type Ctor<T> = new (...any: any[]) => T;

export type Factory<T> = (...any: any[]) => T;

export class DIContainer {
    private singletonMap = new Map<Ctor<any>, unknown>();
    private scopedMap = new Map<Ctor<any>, Factory<unknown>>();
    private transientMap = new Map<Ctor<any>, Factory<unknown>>();


    scope<T extends Ctor<T>>(
        ctor: T,
        factory: Factory<T>
    ) {
        if(
            this.singletonMap.has(ctor) ||
            this.transientMap.has(ctor)
        ) {
            throw new Error(`'${ctor.name}' is already registered with other lifetime.`)
        }

        this.scopedMap.set(ctor, factory);
    }

    singleton<T>(
        ctor: Ctor<T>,
        factory: Factory<T>
    ) {
        if(
            this.scopedMap.has(ctor) ||
            this.transientMap.has(ctor)
        ) {
            throw new Error(`'${ctor.name}' is already registered with other lifetime.`)
        }
        
        this.singletonMap.set(ctor, factory());
    }
    
    transient<T>(
        ctor: Ctor<T>,
        factory: Factory<T>
    ) {
        if(
            this.scopedMap.has(ctor) ||
            this.singletonMap.has(ctor)
        ) {
            throw new Error(`'${ctor.name}' is already registered with other lifetime.`)
        }

        this.transientMap.set(ctor, factory);
    }

    resolve<T>(
        ctor: Ctor<T>
    ) {
        const sService = this.singletonMap.get(ctor);

        if(sService) {
            return sService as T;
        }

        const tService = this.transientMap.get(ctor);
        if(tService) {
            return tService() as T;
        }

        throw new Error(`'${ctor.name}' is not registered with 'singleton' or 'transient' lifetime.`);
    }

    clearAll() {
        this.scopedMap.clear();
        this.singletonMap.clear();
        this.transientMap.clear();
    }

    createScope() {
        const scopeMap = new Map<Ctor<any>, any>();
        for(const [ key, factory ] of this.scopedMap) {
            scopeMap.set(key, factory());  
        }
        
        return {
            resolve: <T>(ctor: Ctor<T>): T => {
                return scopeMap.get(ctor);
            }
        }
    }

    static scopeMiddleware(di: DIContainer) {
        return (req: any, _res: any, next: any) => {
            req.scope = di.createScope();
            next();
        }
    }
}