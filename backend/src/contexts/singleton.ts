import { DIContainer } from "../libs/di";
import { doesExists } from "@libs/utils";
import { UserService } from "@services/user";
import { database } from "src/tasks/database";
import { PostgresUserRepo } from "@adapters/repos/PostgresUserRepo";
import { PasswordHasher } from "@adapters/utilities/PasswordHasher";
import { BunPasswordHasher } from "@adapters/utilities/PasswordHasher/BunPasswordHasher";
import { MemDB } from "@adapters/memdb";
import { PostgresRoleRepo } from "@adapters/repos/PostgresRoleRepo";
import { CryptoHasher } from "@adapters/utilities/CryptoHasher";
import { RedisClient } from "bun";
import { BunRedis } from "@adapters/memdb/BunRedis";
import { BunSha256 } from "@adapters/utilities/CryptoHasher/SHA256";
import { AuthenticationService, type UserLoginClaims } from "@services/authentication";
import { AuthToken } from "@adapters/auth-token";
import { Jwt } from "@adapters/auth-token/jwt";
import type { JWTPayload } from "jose";
import { configs } from "@configs";
import { Logger } from "@adapters/logger";
import { ConsoleLogger } from "@adapters/logger/console";
import { FileLogger } from "@adapters/logger/file";
import { AuthorizationService } from "@services/authorization";
import { PostgresRolePermission } from "@adapters/repos/PostgresRolePermissionRepo";
import { StoreService } from "@services/store";
import { PostgresStoreRepo } from "@adapters/repos/PostgresStoreRepo";
import { PostgresStoreRatingRepo } from "@adapters/repos/PostgresStoreRatingRepo";
import { StoreRatingService } from "@services/store-rating";


export function registerSingleton(
    container: DIContainer
) {

    container.singleton(
        PostgresRoleRepo,
        () => new PostgresRoleRepo(
            doesExists(database)
        )
    );

    container.singleton(
        PostgresUserRepo,
        () => new PostgresUserRepo(
            doesExists(database)
        )
    );

    container.singleton(
        PostgresRolePermission,
        () => new PostgresRolePermission(
            doesExists(database)
        )
    );

    container.singleton(
        PostgresStoreRepo,
        () => new PostgresStoreRepo(
            doesExists(database)
        )
    );

    container.singleton(
        PostgresStoreRatingRepo,
        () => new PostgresStoreRatingRepo(
            doesExists(database)
        )
    );

    container.singleton(
        UserService,
        () => new UserService(
            container.resolve(PostgresUserRepo),
            container.resolve(PostgresRoleRepo), 
            container.resolve(PostgresStoreRepo), 
            container.resolve(PostgresStoreRatingRepo) 
        )
    );

    
    container.singleton(
        PasswordHasher,
        () => new PasswordHasher(
            new BunPasswordHasher()
        )
    );

    container.singleton(
        AuthToken,
        () => new AuthToken(
            new Jwt(
                new TextEncoder().encode(configs.JWT_SECRET)
            )
        )
    );

    container.singleton(
        CryptoHasher,
        () => new CryptoHasher(
            new BunSha256()
        )
    );

    container.singleton(
        MemDB,
        () => new MemDB(
            new BunRedis(
                container.resolve(RedisClient)
            )
        )
    );

    container.singleton(
        AuthenticationService,
        () => new AuthenticationService(
            container.resolve(PostgresUserRepo),
            container.resolve(PostgresRoleRepo),
            container.resolve(PasswordHasher),
            container.resolve(CryptoHasher),
            container.resolve(MemDB),
            container.resolve(AuthToken<JWTPayload, UserLoginClaims>)
        )
    );

    container.singleton(
        AuthorizationService,
        () => new AuthorizationService(
            container.resolve(PostgresUserRepo),
            container.resolve(PostgresRoleRepo),
            container.resolve(PostgresRolePermission),
        )
    );
    
    container.singleton(
        StoreService,
        () => new StoreService(
            container.resolve(PostgresUserRepo),
            container.resolve(PostgresStoreRepo),
            container.resolve(PostgresStoreRatingRepo)
        )
    );

    container.singleton(
        StoreRatingService,
        () => new StoreRatingService(
            container.resolve(PostgresStoreRatingRepo)
        )
    );

    container.singleton(
        Logger,
        () => new Logger(
            configs.BUN_ENV === "development" ? 
            new ConsoleLogger() : container.resolve(FileLogger)
        )
    );

}