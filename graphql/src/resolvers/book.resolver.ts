import { Resolver, Query, Mutation, Arg, UseMiddleware, Int } from "type-graphql";
import { Book } from "../entities/Book";
import { CreateBookInput,UpdateBookInput } from "../typeDefs/book.types";
import { gqlLogMiddleware } from "../utils/middlewares/gqlLogMiddleware";
import { Author } from "../entities/Author";

@Resolver()
export class BookResolver {

  @Query(() => String)
  hello(): string {
    return "world";
  }


  @Query(() => [Book])
  async books(@Arg("limit", { nullable: true }) limit: number,
    @Arg("offset", { nullable: true }) offset: number): Promise<Book[]> {
    let books: Book[];
    books = await Book.find({ relations: ['author'] })
    if (offset && limit) {
      books = books.slice(offset, offset + limit + 1)
    }
    return books
  }


  @Mutation(() => Book)
  @UseMiddleware([gqlLogMiddleware])
  async createBook(@Arg("data") data: CreateBookInput): Promise<Book> {
    const book = Book.create(data);
    await book.save();
    book.author = await Author.findOne({ where: { id: data.authorId } })
    return book;
  }

  @Query(() => Book)
  @UseMiddleware([gqlLogMiddleware])
  async book(@Arg("id", () => Int) id: number): Promise<Book> {
    return await Book.findOneOrFail({ where: { id } });
  }

  @Mutation(() => Book)
  @UseMiddleware([gqlLogMiddleware])
  async updateBook(@Arg("id", () => Int) id: number, @Arg("data") data: UpdateBookInput): Promise<Book> {
    const book = await Book.findOne({ where: { id } });
    if (!book) throw new Error("Book not found!");
    book.author = await Author.findOne({ where: { id: data.authorId } })
    delete data.authorId
    Object.assign(book, data);
    const updBook = await book.save();
    return updBook;
  }

  @Mutation(() => Int)
  @UseMiddleware([gqlLogMiddleware])
  async deleteBook(@Arg("id", () => Int) id: number): Promise<number> {
    const book = await Book.findOne({ where: { id } });
    if (!book) throw new Error("Book not found!");
    await book.remove();
    return id;
  }
}
