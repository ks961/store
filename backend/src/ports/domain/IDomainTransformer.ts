
export interface IDomainTransformer<Model, Entity> {
    toDomain(model: Model): Entity,
}