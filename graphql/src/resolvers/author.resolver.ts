import { Resolver, Query, Mutation, Arg, UseMiddleware, Int } from "type-graphql";
import { Author } from "../entities/Author";
import { CreateAuthorInput, UpdateAuthorInput } from "../typeDefs/author.types";
import { gqlLogMiddleware } from "../utils/middlewares/gqlLogMiddleware";

@Resolver()
export class AuthorResolver {
  @Query(() => [Author])
  async authors(@Arg("limit", { nullable: true }) limit: number,
    @Arg("offset", { nullable: true }) offset: number): Promise<Author[]> {
    let authors: Author[];
    authors = await Author.find({ relations: ['books'] })
    if (offset && limit) {
      authors = authors.slice(offset, offset + limit + 1)
    }
    return authors
  }

  @Query(() => Author)
  async author(@Arg("id", () => Int) id: number): Promise<Author> {
    return await Author.findOneOrFail({ where: { id }, relations: ['books'] });
  }

  @Mutation(() => Author)
  @UseMiddleware([gqlLogMiddleware])
  async createAuthor(@Arg("data") data: CreateAuthorInput): Promise<Author> {
    const author = Author.create(data);
    await author.save();
    return author;
  }

  @Mutation(() => Author)
  @UseMiddleware([gqlLogMiddleware])
  async updateAuthor(@Arg("id", () => Int) id: number, @Arg("data") data: UpdateAuthorInput): Promise<Author> {
    const author = await Author.findOne({ where: { id } });
    if (!author) throw new Error("Author not found!");
    Object.assign(author, data);
    await author.save();
    return author;
  }

  @Mutation(() => Number)
  @UseMiddleware([gqlLogMiddleware])
  async deleteAuthor(@Arg("id", () => Int) id: number): Promise<number> {
    const author = await Author.findOne({ where: { id } });
    if (!author) throw new Error("Author not found!");
    await author.remove();
    return id;
  }
}
