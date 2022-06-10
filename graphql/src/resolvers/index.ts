import {MeResolver} from './me.resolver'
import {AuthorResolver} from './author.resolver'
import {BookResolver} from './book.resolver'

export const resolvers = [
    MeResolver,
    BookResolver,
    AuthorResolver,
];