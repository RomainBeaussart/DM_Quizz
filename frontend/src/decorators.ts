import { createDecorator } from 'vue-class-component'

type functionName = (data: any, k?: string) => any

export function Apollo(options?: string | any, queryName?: string | functionName): any {
    return createDecorator((componentOptions, k) => {
        if (options) {
            let def_apollo: any = {
                manual: true,
                result({ data, loading, networkStatus }: { data: any, loading: any, networkStatus: any }) {
                    if (queryName instanceof Function) {
                        this[k] = queryName(data, k)
                    } else if (Array.isArray(data[queryName || k])) {
                        this[k] = data[queryName || k]
                    } else {
                        this[k] = Object.assign({}, data[queryName || k])
                    }
                }
            };
            if (options.query) {
                def_apollo = { ...def_apollo, ...options }
            } else {
                def_apollo.query = options
            }
            ((componentOptions as any).apollo || ((componentOptions as any).apollo = {}) as any)[k] = def_apollo
        }
    })
}
