import { SchemaDirectiveVisitor } from 'graphql-tools';
import { defaultFieldResolver } from 'graphql'

export class AccessRightDirective extends SchemaDirectiveVisitor {
    visitObject(type) {
        this.ensureFieldsWrapped(type);
        type._requiredAuthRight = this.args.right;
    }
    // Visitor methods for nested types like fields and arguments
    // also receive a details object that provides information about
    // the parent and grandparent types.
    visitFieldDefinition(field, details) {
        this.ensureFieldsWrapped(details.objectType);
        field._requiredAuthRight = this.args.right;
    }

    ensureFieldsWrapped(objectType) {
        // Mark the GraphQLObjectType object to avoid re-wrapping:
        if (objectType._authFieldsWrapped) return;
        objectType._authFieldsWrapped = true;

        const fields = objectType.getFields();

        Object.keys(fields).forEach(fieldName => {
            const field = fields[fieldName];
            const { resolve = defaultFieldResolver } = field;
            field.resolve = async function (...args) {
                // Get the required Role from the field first, falling back
                // to the objectType if no Role is required by the field:
                const requiredAuthRight =
                    field._requiredAuthRight ||
                    objectType._requiredAuthRight;

                if (!requiredAuthRight) {
                    return resolve.apply(this, args);
                }

                const context = args[2];
                const profile = await context.prisma.user({ id: context.userId }).profile()
                if (profile[requiredAuthRight]) return resolve.apply(this, args);
                return null
                // throw new Error(`Must have right: ${requiredAuthRight}`)
            };
        });
    }
}
