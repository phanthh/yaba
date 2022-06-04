import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const saltRounds = 10;

async function seed() {
  try {
    console.log("Generate users  ...");
    const userData: Prisma.UserCreateInput[] = [
      {
        username: "Alice",
        email: "alice@mail.io",
        password: await bcrypt.hash("alice", saltRounds),
        posts: {
          create: [
            {
              title:
                "Enim facilisis gravida neque convallis a cras semper auctor neque",
              content:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Urna id volutpat lacus laoreet non curabitur gravida. Orci dapibus ultrices in iaculis. Ultrices tincidunt arcu non sodales. Euismod quis viverra nibh cras pulvinar. Massa id neque aliquam vestibulum. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim cras. Nibh venenatis cras sed felis eget. Posuere urna nec tincidunt praesent semper feugiat nibh sed pulvinar. Diam in arcu cursus euismod quis viverra nibh cras pulvinar. Sed sed risus pretium quam vulputate dignissim suspendisse in. Pellentesque habitant morbi tristique senectus et netus et malesuada. Et leo duis ut diam. Sed blandit libero volutpat sed cras. Eleifend donec pretium vulputate sapien nec sagittis. Mi tempus imperdiet nulla malesuada pellentesque elit eget. Risus in hendrerit gravida rutrum quisque non tellus orci. Netus et malesuada fames ac turpis egestas integer eget. Vulputate mi sit amet mauris commodo quis imperdiet.",
            },
            {
              title:
                "Adipiscing elit duis tristique sollicitudin nibh sit amet commodo",
              content:
                "In arcu cursus euismod quis viverra nibh cras. Arcu non sodales neque sodales ut. Libero id faucibus nisl tincidunt eget nullam. Blandit turpis cursus in hac habitasse platea dictumst quisque sagittis. Massa id neque aliquam vestibulum morbi blandit. Turpis massa sed elementum tempus egestas sed. Est ullamcorper eget nulla facilisi etiam dignissim. Dolor sit amet consectetur adipiscing elit ut aliquam purus sit. Enim facilisis gravida neque convallis a cras semper auctor neque. Rhoncus dolor purus non enim. Aliquet enim tortor at auctor urna nunc. Amet massa vitae tortor condimentum. Nunc lobortis mattis aliquam faucibus.",
            },
          ],
        },
      },

      {
        username: "Bob",
        email: "bob@mail.io",
        password: await bcrypt.hash("bob", saltRounds),
        posts: {
          create: [
            {
              title: "Nam libero justo laoreet sit amet cursus sit amet",
              content:
                "Orci a scelerisque purus semper eget. Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at augue. Consectetur adipiscing elit duis tristique sollicitudin nibh sit amet commodo. Euismod elementum nisi quis eleifend. Id donec ultrices tincidunt arcu non sodales neque. Nam libero justo laoreet sit amet cursus sit amet. Arcu vitae elementum curabitur vitae nunc sed velit dignissim. Sed elementum tempus egestas sed. Cursus vitae congue mauris rhoncus aenean. Tristique senectus et netus et malesuada fames ac turpis. Adipiscing elit duis tristique sollicitudin nibh sit amet commodo. Malesuada fames ac turpis egestas maecenas pharetra convallis. Risus pretium quam vulputate dignissim suspendisse in est. Et malesuada fames ac turpis egestas. In nulla posuere sollicitudin aliquam ultrices.",
            },
          ],
        },
      },

      {
        username: "Charles",
        email: "charles@mail.io",
        password: await bcrypt.hash("charles", saltRounds),
      },
    ];

    console.log("Start seeding ...");
    for (const u of userData) {
      const user = await prisma.user.create({ data: u });
      console.log(
        `Created user ${user.username} with email: ${
          user.email
        }. Password is ${user.username.toLowerCase()}`
      );
    }
    console.log("Seeding finished!");
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
